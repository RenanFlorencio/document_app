import api from "../../../lib/api";
import ChatBox from "./ChatBox";
import ChatHistory from "./ChatHistory";
import OcrBlock from "./ocrBlock";
import Link from "next/link";

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await api(`/documents/${id}`);

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:underline"
      >
        ← Back to Documents
      </Link>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">{doc.originalName}</h1>
        <p className="text-gray-600">
          Status: <span className="font-medium">{doc.status}</span>
        </p>
      </div>

      {/* Download Button */}
      <a
        href={`http://localhost:3001/documents/${id}/download`}
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
      >
        Download File
      </a>

      {/* Chat History */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Chat History</h2>
          <ChatHistory id={id} />
        </div>
        
        <h2 className="text-xl font-semibold mb-3">Ask the Document</h2>
        <ChatBox id={id} />
      </div>


      {/* OCR Block */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <OcrBlock text={doc.ocrText} />
      </div>
    </div>
  );
}
