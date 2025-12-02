// components/DocumentList.tsx
import api from "../lib/api";
import DocumentItem from "./DocumentItem";

export default async function DocumentList() {
  const docs = await api("/documents");

  return (
    <div className="space-y-4">
      {docs.map((doc: any) => (
        <DocumentItem key={doc.id} doc={doc} />
      ))}
    </div>
  );
}
