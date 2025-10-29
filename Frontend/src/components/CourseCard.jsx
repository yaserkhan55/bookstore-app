import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Popup from "./Popup";

const BASE_URL = "http://localhost:5000/api";

export default function CourseCard({ course, enrolledCourses = [], enrollCourse }) {
  const [enrolled, setEnrolled] = useState(enrolledCourses.includes(course._id));
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ message: "", type: "" });
  const TOKEN = localStorage.getItem("token");

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 2500);
  };

  useEffect(() => {
    setEnrolled(enrolledCourses.includes(course._id));
  }, [enrolledCourses, course._id]);

  const handleEnrollClick = async () => {
    if (!TOKEN) return showPopup("Please login first", "error");
    if (enrolled) return showPopup("You already enrolled for this course", "info");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/enrollments/${course._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEnrolled(true);
        enrollCourse(course._id);
        showPopup("✅ Enrolled successfully");
      } else {
        showPopup(data.message || "Enrollment failed", "error");
      }
    } catch (err) {
      console.error(err);
      showPopup("Enrollment failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50 border border-transparent hover:border-pink-500">
      <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-xl mb-4" />
      <h2 className="text-xl font-bold mb-2 text-white">{course.title}</h2>
      <p className="text-gray-300 mb-4 line-clamp-2">{course.description}</p>

      <div className="flex justify-center gap-2 flex-wrap">
        <Link to={`/courses/${course._id}`} className="inline-block px-4 py-2 bg-pink-600 text-white font-medium rounded-lg shadow hover:bg-pink-700">
          View Course
        </Link>

        <button
          onClick={handleEnrollClick}
          disabled={loading}
          className={`px-4 py-2 rounded-lg transition ${
            enrolled ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {loading ? "⏳ Enrolling..." : enrolled ? "✅ Already Enrolled" : "Enroll"}
        </button>
      </div>

      {popup.message && <Popup message={popup.message} type={popup.type} onClose={() => setPopup({ message: "", type: "" })} />}
    </div>
  );
}
