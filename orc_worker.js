const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createWorker } = require("tesseract.js");
const queue = require("./ocr_queue");

(async function startWorker() {
  console.log("OCR Worker running...");

  const worker = await createWorker();

  while (true) {
    const job = queue.next();

    if (!job) {
      // Nothing to do — wait a bit
      await new Promise((res) => setTimeout(res, 500));
      continue;
    }

    console.log("Processing OCR job:", job.id);

    try {
      const result = await worker.recognize(job.filePath);

      // Update backend with OCR result
      await axios.post(`http://localhost:3001/documents/${job.id}/ocr`, {
        ocrText: result.data.text,
      });

      console.log("OCR finished:", job.id);
    } catch (err) {
      console.error("OCR failed:", job.id, err);
    }
  }
})();
