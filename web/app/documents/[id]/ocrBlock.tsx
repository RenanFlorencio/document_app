"use client";
import { useState } from "react";

export default function OcrBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  const preview = text.length > 80 ? text.slice(0, 80) + "..." : text;

  return (
    <div className="">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full text-left"
      >
        <span
          className={`transition-transform text-lg ${
            open ? "rotate-90" : "rotate-0"
          }`}
        >
          ▶
        </span>

        <span className="text-xl font-semibold">OCR Extracted Text</span>
      </button>

      <div className="mt-3">
        <pre className="whitespace-pre-wrap text-gray-800 text-sm">
          {open ? text : preview}
        </pre>
      </div>
    </div>
  );
}
