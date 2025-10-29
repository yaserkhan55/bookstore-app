// src/components/EnrollPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export default function EnrollPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Some APIs return {course: {...}}, some return {...}
        const courseData = res.data.course || res.data;
        setCourse(courseData);
      } catch (err) {
        console.error("Failed to fetch course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p className="pt-20 text-center">Loading course...</p>;
  if (!course) return <p className="pt-20 text-center text-red-500">Course not found</p>;

  const lessonCount = course.modules
    ? course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)
    : course.lessons?.length || 0;

  return (
    <div className="px-6 pt-28 pb-16 bg-gray-50 dark:bg-slate-900 min-h-screen flex flex-col items-center">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4">🎉 Enrollment Successful</h1>
        <p className="mb-4">You are now enrolled in:</p>

        <h2 className="text-xl font-semibold">{course.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{course.description}</p>
        <p className="text-sm text-gray-500 mb-6">Lessons: {lessonCount}</p>

        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Go to Lessons
        </button>
      </div>
    </div>
  );
}
