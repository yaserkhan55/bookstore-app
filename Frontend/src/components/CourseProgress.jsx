import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// Components
import ModuleList from "./ModuleList"; // shows modules & lessons
import ProgressBar from "./ProgressBar"; // shows progress bar

const BASE_URL = "http://localhost:5000/api";

export default function CourseProgress() {
  const { id: courseId } = useParams();
  const USER_ID = localStorage.getItem("userId");
  const TOKEN = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMark, setLoadingMark] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchCourseAndProgress = async () => {
      if (!TOKEN || !USER_ID) {
        toast.error("You must be logged in to view this course.");
        setLoading(false);
        return;
      }

      try {
        // Fetch course data
        const courseRes = await axios.get(`${BASE_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        if (!mounted) return;
        setCourse(courseRes.data);

        // Fetch progress
        const progressRes = await axios.get(`${BASE_URL}/progress/${courseId}`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const pr = progressRes.data || {};
        setCompletedLessons(pr.completedLessons || []);
        setProgress(pr.progress || 0);
      } catch (err) {
        console.error("❌ Course/Progress fetch error:", err?.response?.data || err.message);
        toast.error("Failed to load course or progress.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCourseAndProgress();
    return () => (mounted = false);
  }, [courseId, TOKEN, USER_ID]);

  const handleMarkLessonComplete = async (lessonId) => {
    if (!TOKEN || !USER_ID) {
      toast.error("You must be logged in to mark lessons complete.");
      return;
    }
    if (loadingMark) return;

    setLoadingMark(true);
    try {
      const totalLessons =
        course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

      const res = await axios.post(
        `${BASE_URL}/progress/${courseId}`,
        { lessonId, totalLessons },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      const data = res.data || {};
      setCompletedLessons(data.completedLessons || []);
      setProgress(data.progress || 0);

      toast.success("Lesson marked complete");
    } catch (err) {
      console.error("❌ Mark lesson error:", err?.response?.data || err.message);
      toast.error("Error marking lesson complete");
    } finally {
      setLoadingMark(false);
    }
  };

  if (loading) return <p className="text-center pt-20">Loading course...</p>;
  if (!course) return <p className="text-center pt-20">Course not found.</p>;

  return (
    <div className="px-6 pt-28 pb-16 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{course.description}</p>
        <p className="text-lg font-semibold">Instructor: {course.instructor}</p>
        {course.duration && <p className="text-lg mb-4">Duration: {course.duration}</p>}

        <ProgressBar progress={progress} />

        <ModuleList
          modules={course.modules || []}
          courseId={course._id || courseId}
          completedLessons={completedLessons}
          onMarkComplete={handleMarkLessonComplete}
        />
      </div>
    </div>
  );
}
