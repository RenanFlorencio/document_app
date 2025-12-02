const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const app = express();
app.use(cors());
app.use(express.json());

const ocrQueue = require("./ocr_queue");

let documents = []; // in-memory fake DB

console.log("Backend starting...");

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {

  // Sanitize filename
  const ext = path.extname(req.file.originalname);
  const id = String(Date.now());
  const newFilename = `${id}${ext}`;
  const newPath = path.join("uploads", newFilename);

  fs.renameSync(req.file.path, newPath);

  const doc = {
    id,
    originalName: req.file.originalname,
    storedFilename: newFilename,
    path: newPath,
    status: "UPLOADED",
    ocrText: "Dummy OCR text"
  };

  ocrQueue.add({ id, filePath: newPath })
  documents.push(doc);
  res.json(doc);

});

// List documents
app.get("/documents", (req, res) => {
  res.json(documents);
});

// Document detail
app.get("/documents/:id", (req, res) => {
  const doc = documents.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

app.post("/documents/:id/ocr", (req, res) => {
  const doc = documents.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });

  doc.status = "OCR_DONE";
  doc.ocrText = req.body.ocrText;

  res.json(doc);
});

app.get("/documents/:id/download", (req, res) => {
  const doc = documents.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });

  const filepath = `uploads/${doc.storedFilename}`;

  res.download(filepath, doc.originalName);
});

app.listen(3001, () => console.log("Mock API running on http://localhost:3001"));
