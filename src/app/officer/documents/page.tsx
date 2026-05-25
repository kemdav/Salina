import { getDocuments } from "@/lib/actions/documents";
import { DocumentsLibrary } from "@/components/organisms/documents-library";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | Officer | Salina",
};

export default async function OfficerDocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="py-8">
      <DocumentsLibrary
        initialDocuments={documents}
        canManage={true}
        canDelete={false}
      />
    </div>
  );
}
