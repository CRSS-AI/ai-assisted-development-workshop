import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { extractTodoListFromText } from "@/Agent/todoAgent";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: "File upload error" });
      return;
    }
    // Support both array and object for files.file
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    // Log file object for debugging
    console.log('Uploaded file object:', file);
    // Support formidable v2+ (filepath) and v1 (path)
    const filePath = file.filepath || file.path;
    const fileName = file.originalFilename || file.name;
    if (!filePath || !fileName) {
      res.status(400).json({ error: "Invalid file upload object" });
      return;
    }
    const ext = path.extname(fileName).toLowerCase();
    if (![".txt", ".md"].includes(ext)) {
      res.status(400).json({ error: "Only .txt or .md files allowed" });
      return;
    }
    const text = fs.readFileSync(filePath, "utf8");
    try {
      const todoList = await extractTodoListFromText(text);
      res.status(200).json({ todoList });
    } catch (e) {
      res.status(500).json({ error: "Failed to extract to-do list" });
    }
  });
}
