const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Tesseract = require("tesseract.js");

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

app.listen(3001, () => console.log("Mock API running on http://localhost:3001"));
