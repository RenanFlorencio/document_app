"use client";

import { useState } from "react";

export default function ChatBox({ id }: { id: string }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!text.trim()) return;
    setLoading(true);

    try {
      // Call your LLM first
      const llmRes = await fetch(`http://localhost:3001/documents/${id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const llmData = await llmRes.json();
      const answer = llmData.answer;

      setText("");
      window.location.reload(); // easiest refresh for now
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask something about this document..."
        className="w-full border p-2 rounded"
        rows={3}
      />

      <button
        onClick={send}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>
    </div>
  );
}
