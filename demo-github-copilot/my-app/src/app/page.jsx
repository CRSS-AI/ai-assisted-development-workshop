"use client";
import { useState } from "react";

export default function TodoUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/make_todo_list", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data.todoList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#130b3b" }}>
      <div style={{ maxWidth: 520, margin: "2rem auto", padding: 32, background: "#eaf1fb", border: "1px solid #dbeafe", borderRadius: 16, boxShadow: "0 4px 24px #0001" }}>
        <h2 style={{ color: "#2563eb", textAlign: "center", marginBottom: 24 }}>Agentic To-Do List Generator</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label htmlFor="file-upload" style={{
            background: file ? "#2563eb" : "#e0e7ef",
            color: file ? "#fff" : "#2563eb",
            padding: "12px 20px",
            borderRadius: 8,
            border: "2px solid #2563eb",
            cursor: "pointer",
            fontWeight: 600,
            textAlign: "center",
            transition: "background 0.2s, color 0.2s"
          }}>
            {file ? `Selected: ${file.name}` : "Choose a .txt or .md file"}
            <input id="file-upload" type="file" accept=".txt,.md" onChange={handleFileChange} style={{ display: "none" }} />
          </label>
          <button type="submit" disabled={loading || !file} style={{
            background: loading || !file ? "#a5b4fc" : "#2563eb",
            color: "#fff",
            padding: "12px 20px",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            cursor: loading || !file ? "not-allowed" : "pointer",
            boxShadow: loading || !file ? "none" : "0 2px 8px #2563eb22",
            transition: "background 0.2s"
          }}>
            {loading ? "Processing..." : "Upload & Generate"}
          </button>
        </form>
        {error && <div style={{ color: "#dc2626", marginTop: 20, textAlign: "center", fontWeight: 600 }}>{error}</div>}
        {result && (
          <div style={{ marginTop: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 20 }}>
            <h3 style={{ color: "#2563eb", marginBottom: 12 }}>To-Do List (JSON):</h3>
            <pre style={{ background: "#f6f8fa", color: "#222", padding: 16, borderRadius: 8, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", maxWidth: "100%", fontSize: 15 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
