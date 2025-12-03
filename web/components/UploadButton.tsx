"use client";

import { useState } from "react";

export default function UploadButton() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    // --- File type validation ---
    const allowed = ["image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      setStatus("error");
      setErrorMsg("Only .png and .jpg files are allowed");
      return;
    }

    setStatus("uploading");
    setProgress(0);
    setErrorMsg("");

    const form = new FormData();
    form.append("file", file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const p = Math.round((event.loaded / event.total) * 100);
          setProgress(p);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setStatus("done");
          setProgress(100);
          window.location.reload();

        } else {
          setStatus("error");
          setErrorMsg("Upload failed");
        }
      };

      xhr.onerror = () => {
        setStatus("error");
        setErrorMsg("Network error");
      };

      xhr.open("POST", "http://localhost:3001/upload");
      xhr.send(form);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Unexpected error");
    }
  }

  return (
    <div className="space-y-3">

      {/* Upload input */}
      <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Upload Document
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {/* Progress bar */}
      {status === "uploading" && (
        <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Success message */}
      {status === "done" && (
        <p className="text-green-600 font-medium">Upload complete!</p>
      )}

      {/* Error message */}
      {status === "error" && (
        <p className="text-red-600 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
