import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import CourseCard from "./CourseCard";
import { useLocation } from "react-router-dom";
import SearchableGrid from "./SearchableGrid";

const BASE_URL = "http://localhost:5000/api";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const TOKEN = localStorage.getItem("token");
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/courses`);
        setCourses(res.data || []);

        if (TOKEN) {
          const enrolledRes = await axios.get(`${BASE_URL}/enrollments/user`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
          });
          const enrolledCourses = (enrolledRes.data.courses || []).map((c) => String(c._id));
          setEnrolled(enrolledCourses);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, [TOKEN]);

  const handleEnroll = (courseId) => {
    setEnrolled((prev) => [...prev, String(courseId)]);
  };

  return (
    <div className="px-6 pt-28 pb-16 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          🎓 Courses
        </h2>

        <SearchableGrid
          items={courses}
          searchQuery={searchQuery}
          emptyMessage="No courses found."
          renderItem={(course) => (
            <CourseCard
              key={course._id}
              course={course}
              enrolledCourses={enrolled}
              enrollCourse={handleEnroll}
            />
          )}
        />
      </div>
    </div>
  );
}
