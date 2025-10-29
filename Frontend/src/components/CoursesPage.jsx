import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // Fetch all courses
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses")
      .then((res) => setCourses(res.data || []))
      .catch(console.error);
  }, []);

  // Fetch enrolled courses
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/enrollments/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEnrolledCourses(res.data.courses || []))
      .catch(console.error);
  }, [token]);

  // Fetch wishlist
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWishlistCourses(res.data.courses || []))
      .catch(console.error);
  }, [token]);

  const handleEnroll = (courseId) => {
    setEnrolledCourses((prev) => [...prev, courseId]);
  };

  const handleWishlist = (courseId, added) => {
    setWishlistCourses((prev) =>
      added ? [...prev, courseId] : prev.filter((id) => id !== courseId)
    );
  };

  if (!courses.length) return <p className="text-center mt-24">⏳ Loading courses...</p>;

  return (
    <div className="grid md:grid-cols-3 gap-8 p-6">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          isEnrolled={enrolledCourses.includes(course._id)}
          isWishlisted={wishlistCourses.includes(course._id)}
          onEnroll={handleEnroll}
          onWishlistToggle={handleWishlist}
        />
      ))}
    </div>
  );
}
