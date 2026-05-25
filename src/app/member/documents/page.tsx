import { getDocuments } from "@/lib/actions/documents";
import { DocumentsLibrary } from "@/components/organisms/documents-library";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | Member | Salina",
};

export default async function MemberDocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="py-8">
      <DocumentsLibrary
        initialDocuments={documents}
        canManage={false}
        canDelete={false}
      />
    </div>
  );
}
