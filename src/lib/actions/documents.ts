"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { z } from "zod";

const uploadDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["constitution", "minutes", "forms", "guides", "other"]),
  folder_id: z.string().uuid().optional().nullable(),
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
    folder_id: formData.get("folder_id") || null,
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
      folder_id: input.folder_id,
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

export async function getDocuments(category?: string, folderId?: string | null) {
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

  if (folderId === null) {
    query = query.is("folder_id", null);
  } else if (folderId) {
    query = query.eq("folder_id", folderId);
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

export async function createFolder(name: string, parentId?: string | null) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  const { data, error } = await userClient
    .from("document_folders")
    .insert({
      tenant_id: tenant.id,
      name,
      parent_id: parentId || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
  return data;
}

export async function getFolders(parentId?: string | null) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient) return [];

  let query = userClient
    .from("document_folders")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("name", { ascending: true });

  if (parentId === null) {
    query = query.is("parent_id", null);
  } else if (parentId) {
    query = query.eq("parent_id", parentId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function renameFolder(folderId: string, newName: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  const { error } = await userClient
    .from("document_folders")
    .update({ name: newName })
    .eq("id", folderId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
}

export async function deleteFolder(folderId: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  const isAdmin = ["owner", "admin", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isAdmin) throw new Error("Unauthorized");

  // cascade delete will handle documents inside, but we need to delete files from storage.
  // Actually, we must fetch all nested documents to delete from storage first. 
  // For simplicity, let's just delete the DB record. Storage deletion for folder cascade requires a more complex Edge Function or recursive fetch.
  // We'll recursively fetch all document storage paths in this folder tree.
  // To avoid complex recursion, we can fetch all documents in the tenant and filter by folder in TS.
  const { data: allDocs } = await userClient.from("documents").select("id, folder_id, storage_path").eq("tenant_id", tenant.id);
  const { data: allFolders } = await userClient.from("document_folders").select("id, parent_id").eq("tenant_id", tenant.id);
  
  if (allDocs && allFolders) {
    const foldersToDelete = new Set<string>([folderId]);
    let added = true;
    while (added) {
      added = false;
      for (const f of allFolders) {
        if (f.parent_id && foldersToDelete.has(f.parent_id) && !foldersToDelete.has(f.id)) {
          foldersToDelete.add(f.id);
          added = true;
        }
      }
    }
    const pathsToDelete = allDocs.filter(d => d.folder_id && foldersToDelete.has(d.folder_id)).map(d => d.storage_path);
    if (pathsToDelete.length > 0) {
      await userClient.storage.from("org-documents").remove(pathsToDelete);
    }
  }

  const { error } = await userClient
    .from("document_folders")
    .delete()
    .eq("id", folderId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
}

export async function renameDocument(documentId: string, newTitle: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  const { error } = await userClient
    .from("documents")
    .update({ title: newTitle })
    .eq("id", documentId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
}

export async function moveDocument(documentId: string, targetFolderId: string | null) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  const { error } = await userClient
    .from("documents")
    .update({ folder_id: targetFolderId })
    .eq("id", documentId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
}

export async function getFolderBreadcrumbs(folderId: string) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient) return [];

  const { data: allFolders } = await userClient
    .from("document_folders")
    .select("id, name, parent_id")
    .eq("tenant_id", tenant.id);

  if (!allFolders) return [];

  const breadcrumbs: { id: string; name: string }[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder = allFolders.find((f: { id: string; name: string; parent_id: string | null }) => f.id === currentId);
    if (!folder) break;
    breadcrumbs.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parent_id;
  }

  return breadcrumbs;
}
