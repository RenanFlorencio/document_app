import Link from "next/link";

export default function DocumentItem({ doc }: { doc: any }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      
      {/* File name + status */}
      <Link href={`/documents/${doc.id}`} className="flex flex-col">
        <span className="font-semibold text-gray-800">{doc.originalName}</span>
        <span className="text-xs text-gray-500 mt-1">{doc.status}</span>
        
      </Link>

      {/* Download */}
      <Link
        href={`http://localhost:3001/documents/${doc.id}/download`}
        prefetch={false}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
      >
        Download
      </Link>
    </div>
  );
}
