import UploadButton from "../components/UploadButton";
import DocumentList from "../components/DocumentList";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Paggo OCR — Simple Demo</h1>
      
      <div>
        <UploadButton />
      </div>

      <DocumentList />
    </div>
  );
}