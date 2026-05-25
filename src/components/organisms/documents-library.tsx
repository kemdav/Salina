"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import { createPortal } from "react-dom";
import { uploadDocument, deleteDocument, getDownloadUrl } from "@/lib/actions/documents";

export type DocumentMetadata = {
  id: string;
  title: string;
  category: string;
  file_name: string;
  file_size: number;
  created_at: string;
};

type DocumentsLibraryProps = {
  initialDocuments: DocumentMetadata[];
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

export function DocumentsLibrary({ initialDocuments, canManage, canDelete }: DocumentsLibraryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  async function handleDownload(id: string) {
    try {
      const url = await getDownloadUrl(id);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Failed to get download URL");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete document");
    }
  }

  async function handleUpload(formData: FormData) {
    try {
      setIsUploading(true);
      await uploadDocument(formData);
      setShowUploadModal(false);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Documents & Resources</h2>
        {canManage && (
          <Button onClick={() => setShowUploadModal(true)}>Upload Document</Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialDocuments.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            No documents have been uploaded yet.
          </div>
        ) : (
          initialDocuments.map((doc) => (
            <div
              key={doc.id}
              className="group relative flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <Badge variant="secondary" className="capitalize">
                  {doc.category}
                </Badge>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete document"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 line-clamp-2">
                {doc.title}
              </h3>
              <p className="mb-4 text-sm text-slate-500 line-clamp-1">{doc.file_name}</p>
              
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="text-xs text-slate-400">
                  {formatBytes(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleDownload(doc.id)}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {showUploadModal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            aria-hidden
            onClick={() => !isUploading && setShowUploadModal(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative flex w-full max-w-md flex-col rounded-2xl border border-border bg-white shadow-2xl"
          >
            <form action={handleUpload} className="flex flex-col">
              <div className="p-6 pb-0">
                <h2 className="mb-4 text-xl font-bold">Upload Document</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upload-title">Title</Label>
                    <Input
                      id="upload-title"
                      name="title"
                      required
                      autoFocus
                      placeholder="e.g. 2026 Constitution"
                    />
                  </div>
                  <div>
                    <Label htmlFor="upload-category">Category</Label>
                    <select
                      id="upload-category"
                      name="category"
                      required
                      className="flex h-10 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="constitution">Constitution</option>
                      <option value="minutes">Meeting Minutes</option>
                      <option value="forms">Membership Forms</option>
                      <option value="guides">Onboarding Guides</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="upload-file">File</Label>
                    <Input
                      id="upload-file"
                      name="file"
                      type="file"
                      required
                      className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
