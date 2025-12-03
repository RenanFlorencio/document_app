const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Tesseract = require("tesseract.js");
const axios = require("axios");

const upload = multer({ dest: "uploads/" });
const app = express();
app.use(cors());
app.use(express.json());

const db = require("./db");

console.log("Backend starting...");

// Upload + OCR
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname);
    const id = String(Date.now());
    const newFilename = `${id}${ext}`;
    const newPath = path.join("uploads", newFilename);

    fs.renameSync(req.file.path, newPath);

    // Create document entry as "processing"
    const doc = {
      id,
      originalName: req.file.originalname,
      storedFilename: newFilename,
      path: newPath,
      status: "PROCESSING_OCR",
      ocrText: null
    };
    db.documents.push(doc);

    // ---- RUN OCR HERE ----
    console.log("[OCR] Starting OCR for", newFilename);

    const result = await Tesseract.recognize(newPath, "eng", {
        langPath: "https://tessdata.projectnaptha.com/4.0.0_best",
        logger: (m) => console.log("[OCR]", m.status, m.progress),
      });

    console.log("[OCR] Finished");

    doc.status = "OCR_DONE";
    console.log("[OCR] Text extracted:", result.data.text.slice(0, 100) + "...");
    doc.ocrText = result.data.text;

    res.json(doc);

  } catch (err) {
    console.error("Upload/OCR error:", err);
    res.status(500).json({ error: "OCR failed" });
  }
});

// List documents
app.get("/documents", (req, res) => {
  res.json(db.documents);
});

// Document detail
app.get("/documents/:id", (req, res) => {
  const doc = db.documents.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

app.get("/documents/:id/download", (req, res) => {
  const doc = db.documents.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.download(`uploads/${doc.storedFilename}`, doc.originalName);
});

app.post("/documents/:id/history", async (req, res) => {
  const doc = db.documents.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });

  const questions = db.user_questions.filter((q) => q.documentId === doc.id);
  const answers = db.llm_answers.filter((a) => a.documentId === doc.id);
  console.log("History requested for document", doc.id, { questions, answers });

  res.json({ questions, answers });
});

app.post("/documents/:id/ask", async (req, res) => {
  // 1. Check if the document exists in your local DB
  const doc = db.documents.find((d) => d.id === req.params.id);
  
  if (!doc) {
    console.error(`Document with ID ${req.params.id} not found in DB.`);
    return res.status(404).json({ error: "Document not found" });
  }

  const contextMessage = doc.ocrText || "";
  const userMessage = req.body.message || "";
  db.user_questions.push({ documentId: doc.id, text: userMessage });

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY || ""; 

    // Using Groq's OpenAI-compatible endpoint
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        // Groq supports Llama 3, Mixtral, etc. 
        // "llama-3.1-8b-instant" is extremely fast and capable for this task.
        model: "llama-3.1-8b-instant", 
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant. Answer the user's question based strictly on the context provided below." 
          },
          { 
            role: "user", 
            content: `Context: ${contextMessage}\n\nQuestion: ${userMessage}` 
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 3. Handle response (Groq follows OpenAI response format)
    const text = response.data?.choices?.[0]?.message?.content || "(no response)";

    db.llm_answers.push({ documentId: doc.id, text: text });
    res.json({ answer: text });

  } catch (e) {
    // Log the specific error
    console.error("LLM ERROR:", e.response?.data || e.message);
    
    res.status(500).json({ error: "LLM failed" });
  }
});

app.listen(3001, () => console.log("Mock API running on http://localhost:3001"));
