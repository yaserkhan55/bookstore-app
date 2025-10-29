import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function LessonEditor({ onSaveSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const lessonData = { title, content, images: image ? [image] : [] };

    try {
      const res = await fetch("http://localhost:5000/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!res.ok) throw new Error("Failed to save lesson");

      const savedLesson = await res.json();
      console.log("✅ Saved:", savedLesson);
      setMessage("Lesson saved successfully!");
      setTitle("");
      setContent("");
      setImage("");

      if (onSaveSuccess) onSaveSuccess(); // refresh list
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("Error saving lesson. Check console.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-gray-50 dark:bg-slate-900">
      <h2 className="text-xl font-bold mb-4">Create New Lesson</h2>
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Lesson Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill value={content} onChange={setContent} className="mb-2" />
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg"
        onClick={handleSave}
      >
        Save Lesson
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
