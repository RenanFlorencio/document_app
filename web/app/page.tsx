import UploadButton from "../components/UploadButton";
import DocumentList from "../components/DocumentList";

export default function HomePage() {
  return (
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">
            Paggo OCR
          </h1>
          <p className="text-gray-600">
            Upload documents and extract readable text instantly.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-3 rounded-xl shadow border text-center">
          <UploadButton />
          <p className="text-gray-500 p-2">Supported: PNG, JPG</p>
        </div>

        {/* Document List */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
          <DocumentList />
        </div>

      </div>
  );
}
