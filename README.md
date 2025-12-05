# Document OCR + Q&A Demo

A simple demo using a mock Node.js backend (no database) and a Next.js frontend.
Features: upload files, run OCR (Tesseract.js), view OCR text, ask questions (Groq), and see chat history.

---------------------------------------
Project Structure
---------------------------------------

document_app/
  backend/      -> Express mock API
  web/          -> Next.js frontend

---------------------------------------
Backend Setup
---------------------------------------
```
cd backend
npm install
```
Create a file named .env:
```
GROQ_API_KEY=your_key_here
```
Run the backend:
```
node mock_backend.js
```
Backend URL:
```
http://localhost:3001
```
---------------------------------------
Frontend Setup
---------------------------------------

```
cd web
npm install
npm run dev
```
Frontend URL:
```
http://localhost:3000
```
---------------------------------------
How It Works
---------------------------------------

1. User uploads a file.
2. Backend stores it and runs OCR (Tesseract.js).
3. Document page shows OCR text (collapsible preview).
4. User asks questions.
5. Backend sends them to Groq (Llama model).
6. Chat history is stored in memory and displayed.

---------------------------------------
Mock Database
---------------------------------------

`backend/db.js` contains:
```
documents: []
user_questions: []
llm_answers: []
```
Data is stored only in memory and is cleared on backend restart.

---------------------------------------
Notes
---------------------------------------

- No real database.
- All storage is temporary.
- Good for demos and prototyping.
