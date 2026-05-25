"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Helper to check if viewer can access a folder
export async function isFolderAccessible(folderId: string | null, previewRole?: string): Promise<boolean> {
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
    
    const effectiveRole = previewRole || viewer.tenantRole || "";
    const isOfficerOrAdmin = previewRole ? false : ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
    const isAdmin = previewRole ? false : ["owner", "admin", "system_admin"].includes(viewer.tenantRole ?? "");
    const isPlatformAdmin = previewRole ? false : viewer.isPlatformAdmin;

    if (folder.visibility === "password_protected") {
      const isUnlocked = cookieStore.get(`folder_unlock_${folder.id}`)?.value === "true";
      if (!isUnlocked && !isOfficerOrAdmin && !isPlatformAdmin) {
         return false;
      }
    } else if (folder.visibility === "roles") {
      const { data: roles } = await userClient.from("document_access_roles").select("role").eq("folder_id", folder.id);
      const allowedRoles = roles?.map(r => r.role) || [];
      const hasRole = allowedRoles.includes(effectiveRole) || isPlatformAdmin || isAdmin;
      if (!hasRole) return false;
    } else if (folder.visibility === "members") {
      const { data: members } = await userClient.from("document_access_members").select("user_id").eq("folder_id", folder.id);
      const allowedMembers = members?.map(m => m.user_id) || [];
      const isMember = allowedMembers.includes(viewer.id) || isPlatformAdmin || isAdmin; 
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

function getUniqueName(desiredName: string, existingNames: Set<string>, isFile: boolean = false, isCopy: boolean = false): string {
  if (!existingNames.has(desiredName)) return desiredName;
  
  let baseName = desiredName;
  let ext = "";
  
  if (isFile) {
    const lastDot = desiredName.lastIndexOf('.');
    if (lastDot > 0) {
      baseName = desiredName.substring(0, lastDot);
      ext = desiredName.substring(lastDot);
    }
  }

  const copyMatch = baseName.match(/ \(Copy - (\d+)\)$/);
  const numMatch = baseName.match(/ \((\d+)\)$/);
  
  let prefix = baseName;
  let useCopyFormat = isCopy;

  if (copyMatch) {
    prefix = baseName.substring(0, copyMatch.index);
    useCopyFormat = true;
  } else if (numMatch) {
    prefix = baseName.substring(0, numMatch.index);
  }

  let counter = 1;
  let newName = "";
  do {
    if (useCopyFormat) {
      newName = `${prefix} (Copy - ${counter})${ext}`;
    } else {
      newName = `${prefix} (${counter})${ext}`;
    }
    counter++;
  } while (existingNames.has(newName));

  return newName;
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

  const { data: existingDocs } = await userClient
    .from("documents")
    .select("file_name, title")
    .eq("tenant_id", tenant.id)
    .eq(input.folder_id ? "folder_id" : "folder_id", input.folder_id ? input.folder_id : null); // null check works oddly in supabase, but we can do is
    // Actually, eq works fine for null in some versions but to be safe:
    
  let existingQuery = userClient.from("documents").select("file_name, title").eq("tenant_id", tenant.id);
  if (input.folder_id) existingQuery = existingQuery.eq("folder_id", input.folder_id);
  else existingQuery = existingQuery.is("folder_id", null);
  
  const { data: currentDocs } = await existingQuery;
  const existingFileNames = new Set(currentDocs?.map(d => d.file_name) || []);
  const existingTitles = new Set(currentDocs?.map(d => d.title) || []);

  const uniqueFileName = getUniqueName(file.name, existingFileNames, true);
  const uniqueTitle = getUniqueName(input.title, existingTitles, false);

  const { data, error: dbError } = await userClient
    .from("documents")
    .insert({
      tenant_id: tenant.id,
      title: uniqueTitle,
      category: input.category,
      file_name: uniqueFileName,
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
      const { error: insErr } = await userClient.from("document_access_roles").insert({ tenant_id: tenant.id, document_id: data.id, role });
      if (insErr) throw new Error("Failed to insert role: " + insErr.message);
    }
  } else if (input.visibility === "members" && input.allowed_members) {
    const members = input.allowed_members.split(",").map(m => m.trim());
    for (const memberId of members) {
      const { error: insErr } = await userClient.from("document_access_members").insert({ tenant_id: tenant.id, document_id: data.id, user_id: memberId });
      if (insErr) throw new Error("Failed to insert member: " + insErr.message);
    }
  }

  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
  return data;
}

export async function getDocuments(category?: string, folderId?: string | null, previewRole?: string) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient) return [];
  
  // Check inheritance
  const canViewFolder = await isFolderAccessible(folderId || null, previewRole);
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
  const effectiveRole = previewRole || viewer?.tenantRole || "";
  const isOfficerOrAdmin = previewRole ? false : ["owner", "admin", "officer", "system_admin"].includes(viewer?.tenantRole ?? "");
  const isAdmin = previewRole ? false : ["owner", "admin", "system_admin"].includes(viewer?.tenantRole ?? "");
  const isPlatformAdmin = previewRole ? false : viewer?.isPlatformAdmin;

  const filtered = [];
  for (const doc of data) {
    if (doc.visibility === "public") {
      filtered.push(doc);
    } else if (doc.visibility === "password_protected") {
      const isUnlocked = cookieStore.get(`folder_unlock_${doc.id}`)?.value === "true"; // using same cookie prefix for doc if needed, but docs can also be pwd protected?
      if (isUnlocked || isOfficerOrAdmin || isPlatformAdmin) filtered.push(doc);
    } else if (doc.visibility === "roles") {
      const { data: roles } = await userClient.from("document_access_roles").select("role").eq("document_id", doc.id);
      const allowedRoles = roles?.map(r => r.role) || [];
      if (allowedRoles.includes(effectiveRole) || isPlatformAdmin || isAdmin) filtered.push(doc);
    } else if (doc.visibility === "members") {
      const { data: members } = await userClient.from("document_access_members").select("user_id").eq("document_id", doc.id);
      const allowedMembers = members?.map(m => m.user_id) || [];
      if (viewer && allowedMembers.includes(viewer.id) || isPlatformAdmin || isAdmin) filtered.push(doc);
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
    if (!allowedRoles.includes(viewer.tenantRole ?? "") && !viewer.isPlatformAdmin && !isAdmin) throw new Error("Unauthorized role");
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

  let existingQuery = userClient.from("document_folders").select("name").eq("tenant_id", tenant.id);
  if (parentId) existingQuery = existingQuery.eq("parent_id", parentId);
  else existingQuery = existingQuery.is("parent_id", null);
  
  const { data: currentFolders } = await existingQuery;
  const existingNames = new Set(currentFolders?.map(f => f.name) || []);
  const uniqueName = getUniqueName(name.trim(), existingNames, false);

  let passwordHash = null;
  if (visibility === "password_protected" && password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const { data, error } = await userClient
    .from("document_folders")
    .insert({
      tenant_id: tenant.id,
      name: uniqueName,
      parent_id: parentId,
      visibility,
      password_hash: passwordHash
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

export async function getFolders(parentId?: string | null, previewRole?: string) {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient) return [];
  
  // Check inheritance
  const canViewFolder = await isFolderAccessible(parentId || null, previewRole);
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
  const effectiveRole = previewRole || viewer?.tenantRole || "";
  const isAdmin = previewRole ? false : ["owner", "admin", "system_admin"].includes(viewer?.tenantRole ?? "");
  const isPlatformAdmin = previewRole ? false : viewer?.isPlatformAdmin;

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
      if (allowedRoles.includes(effectiveRole) || isPlatformAdmin || isAdmin) filtered.push(folder);
    } else if (folder.visibility === "members") {
      const { data: members } = await userClient.from("document_access_members").select("user_id").eq("folder_id", folder.id);
      const allowedMembers = members?.map(m => m.user_id) || [];
      if (viewer && allowedMembers.includes(viewer.id) || isPlatformAdmin || isAdmin) filtered.push(folder);
    }
  }

  return filtered;
}

export async function renameFolder(folderId: string, newName: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  
  const { data: folder } = await userClient.from("document_folders").select("parent_id").eq("id", folderId).single();
  const { data: siblings } = await userClient.from("document_folders").select("name").eq("tenant_id", tenant.id).eq("parent_id", folder?.parent_id ?? null);
  const existingNames = new Set(siblings?.map(f => f.name) || []);
  const uniqueName = getUniqueName(newName, existingNames, false);

  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  const { error } = await userClient
    .from("document_folders")
    .update({ name: uniqueName })
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

  const { data: doc } = await userClient.from("documents").select("folder_id, title").eq("id", documentId).single();
  const { data: siblings } = await userClient.from("documents").select("title").eq("tenant_id", tenant.id).eq("folder_id", doc?.folder_id ?? null);
  const existingTitles = new Set(siblings?.map(d => d.title) || []);
  const uniqueTitle = getUniqueName(newTitle.trim(), existingTitles, false);

  const { error } = await userClient.from("documents").update({ title: uniqueTitle }).eq("id", documentId).eq("tenant_id", tenant.id);
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

export async function moveFolder(folderId: string, targetFolderId: string | null) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");
  
  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  if (targetFolderId === folderId) throw new Error("Cannot move a folder into itself");
  if (targetFolderId) {
    let currentId: string | null = targetFolderId;
    while (currentId) {
      if (currentId === folderId) throw new Error("Cannot move a folder into its own subfolder");
      const { data: parent } = await userClient.from("document_folders").select("parent_id").eq("id", currentId).single() as { data: { parent_id: string | null } | null };
      currentId = parent?.parent_id || null;
    }
  }

  const { data: folderToMove } = await userClient.from("document_folders").select("name").eq("id", folderId).single();
  if (!folderToMove) throw new Error("Folder not found");
  
  let existingQuery = userClient.from("document_folders").select("name").eq("tenant_id", tenant.id);
  if (targetFolderId) existingQuery = existingQuery.eq("parent_id", targetFolderId);
  else existingQuery = existingQuery.is("parent_id", null);
  
  const { data: currentFolders } = await existingQuery;
  const existingNames = new Set(currentFolders?.map(f => f.name) || []);
  const uniqueName = getUniqueName(folderToMove.name, existingNames, false);

  const { error } = await userClient.from("document_folders").update({ parent_id: targetFolderId, name: uniqueName }).eq("id", folderId).eq("tenant_id", tenant.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
}

export async function copyDocument(documentId: string, targetFolderId?: string | null) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");

  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  const { data: doc } = await userClient.from("documents").select("*").eq("id", documentId).single();
  if (!doc) throw new Error("Document not found");

  const actualTargetFolder: string | null = targetFolderId !== undefined ? targetFolderId : doc.folder_id;

  let existingQuery = userClient.from("documents").select("title, file_name").eq("tenant_id", tenant.id);
  if (actualTargetFolder) existingQuery = existingQuery.eq("folder_id", actualTargetFolder);
  else existingQuery = existingQuery.is("folder_id", null);
  
  const { data: currentDocs } = await existingQuery;
  const existingTitles = new Set(currentDocs?.map(d => d.title) || []);
  const existingFileNames = new Set(currentDocs?.map(d => d.file_name) || []);

  const uniqueTitle = getUniqueName(doc.title, existingTitles, false, true);
  const uniqueFileName = getUniqueName(doc.file_name, existingFileNames, true, true);

  const fileExt = doc.file_name.split('.').pop();
  const newStoragePath = `${tenant.id}/${crypto.randomUUID()}.${fileExt}`;
  
  const { error: copyError } = await userClient.storage.from("org-documents").copy(doc.storage_path, newStoragePath);
  if (copyError) throw new Error(`Storage copy failed: ${copyError.message}`);

  const { data: newDoc, error: insertError } = await userClient.from("documents").insert({
    tenant_id: tenant.id,
    title: uniqueTitle,
    category: doc.category,
    file_name: uniqueFileName,
    file_size: doc.file_size,
    storage_path: newStoragePath,
    uploaded_by: viewer.id,
    folder_id: actualTargetFolder,
    visibility: doc.visibility,
    password_hash: doc.password_hash
  }).select().single();

  if (insertError) {
    await userClient.storage.from("org-documents").remove([newStoragePath]);
    throw new Error(`Database insert failed: ${insertError.message}`);
  }

  if (doc.visibility === "roles") {
    const { data: roles } = await userClient.from("document_access_roles").select("role").eq("document_id", documentId);
    if (roles) {
      for (const r of roles) {
        await userClient.from("document_access_roles").insert({ tenant_id: tenant.id, document_id: newDoc.id, role: r.role });
      }
    }
  } else if (doc.visibility === "members") {
    const { data: members } = await userClient.from("document_access_members").select("user_id").eq("document_id", documentId);
    if (members) {
      for (const m of members) {
        await userClient.from("document_access_members").insert({ tenant_id: tenant.id, document_id: newDoc.id, user_id: m.user_id });
      }
    }
  }

  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
  return newDoc;
}

export async function copyFolder(folderId: string, targetFolderId?: string | null) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");

  const isOfficerOrAdmin = ["owner", "admin", "officer", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isOfficerOrAdmin) throw new Error("Unauthorized");

  const { data: folder } = await userClient.from("document_folders").select("*").eq("id", folderId).single();
  if (!folder) throw new Error("Folder not found");

  const actualTargetFolder: string | null = targetFolderId !== undefined ? targetFolderId : folder.parent_id;
  
  if (actualTargetFolder === folderId) throw new Error("Cannot copy a folder into itself");
  if (actualTargetFolder) {
    let currentId: string | null = actualTargetFolder;
    while (currentId) {
      if (currentId === folderId) throw new Error("Cannot copy a folder into its own subfolder");
      const { data: parentFolder } = await userClient.from("document_folders").select("parent_id").eq("id", currentId).single() as { data: { parent_id: string | null } | null };
      currentId = parentFolder?.parent_id || null;
    }
  }

  let existingQuery = userClient.from("document_folders").select("name").eq("tenant_id", tenant.id);
  if (actualTargetFolder) existingQuery = existingQuery.eq("parent_id", actualTargetFolder);
  else existingQuery = existingQuery.is("parent_id", null);
  
  const { data: currentFolders } = await existingQuery;
  const existingNames = new Set(currentFolders?.map(f => f.name) || []);
  const uniqueName = getUniqueName(folder.name, existingNames, false, true);

  const { data: newFolder, error: insertError } = await userClient.from("document_folders").insert({
    tenant_id: tenant.id,
    name: uniqueName,
    parent_id: actualTargetFolder,
    visibility: folder.visibility,
    password_hash: folder.password_hash
  }).select().single();

  if (insertError) throw new Error(`Failed to copy folder: ${insertError.message}`);

  if (folder.visibility === "roles") {
    const { data: roles } = await userClient.from("document_access_roles").select("role").eq("folder_id", folderId);
    if (roles) {
      for (const r of roles) {
        await userClient.from("document_access_roles").insert({ tenant_id: tenant.id, folder_id: newFolder.id, role: r.role });
      }
    }
  } else if (folder.visibility === "members") {
    const { data: members } = await userClient.from("document_access_members").select("user_id").eq("folder_id", folderId);
    if (members) {
      for (const m of members) {
        await userClient.from("document_access_members").insert({ tenant_id: tenant.id, folder_id: newFolder.id, user_id: m.user_id });
      }
    }
  }

  const { data: docs } = await userClient.from("documents").select("id").eq("folder_id", folderId);
  if (docs) {
    for (const doc of docs) {
      await copyDocument(doc.id, newFolder.id);
    }
  }

  const { data: subfolders } = await userClient.from("document_folders").select("id").eq("parent_id", folderId);
  if (subfolders) {
    for (const sub of subfolders) {
      await copyFolder(sub.id, newFolder.id);
    }
  }

  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
}

export async function getAccessConfig(id: string, type: "folder" | "document") {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient) throw new Error("Unauthorized");
  
  const table = type === "folder" ? "document_folders" : "documents";
  const { data: item } = await userClient.from(table).select("visibility").eq("id", id).single();
  if (!item) throw new Error("Not found");

  let roles: string[] = [];
  let members: string[] = [];

  if (item.visibility === "roles") {
    const rolesTable = type === "folder" ? "document_access_roles" : "document_access_roles";
    const { data: r } = await userClient.from(rolesTable).select("role").eq(type === "folder" ? "folder_id" : "document_id", id);
    if (r) roles = r.map((x: { role: string }) => x.role);
  } else if (item.visibility === "members") {
    const membersTable = type === "folder" ? "document_access_members" : "document_access_members";
    const { data: m } = await userClient.from(membersTable).select("user_id").eq(type === "folder" ? "folder_id" : "document_id", id);
    if (m) members = m.map((x: { user_id: string }) => x.user_id);
  }

  return { visibility: item.visibility, allowedRoles: roles, allowedMembers: members };
}

export async function updateVisibility(
  id: string, 
  type: "folder" | "document", 
  visibility: "public" | "roles" | "members" | "password_protected", 
  password?: string | null, 
  allowedRoles?: string[] | null, 
  allowedMembers?: string[] | null
) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  if (!tenant || !userClient || !viewer) throw new Error("Unauthorized");

  const isAdmin = ["owner", "admin", "system_admin"].includes(viewer.tenantRole ?? "");
  if (!viewer.isPlatformAdmin && !isAdmin) throw new Error("Unauthorized");

  let passwordHash: string | null | undefined = undefined;
  if (visibility === "password_protected" && password) {
    passwordHash = await bcrypt.hash(password, 10);
  } else if (visibility !== "password_protected") {
    passwordHash = null;
  }

  const table = type === "folder" ? "document_folders" : "documents";
  
  const updateData: { visibility: string; password_hash?: string | null } = { visibility };
  if (passwordHash !== undefined) updateData.password_hash = passwordHash;
  
  const { error } = await userClient.from(table).update(updateData).eq("id", id).eq("tenant_id", tenant.id);
  if (error) throw new Error(error.message);

  const col = type === "folder" ? "folder_id" : "document_id";
  const { error: delRolesErr } = await userClient.from("document_access_roles").delete().eq(col, id);
  if (delRolesErr) throw new Error("Failed to clear roles: " + delRolesErr.message);
  
  const { error: delMembersErr } = await userClient.from("document_access_members").delete().eq(col, id);
  if (delMembersErr) throw new Error("Failed to clear members: " + delMembersErr.message);

  if (visibility === "roles" && allowedRoles) {
    for (const role of allowedRoles) {
      const { error: insErr } = await userClient.from("document_access_roles").insert({ tenant_id: tenant.id, [col]: id, role });
      if (insErr) throw new Error("Failed to insert role: " + insErr.message);
    }
  } else if (visibility === "members" && allowedMembers) {
    for (const memberId of allowedMembers) {
      const { error: insErr } = await userClient.from("document_access_members").insert({ tenant_id: tenant.id, [col]: id, user_id: memberId });
      if (insErr) throw new Error("Failed to insert member: " + insErr.message);
    }
  }

  revalidatePath(`/admin/documents`);
  revalidatePath(`/officer/documents`);
  revalidatePath(`/member/documents`);
}

