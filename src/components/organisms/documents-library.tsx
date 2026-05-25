"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import { createPortal } from "react-dom";
import { 
  uploadDocument, deleteDocument, getDownloadUrl, 
  createFolder, deleteFolder, renameFolder, 
  renameDocument, moveDocument, getFolders
} from "@/lib/actions/documents";
import { FeedbackModal, type FeedbackTone } from "@/components/organisms/feedback-modal";

export type FolderMetadata = {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export type DocumentMetadata = {
  id: string;
  title: string;
  category: string;
  file_name: string;
  file_size: number;
  created_at: string;
  folder_id: string | null;
};

type DocumentsLibraryProps = {
  initialDocuments: DocumentMetadata[];
  initialFolders: FolderMetadata[];
  currentFolderId: string | null;
  breadcrumbs: { id: string; name: string }[];
  canManage: boolean; // officers and admins
  canDelete: boolean; // admins only
};

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function DocumentsLibrary({ 
  initialDocuments, 
  initialFolders, 
  currentFolderId, 
  breadcrumbs, 
  canManage, 
  canDelete 
}: DocumentsLibraryProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [renameTarget, setRenameTarget] = useState<{ id: string, type: "folder" | "document", name: string } | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [moveTarget, setMoveTarget] = useState<{ id: string, type: "document" } | null>(null);

  const [feedbackConfig, setFeedbackConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    tone?: FeedbackTone;
    showCancel?: boolean;
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const closeFeedback = () => setFeedbackConfig((prev) => ({ ...prev, isOpen: false }));

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const filteredFolders = useMemo(() => {
    let result = initialFolders;
    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0; // folders don't have size, just keep them same
    });
    return result;
  }, [initialFolders, searchQuery, sortBy]);

  const filteredDocuments = useMemo(() => {
    let result = initialDocuments;
    if (searchQuery) {
      result = result.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.file_name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    result.sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "size") return b.file_size - a.file_size;
      return 0;
    });
    return result;
  }, [initialDocuments, searchQuery, sortBy]);

  async function handleDownload(id: string) {
    try {
      const url = await getDownloadUrl(id);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      setFeedbackConfig({
        isOpen: true,
        title: "Download Failed",
        message: "Failed to get download URL. Please try again.",
        tone: "error",
        showCancel: false,
      });
    }
  }

  function handleDeleteClick(id: string, type: "folder" | "document") {
    setFeedbackConfig({
      isOpen: true,
      title: `Delete ${type === "folder" ? "Folder" : "Document"}`,
      message: `Are you sure you want to delete this ${type}? ${type === "folder" ? "This will also delete all contents inside." : "This action cannot be undone."}`,
      tone: "error",
      showCancel: true,
      confirmText: "Delete",
      onConfirm: () => performDelete(id, type),
    });
  }

  async function performDelete(id: string, type: "folder" | "document") {
    try {
      if (type === "folder") {
        await deleteFolder(id);
      } else {
        await deleteDocument(id);
      }
    } catch (error) {
      console.error(error);
      setFeedbackConfig({
        isOpen: true,
        title: "Delete Failed",
        message: `Failed to delete ${type}. Please try again.`,
        tone: "error",
        showCancel: false,
      });
    }
  }

  async function handleUpload(formData: FormData) {
    try {
      setIsUploading(true);
      if (currentFolderId) {
        formData.append("folder_id", currentFolderId);
      }
      await uploadDocument(formData);
      setShowUploadModal(false);
    } catch (error: unknown) {
      setFeedbackConfig({
        isOpen: true,
        title: "Upload Failed",
        message: error instanceof Error ? error.message : "Failed to upload document",
        tone: "error",
        showCancel: false,
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      setShowNewFolderModal(false);
      setNewFolderName("");
    } catch (error: unknown) {
      setFeedbackConfig({
        isOpen: true,
        title: "Create Folder Failed",
        message: error instanceof Error ? error.message : "Failed to create folder",
        tone: "error",
        showCancel: false,
      });
    }
  }

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    if (!renameTarget || !renameValue.trim()) return;
    try {
      if (renameTarget.type === "folder") {
        await renameFolder(renameTarget.id, renameValue.trim());
      } else {
        await renameDocument(renameTarget.id, renameValue.trim());
      }
      setRenameTarget(null);
    } catch (error: unknown) {
      setFeedbackConfig({
        isOpen: true,
        title: "Rename Failed",
        message: error instanceof Error ? error.message : "Failed to rename",
        tone: "error",
        showCancel: false,
      });
    }
  }



  async function handleMove(documentId: string, folderId: string | null) {
    try {
      await moveDocument(documentId, folderId);
      setMoveTarget(null);
    } catch (error: unknown) {
      setFeedbackConfig({
        isOpen: true,
        title: "Move Failed",
        message: error instanceof Error ? error.message : "Failed to move document",
        tone: "error",
        showCancel: false,
      });
    }
  }

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, id: string, type: "document") => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id, type }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "document") {
        await handleMove(data.id, targetFolderId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  function navigateTo(folderId: string | null) {
    if (folderId) {
      router.push(`?folder=${folderId}`);
    } else {
      router.push(`?`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Documents & Resources</h2>
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
            <button 
              onClick={() => navigateTo(null)}
              className="hover:text-blue-600 hover:underline font-medium"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, null)}
            >
              Root
            </button>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.id} className="flex items-center">
                <svg className="w-4 h-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <button 
                  onClick={() => navigateTo(crumb.id)}
                  className="hover:text-blue-600 hover:underline font-medium"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, crumb.id)}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {canManage && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowNewFolderModal(true)}>New Folder</Button>
            <Button onClick={() => setShowUploadModal(true)}>Upload</Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="w-full sm:w-64">
          <Input 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "date" | "size")}
            className="h-10 rounded-xl border border-border bg-white px-3 py-2 text-sm text-slate-900 outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
          </select>
          <div className="flex bg-white border border-border rounded-xl overflow-hidden p-0.5">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-2"}>
        {filteredFolders.length === 0 && filteredDocuments.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            This folder is empty.
          </div>
        ) : (
          <>
            {filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className={`group relative flex ${viewMode === "grid" ? "flex-col p-5" : "flex-row items-center p-3"} rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-blue-200`}
                onClick={() => navigateTo(folder.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, folder.id)}
              >
                <div className={`flex items-center ${viewMode === "grid" ? "mb-3 justify-between" : "w-full justify-between gap-4"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 line-clamp-1">{folder.name}</h3>
                      {viewMode === "list" && <p className="text-xs text-slate-500">{new Date(folder.created_at).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  
                  {canManage && (
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => toggleDropdown(e, folder.id)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                      {activeDropdown === folder.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden">
                          <button onClick={() => { setRenameTarget({id: folder.id, type: "folder", name: folder.name}); setRenameValue(folder.name); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Rename</button>
                          {canDelete && <button onClick={() => { handleDeleteClick(folder.id, "folder"); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600">Delete</button>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                draggable={canManage}
                onDragStart={(e) => handleDragStart(e, doc.id, "document")}
                className={`group relative flex ${viewMode === "grid" ? "flex-col p-5" : "flex-row items-center p-3"} rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="mb-3 flex items-start justify-between">
                      <Badge variant="secondary" className="capitalize">{doc.category}</Badge>
                      {canManage && (
                        <div className="relative">
                          <button onClick={(e) => toggleDropdown(e, doc.id)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                          </button>
                          {activeDropdown === doc.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden">
                              <button onClick={() => { setRenameTarget({id: doc.id, type: "document", name: doc.title}); setRenameValue(doc.title); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Rename</button>
                              <button onClick={() => { setMoveTarget({id: doc.id, type: "document"}); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Move To...</button>
                              {canDelete && <button onClick={() => { handleDeleteClick(doc.id, "document"); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600">Delete</button>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-900 line-clamp-2">{doc.title}</h3>
                    <p className="mb-4 text-sm text-slate-500 line-clamp-1">{doc.file_name}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="text-xs text-slate-400">
                        {formatBytes(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                      <Button variant="secondary" onClick={() => handleDownload(doc.id)}>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{doc.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">{doc.category}</Badge>
                          <span>{doc.file_name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500 w-48 shrink-0">
                      <span>{formatBytes(doc.file_size)}</span>
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="secondary" onClick={() => handleDownload(doc.id)} className="px-3 py-1.5 h-auto">Download</Button>
                      {canManage && (
                        <div className="relative">
                          <button onClick={(e) => toggleDropdown(e, doc.id)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                          </button>
                          {activeDropdown === doc.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden">
                              <button onClick={() => { setRenameTarget({id: doc.id, type: "document", name: doc.title}); setRenameValue(doc.title); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Rename</button>
                              <button onClick={() => { setMoveTarget({id: doc.id, type: "document"}); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Move To...</button>
                              {canDelete && <button onClick={() => { handleDeleteClick(doc.id, "document"); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600">Delete</button>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {showUploadModal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden onClick={() => !isUploading && setShowUploadModal(false)} />
          <div role="dialog" aria-modal="true" className="relative flex w-full max-w-md flex-col rounded-2xl border border-border bg-white shadow-2xl">
            <form action={handleUpload} className="flex flex-col">
              <div className="p-6 pb-0">
                <h2 className="mb-4 text-xl font-bold">Upload Document</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upload-title">Title</Label>
                    <Input id="upload-title" name="title" required autoFocus placeholder="e.g. 2026 Constitution" />
                  </div>
                  <div>
                    <Label htmlFor="upload-category">Category</Label>
                    <select id="upload-category" name="category" required className="flex h-10 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="constitution">Constitution</option>
                      <option value="minutes">Meeting Minutes</option>
                      <option value="forms">Membership Forms</option>
                      <option value="guides">Onboarding Guides</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="upload-file">File</Label>
                    <Input id="upload-file" name="file" type="file" required className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-4">
                <Button type="button" variant="ghost" onClick={() => setShowUploadModal(false)} disabled={isUploading}>Cancel</Button>
                <Button type="submit" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</Button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )}

      {showNewFolderModal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden onClick={() => setShowNewFolderModal(false)} />
          <div role="dialog" aria-modal="true" className="relative flex w-full max-w-md flex-col rounded-2xl border border-border bg-white shadow-2xl">
            <form onSubmit={handleCreateFolder} className="flex flex-col">
              <div className="p-6 pb-0">
                <h2 className="mb-4 text-xl font-bold">New Folder</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="folder-name">Folder Name</Label>
                    <Input id="folder-name" required autoFocus placeholder="e.g. 2026 Board Meetings" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-4">
                <Button type="button" variant="ghost" onClick={() => setShowNewFolderModal(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )}

      {renameTarget && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden onClick={() => setRenameTarget(null)} />
          <div role="dialog" aria-modal="true" className="relative flex w-full max-w-md flex-col rounded-2xl border border-border bg-white shadow-2xl">
            <form onSubmit={handleRename} className="flex flex-col">
              <div className="p-6 pb-0">
                <h2 className="mb-4 text-xl font-bold">Rename {renameTarget.type === "folder" ? "Folder" : "Document"}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rename-value">Name</Label>
                    <Input id="rename-value" required autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-4">
                <Button type="button" variant="ghost" onClick={() => setRenameTarget(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )}

      {moveTarget && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden onClick={() => setMoveTarget(null)} />
          <div role="dialog" aria-modal="true" className="relative flex w-full max-w-md flex-col rounded-2xl border border-border bg-white shadow-2xl">
            <div className="p-6 pb-0">
              <h2 className="mb-4 text-xl font-bold">Move Document</h2>
              <p className="text-sm text-slate-500 mb-4">Choose a destination folder. You can also drag and drop documents directly into folders.</p>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {currentFolderId !== null && (
                  <button onClick={() => handleMove(moveTarget.id, null)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-left transition-colors">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    <span className="font-medium text-slate-900">Root Directory</span>
                  </button>
                )}
                {initialFolders.map(folder => (
                  <button key={folder.id} onClick={() => handleMove(moveTarget.id, folder.id)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-left transition-colors">
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    <span className="font-medium text-slate-900">{folder.name}</span>
                  </button>
                ))}
                {initialFolders.length === 0 && currentFolderId === null && (
                  <div className="text-center p-4 text-slate-500 text-sm">No folders available.</div>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-4">
              <Button type="button" variant="ghost" onClick={() => setMoveTarget(null)}>Cancel</Button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <FeedbackModal
        isOpen={feedbackConfig.isOpen}
        onClose={closeFeedback}
        title={feedbackConfig.title}
        message={feedbackConfig.message}
        tone={feedbackConfig.tone}
        showCancel={feedbackConfig.showCancel}
        onConfirm={feedbackConfig.onConfirm}
        confirmText={feedbackConfig.confirmText}
      />
    </div>
  );
}
