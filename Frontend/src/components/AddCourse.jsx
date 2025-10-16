import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price) return toast.error("Title and price are required.");

    try {
      const res = await axios.post("http://localhost:5000/api/course", {
        title,
        description,
        price,
        image,
      });

      if (res.status === 201) {
        toast.success("Course added successfully ✅");
        setTitle("");
        setDescription("");
        setPrice("");
        setImage("");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add course.");
    }
  };

  return (
    <div className="px-6 pt-28 pb-16">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Add New Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded border dark:bg-slate-700 dark:text-white"
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded border dark:bg-slate-700 dark:text-white"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 rounded border dark:bg-slate-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-2 rounded border dark:bg-slate-700 dark:text-white"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
