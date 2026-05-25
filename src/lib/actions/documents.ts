"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Helper to check if viewer can access a folder
export async function isFolderAccessible(folderId: string | null): Promise<boolean> {
  if (!folderId) return true; // root is public by default unless specific tenant policies apply
  
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  
  if (!tenant || !userClient || !viewer) return false;
  
  const { data: allFolders } = await userClient
    .from("document_folders")
    .select("id, parent_id, visibility")
    .eq("tenant_id", tenant.id);
    
  if (!allFolders) return false;
  
  const cookieStore = await cookies();
  
  let currentId: string | null = folderId;
  while (currentId) {
    const folder = allFolders.find(f => f.id === currentId);
    if (!folder) break;
    
    const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
    const isAdmin = ["owner", "admin", "system_admin"].includes(viewer.tenantRole ?? "");

    if (folder.visibility === "password_protected") {
      const isUnlocked = cookieStore.get(`folder_unlock_${folder.id}`)?.value === "true";
      if (!isUnlocked && !isOfficerOrAdmin && !viewer.isPlatformAdmin) {
         return false;
      }
    } else if (folder.visibility === "roles") {
      const { data: roles } = await userClient.from("document_access_roles").select("role").eq("folder_id", folder.id);
      const allowedRoles = roles?.map(r => r.role) || [];
      const hasRole = allowedRoles.includes(viewer.tenantRole ?? "") || viewer.isPlatformAdmin;
      if (!hasRole) return false;
    } else if (folder.visibility === "members") {
      const { data: members } = await userClient.from("document_access_members").select("user_id").eq("folder_id", folder.id);
      const allowedMembers = members?.map(m => m.user_id) || [];
      const isMember = allowedMembers.includes(viewer.id) || viewer.isPlatformAdmin || isAdmin; 
      if (!isMember) return false;
    }
    
    currentId = folder.parent_id;
  }
  
  return true;
}

export async function checkFolderAccess(folderId: string): Promise<'granted' | 'password_required' | 'denied'> {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient || !viewer) return 'denied';
  
  const { data: folder } = await userClient.from("document_folders").select("visibility").eq("id", folderId).single();
  if (!folder) return 'denied';

  const canAccess = await isFolderAccessible(folderId);
  if (canAccess) return 'granted';
  
  if (folder.visibility === "password_protected") return 'password_required';
  return 'denied';
}

export async function verifyFolderPassword(folderId: string, passwordAttempt: string) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();
  
  if (!tenant || !userClient) throw new Error("Unauthorized");
  
  const { data: folder } = await userClient
    .from("document_folders")
    .select("password_hash")
    .eq("id", folderId)
    .single();
    
  if (!folder || !folder.password_hash) throw new Error("Folder is not password protected");
  
  const isValid = await bcrypt.compare(passwordAttempt, folder.password_hash);
  if (!isValid) throw new Error("Incorrect password");
  
  const cookieStore = await cookies();
  cookieStore.set(`folder_unlock_${folderId}`, "true", { path: "/", maxAge: 60 * 60 * 24 });
  
  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
  return true;
}

const uploadDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["constitution", "minutes", "forms", "guides", "other"]),
  folder_id: z.string().uuid().optional().nullable(),
  visibility: z.enum(['public', 'roles', 'members', 'password_protected']).default('public'),
  password: z.string().optional().nullable(),
  allowed_roles: z.string().optional().nullable(),
  allowed_members: z.string().optional().nullable(),
});

