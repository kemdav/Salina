"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { z } from "zod";

const uploadDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["constitution", "minutes", "forms", "guides", "other"]),
});

export async function uploadDocument(formData: FormData) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) {
    throw new Error("Unauthorized");
  }

  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) {
    throw new Error("You do not have permission to upload documents.");
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("No file uploaded");
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error("File size must be less than 50MB");
  }

  const rawData = {
    title: formData.get("title"),
    category: formData.get("category"),
  };

  const input = uploadDocumentSchema.parse(rawData);

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const storagePath = `${tenant.id}/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await userClient
    .storage
    .from("org-documents")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // Insert into database
  const { data, error: dbError } = await userClient
    .from("documents")
    .insert({
      tenant_id: tenant.id,
      title: input.title,
      category: input.category,
      file_name: file.name,
      file_size: file.size,
      storage_path: storagePath,
      uploaded_by: viewer.id,
    })
    .select()
    .single();

  if (dbError) {
    // Attempt to rollback storage if DB insert fails
    await userClient.storage.from("org-documents").remove([storagePath]);
    throw new Error(`Database insert failed: ${dbError.message}`);
  }

  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
  return data;
}

export async function getDocuments(category?: string) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient) return [];

  let query = userClient
    .from("documents")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data;
}

export async function getDownloadUrl(documentId: string) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient) {
    throw new Error("Unauthorized");
  }

  // First get the document to find the storage path
  const { data: doc, error: docError } = await userClient
    .from("documents")
    .select("storage_path, file_name")
    .eq("id", documentId)
    .eq("tenant_id", tenant.id)
    .single();

  if (docError || !doc) {
    throw new Error("Document not found");
  }

  // Generate signed URL
  const { data, error } = await userClient
    .storage
    .from("org-documents")
    .createSignedUrl(doc.storage_path, 60, {
      download: doc.file_name,
    });

  if (error || !data) {
    throw new Error("Could not generate download URL");
  }

  return data.signedUrl;
}

export async function deleteDocument(documentId: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) {
    throw new Error("Unauthorized");
  }

  const isAdmin = ["owner", "admin", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isAdmin) {
    throw new Error("You do not have permission to delete documents.");
  }

  // Get the document first to get the storage path
  const { data: doc, error: docError } = await userClient
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .eq("tenant_id", tenant.id)
    .single();

  if (docError || !doc) {
    throw new Error("Document not found");
  }

  // Delete from database
  const { error: dbError } = await userClient
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("tenant_id", tenant.id);

  if (dbError) throw new Error(dbError.message);

  // Delete from storage
  await userClient.storage.from("org-documents").remove([doc.storage_path]);

  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
  return true;
}
