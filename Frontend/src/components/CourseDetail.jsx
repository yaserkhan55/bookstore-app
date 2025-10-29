import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import LessonList from "./LessonList";
import ProgressBar from "./ProgressBar";
import LessonPlayer from "./LessonPlayer";
import LessonDetail from "./LessonDetail";

const BASE_URL = "http://localhost:5000/api";

// Helper: validate token
const getValidToken = async () => {
  let token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!token || !refreshToken) return null;

  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    if (payload.exp * 1000 < Date.now()) {
      const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        token = res.data.token;
      } else return null;
    }
  } catch (err) {
    console.error("Token refresh failed:", err);
    return null;
  }

  return token;
};

// Completed course component with animated badge
const CompletedCourse = ({ course, completedAt }) => {
  return (
    <div className="mt-6 flex flex-col items-center justify-center p-6 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-xl text-center shadow relative overflow-hidden">
      <div className="w-24 h-24 bg-green-500 dark:bg-green-700 rounded-full flex items-center justify-center mb-4 transform scale-0 animate-scaleIn">
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2 animate-fadeIn">🎉 Congratulations!</h2>
      <p className="text-lg animate-fadeIn delay-150">
        You have completed the course: <strong>{course.title}</strong>
      </p>
      {completedAt && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Completed on {new Date(completedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default function CourseDetail() {
  const { id: courseId } = useParams();
  const USER_ID = localStorage.getItem("userId");

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [completedAt, setCompletedAt] = useState(null); // ✅ new state
  const [loading, setLoading] = useState(true);
  const [loadingMark, setLoadingMark] = useState(false);
  const [error, setError] = useState("");

  // Fetch course and progress
  useEffect(() => {
    let mounted = true;

    const fetchCourseAndProgress = async () => {
      if (!USER_ID) {
        setError("You must be logged in to view this course.");
        setLoading(false);
        return;
      }

      try {
        const token = await getValidToken();
        if (!token) {
          setError("Session expired, please log in again.");
          setLoading(false);
          return;
        }

        const courseRes = await axios.get(`${BASE_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;

        let lessons = courseRes.data.lessons || [];
        lessons = lessons.map((l, i) =>
          typeof l === "string" ? { _id: l, title: `Lesson ${i + 1}`, videoUrl: null } : l
        );

        setCourse({ ...courseRes.data, lessons });

        // Select first lesson
        const firstLessonWithVideo = lessons.find((l) => l.videoUrl);
        setCurrentLesson(firstLessonWithVideo || lessons[0] || null);

        // Fetch progress
        let progressRes;
        try {
          progressRes = await axios.get(`${BASE_URL}/progress/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          if (err.response?.status === 404) {
            progressRes = await axios.post(
              `${BASE_URL}/progress/${courseId}`,
              { lessonId: null },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } else throw err;
        }

        const pr = progressRes.data || {};
        setCompletedLessons(pr.completedLessons || []);
        setCompletedAt(pr.completedAt || null); // ✅ capture completion date
        const totalLessons = lessons.length;
        const completed = pr.completedLessons?.length || 0;
        setProgress(Math.round((completed / totalLessons) * 100));
      } catch (err) {
        console.error("Error loading course/progress:", err?.response?.data || err.message);
        setError("Failed to load course or progress.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCourseAndProgress();
    return () => (mounted = false);
  }, [courseId, USER_ID]);

  // Recalculate progress whenever completedLessons changes
  useEffect(() => {
    if (course?.lessons?.length) {
      const total = course.lessons.length;
      const completed = completedLessons.length;
      setProgress(Math.round((completed / total) * 100));
    }
  }, [completedLessons, course]);

  const handleMarkLessonComplete = async (lessonId) => {
    if (!USER_ID) {
      toast.error("You must be logged in to mark lessons complete.");
      return;
    }
    if (loadingMark) return;

    setLoadingMark(true);
    try {
      const token = await getValidToken();
      if (!token) {
        toast.error("Session expired, please log in again.");
        setLoadingMark(false);
        return;
      }

      const totalLessons = course.lessons?.length || 0;

      const res = await axios.post(
        `${BASE_URL}/progress/${courseId}`,
        { lessonId, totalLessons },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data || {};
      setCompletedLessons(data.completedLessons || []);
      setCompletedAt(data.completedAt || null); // ✅ update completion date
      toast.success("Lesson marked complete");
    } catch (err) {
      console.error("Error marking lesson complete:", err?.response?.data || err.message);
      toast.error("Failed to mark lesson complete.");
    } finally {
      setLoadingMark(false);
    }
  };

  if (loading) return <p className="text-center pt-20">Loading...</p>;
  if (error)
    return (
      <div className="px-6 pt-28 pb-16 bg-gray-50 dark:bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="max-w-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold mb-2">⚠️ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!course) return null;

  const isCourseCompleted = completedLessons.length === course?.lessons?.length;
  const displayProgress = isCourseCompleted ? 100 : progress;

  return (
    <div className="px-6 pt-28 pb-16 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Lessons */}
        <div className={`md:col-span-1 ${isCourseCompleted ? "opacity-50 pointer-events-none" : ""}`}>
          <h2 className="text-lg font-bold mb-3">Lessons</h2>
          <LessonList
            lessons={course.lessons || []}
            courseId={course._id || courseId}
            completedLessons={completedLessons}
            onMarkComplete={handleMarkLessonComplete}
            setCurrentLesson={setCurrentLesson}
            currentLesson={currentLesson}
            disabled={isCourseCompleted}
          />
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
          <ProgressBar progress={displayProgress} />

          {isCourseCompleted ? (
            <CompletedCourse course={course} completedAt={completedAt} />
          ) : currentLesson ? (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">{currentLesson.title}</h2>
              <LessonPlayer url={currentLesson.videoUrl} />
              <LessonDetail lesson={currentLesson} />
            </div>
          ) : (
            <p>No lesson selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