export async function uploadDocument(formData: FormData) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");

  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("You do not have permission to upload documents.");

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file uploaded");
  if (file.size > 50 * 1024 * 1024) throw new Error("File size must be less than 50MB");

  const rawData = {
    title: formData.get("title"),
    category: formData.get("category"),
    folder_id: formData.get("folder_id") || null,
    visibility: formData.get("visibility") || "public",
    password: formData.get("password") || null,
    allowed_roles: formData.get("allowed_roles") || null,
    allowed_members: formData.get("allowed_members") || null,
  };

  const input = uploadDocumentSchema.parse(rawData);
  
  let passwordHash = null;
  if (input.visibility === "password_protected" && input.password) {
    passwordHash = await bcrypt.hash(input.password, 10);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const storagePath = `${tenant.id}/${fileName}`;

  const { error: uploadError } = await userClient
    .storage
    .from("org-documents")
    .upload(storagePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

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
      visibility: input.visibility,
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (dbError) {
    await userClient.storage.from("org-documents").remove([storagePath]);
    throw new Error(`Database insert failed: ${dbError.message}`);
  }
  
  if (input.visibility === "roles" && input.allowed_roles) {
    const roles = input.allowed_roles.split(",").map(r => r.trim());
    for (const role of roles) {
      await userClient.from("document_access_roles").insert({ tenant_id: tenant.id, document_id: data.id, role });
    }
  } else if (input.visibility === "members" && input.allowed_members) {
    const members = input.allowed_members.split(",").map(m => m.trim());
    for (const memberId of members) {
      await userClient.from("document_access_members").insert({ tenant_id: tenant.id, document_id: data.id, user_id: memberId });
    }
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
  
  // Check inheritance
  const canViewFolder = await isFolderAccessible(folderId || null);
  if (!canViewFolder) return [];

  let query = userClient
    .from("documents")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  if (category && category !== "all") query = query.eq("category", category);

  if (folderId === null) {
    query = query.is("folder_id", null);
  } else if (folderId) {
    query = query.eq("folder_id", folderId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Filter individual document visibility (same logic as folder)
  const viewer = await getCurrentViewer();
  const cookieStore = await cookies();
  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer?.tenantRole ?? "");
  const isAdmin = ["owner", "admin", "system_admin"].includes(viewer?.tenantRole ?? "");

  const filtered = [];
  for (const doc of data) {
    if (doc.visibility === "public") {
      filtered.push(doc);
    } else if (doc.visibility === "password_protected") {
      const isUnlocked = cookieStore.get(`folder_unlock_${doc.id}`)?.value === "true"; // using same cookie prefix for doc if needed, but docs can also be pwd protected?
      if (isUnlocked || isOfficerOrAdmin || viewer?.isPlatformAdmin) filtered.push(doc);
    } else if (doc.visibility === "roles") {
      const { data: roles } = await userClient.from("document_access_roles").select("role").eq("document_id", doc.id);
      const allowedRoles = roles?.map(r => r.role) || [];
      if (allowedRoles.includes(viewer?.tenantRole ?? "") || viewer?.isPlatformAdmin) filtered.push(doc);
    } else if (doc.visibility === "members") {
      const { data: members } = await userClient.from("document_access_members").select("user_id").eq("document_id", doc.id);
      const allowedMembers = members?.map(m => m.user_id) || [];
      if (viewer && allowedMembers.includes(viewer.id) || viewer?.isPlatformAdmin || isAdmin) filtered.push(doc);
    }
  }

  return filtered;
}

export async function getDownloadUrl(documentId: string) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();
  const viewer = await getCurrentViewer();
  const cookieStore = await cookies();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");

  const { data: doc, error: docError } = await userClient
    .from("documents")
    .select("storage_path, file_name, folder_id, visibility, id")
    .eq("id", documentId)
    .eq("tenant_id", tenant.id)
    .single();

  if (docError || !doc) throw new Error("Document not found");

  // Verify inheritance access
  const canViewFolder = await isFolderAccessible(doc.folder_id);
  if (!canViewFolder) throw new Error("Unauthorized to access parent folder");

  // Verify direct document access
  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  const isAdmin = ["owner", "admin", "system_admin"].includes(viewer.tenantRole ?? "");
  
  if (doc.visibility === "password_protected") {
    const isUnlocked = cookieStore.get(`folder_unlock_${doc.id}`)?.value === "true";
    if (!isUnlocked && !isOfficerOrAdmin && !viewer.isPlatformAdmin) throw new Error("Password required");
  } else if (doc.visibility === "roles") {
    const { data: roles } = await userClient.from("document_access_roles").select("role").eq("document_id", doc.id);
    const allowedRoles = roles?.map(r => r.role) || [];
    if (!allowedRoles.includes(viewer.tenantRole ?? "") && !viewer.isPlatformAdmin) throw new Error("Unauthorized role");
  } else if (doc.visibility === "members") {
    const { data: members } = await userClient.from("document_access_members").select("user_id").eq("document_id", doc.id);
    const allowedMembers = members?.map(m => m.user_id) || [];
    if (!allowedMembers.includes(viewer.id) && !viewer.isPlatformAdmin && !isAdmin) throw new Error("Unauthorized member");
  }

  const { data, error } = await userClient.storage.from("org-documents").createSignedUrl(doc.storage_path, 60, { download: doc.file_name });
  if (error || !data) throw new Error("Could not generate download URL");
  return data.signedUrl;
}

export async function deleteDocument(documentId: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  const isAdmin = ["owner", "admin", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isAdmin) throw new Error("You do not have permission to delete documents.");

  const { data: doc, error: docError } = await userClient.from("documents").select("storage_path").eq("id", documentId).eq("tenant_id", tenant.id).single();
  if (docError || !doc) throw new Error("Document not found");

  const { error: dbError } = await userClient.from("documents").delete().eq("id", documentId).eq("tenant_id", tenant.id);
  if (dbError) throw new Error(dbError.message);

  await userClient.storage.from("org-documents").remove([doc.storage_path]);

  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
  return true;
}

export async function createFolder(
  name: string, 
  parentId?: string | null, 
  visibility: 'public' | 'roles' | 'members' | 'password_protected' = 'public',
  password?: string | null,
  allowedRoles?: string[],
  allowedMembers?: string[]
) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  let passwordHash = null;
  if (visibility === "password_protected" && password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const { data, error } = await userClient
    .from("document_folders")
    .insert({
      tenant_id: tenant.id,
      name,
      parent_id: parentId || null,
      visibility,
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  if (visibility === "roles" && allowedRoles && allowedRoles.length > 0) {
    for (const role of allowedRoles) {
      await userClient.from("document_access_roles").insert({ tenant_id: tenant.id, folder_id: data.id, role });
    }
  } else if (visibility === "members" && allowedMembers && allowedMembers.length > 0) {
    for (const memberId of allowedMembers) {
      await userClient.from("document_access_members").insert({ tenant_id: tenant.id, folder_id: data.id, user_id: memberId });
    }
  }

  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
  return data;
}

export async function getFolders(parentId?: string | null) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient) return [];
  
  // Check inheritance
  const canViewFolder = await isFolderAccessible(parentId || null);
  if (!canViewFolder) return [];

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

  const viewer = await getCurrentViewer();
  const isAdmin = ["owner", "admin", "system_admin"].includes(viewer?.tenantRole ?? "");

  const filtered = [];
  for (const folder of data) {
    // Note: We return password_protected folders so users can click them and enter the password
    // We only filter out roles/members if they don't have access.
    // Wait, if we return password_protected folders, they can see the name of the folder. That's usually expected.
    // So we don't filter out password_protected folders here.
    if (folder.visibility === "public" || folder.visibility === "password_protected") {
      filtered.push(folder);
    } else if (folder.visibility === "roles") {
      const { data: roles } = await userClient.from("document_access_roles").select("role").eq("folder_id", folder.id);
      const allowedRoles = roles?.map(r => r.role) || [];
      if (allowedRoles.includes(viewer?.tenantRole ?? "") || viewer?.isPlatformAdmin) filtered.push(folder);
    } else if (folder.visibility === "members") {
      const { data: members } = await userClient.from("document_access_members").select("user_id").eq("folder_id", folder.id);
      const allowedMembers = members?.map(m => m.user_id) || [];
      if (viewer && allowedMembers.includes(viewer.id) || viewer?.isPlatformAdmin || isAdmin) filtered.push(folder);
    }
  }

  return filtered;
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

  const { error } = await userClient.from("document_folders").delete().eq("id", folderId).eq("tenant_id", tenant.id);
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

  const { error } = await userClient.from("documents").update({ title: newTitle }).eq("id", documentId).eq("tenant_id", tenant.id);
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

  const { error } = await userClient.from("documents").update({ folder_id: targetFolderId }).eq("id", documentId).eq("tenant_id", tenant.id);
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
