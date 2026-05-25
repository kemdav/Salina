import { getDocuments, getFolders, getFolderBreadcrumbs } from "@/lib/actions/documents";
import { DocumentsLibrary } from "@/components/organisms/documents-library";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | Officer | Salina",
};

export default async function OfficerDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  const { folder } = await searchParams;
  const folderId = folder || null;
  const documents = await getDocuments(undefined, folderId, "officer");
  const folders = await getFolders(folderId, "officer");
  let breadcrumbs: { id: string; name: string }[] = [];
  if (folderId) {
    breadcrumbs = await getFolderBreadcrumbs(folderId);
  }

  return (
    <div className="py-8">
      <DocumentsLibrary
        initialDocuments={documents}
        initialFolders={folders}
        currentFolderId={folderId}
        breadcrumbs={breadcrumbs}
        canManage={true}
        canDelete={false}
        canEditAccess={false}
      />
    </div>
  );
}
