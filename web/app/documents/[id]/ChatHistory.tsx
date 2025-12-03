"use client";

import { useEffect, useState } from "react";

export default function ChatHistory({ id }: { id: string }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:3001/documents/${id}/history`, {
        method: "POST",
      });
      
      const {questions, answers} = await res.json();

      const combined = [];

      for (let i = 0; i < Math.max(questions.length, answers.length); i++) {
        if (questions[i])
          combined.push({ role: "user", text: questions[i].text || "empty question" });
        if (answers[i])
          combined.push({ role: "assistant", text: answers[i].text || "empty answer" });
      }

      setMessages(combined);
    }

    load();
  }, [id]);

  return (
    <div className="space-y-4">

      {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`
              p-3 rounded-lg
              ${m.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-200 text-gray-900"}
            `}
          >
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}
