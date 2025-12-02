import api from "../../../lib/api";

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ← Required in Next.js 14/15 App Router

  const doc = await api(`/documents/${id}`);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{doc.originalName}</h1>

      <p className="text-gray-700">
        Status: <span className="font-medium">{doc.status}</span>
      </p>

      <a
        href={`http://localhost:3001/documents/${id}/download`}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
      >
        Download File
      </a>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-medium mb-2">OCR Result</h2>
        <pre>{doc.ocrText}</pre>
      </div>
    </div>
  );
}
