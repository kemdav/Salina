import { getDocuments } from "@/lib/actions/documents";
import { DocumentsLibrary } from "@/components/organisms/documents-library";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | Admin | Salina",
};

export default async function AdminDocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="py-8">
      <DocumentsLibrary
        initialDocuments={documents}
        canManage={true}
        canDelete={true}
      />
    </div>
  );
}
