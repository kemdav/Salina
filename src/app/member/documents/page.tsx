import { getDocuments, getFolders, getFolderBreadcrumbs } from "@/lib/actions/documents";
import { DocumentsLibrary } from "@/components/organisms/documents-library";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | Member | Salina",
};

export default async function MemberDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  const { folder } = await searchParams;
  const folderId = folder || null;
  const documents = await getDocuments(undefined, folderId);
  const folders = await getFolders(folderId);

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
        canManage={false}
        canDelete={false}
      />
    </div>
  );
}
