// src/components/LessonPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import CourseProgress from "./CourseProgress";
import LessonList from "./LessonList";

const BASE_URL = "http://localhost:5000/api";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [animateBadge, setAnimateBadge] = useState(false);
  const [loading, setLoading] = useState(true);

  const USER_ID = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        // Fetch course
        const courseRes = await axios.get(`${BASE_URL}/courses/${courseId}`);
        const courseData = courseRes.data.course || courseRes.data;
        setCourse(courseData);

        // Find lesson by ID
        let foundLesson = null;
        for (let mod of courseData.modules || []) {
          foundLesson = mod.lessons.find((l) => l._id === lessonId);
          if (foundLesson) break;
        }
        if (foundLesson) setLesson(foundLesson);

        // Fetch enrollment
        const enrollmentRes = await axios.get(`${BASE_URL}/enrollments/${USER_ID}/${courseId}`);
        const enrollment = enrollmentRes.data;

        const completedIds = enrollment.progress?.map((p) => p.lessonId) || [];
        setCompletedLessons(completedIds);

        // Set current lesson from enrollment if not in URL
        if (!lessonId && enrollment.currentLesson) {
          const current = courseData.modules?.flatMap((m) => m.lessons)
            .find((l) => l._id === enrollment.currentLesson);
          if (current) setLesson(current);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load lesson or enrollment");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [courseId, lessonId, USER_ID]);

  const handleMarkComplete = async () => {
    if (!lesson || !course) return;
    try {
      const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
      const updatedLessons = [...new Set([...completedLessons, lesson._id])];

      // Update enrollment progress
      await axios.post(`${BASE_URL}/enrollments/${USER_ID}/${courseId}/progress`, {
        completedLessons: updatedLessons,
        totalLessons,
        currentLesson: lesson._id
      });

      setCompletedLessons(updatedLessons);

      // Trigger pop animation
      setAnimateBadge(true);
      setTimeout(() => setAnimateBadge(false), 500);

      toast.success("Lesson marked completed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark lesson complete");
    }
  };

  if (loading) return <p className="pt-20 text-center">Loading lesson...</p>;
  if (!lesson) return <p className="pt-20 text-center text-red-500">Lesson not found</p>;

  return (
    <div className="px-6 pt-28 pb-16 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>

        {lesson.content && (
          <p className="mb-4 text-gray-700 dark:text-gray-200">{lesson.content}</p>
        )}

        {lesson.images?.length > 0 && (
          <div className="mb-4 space-y-4">
            {lesson.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Lesson image ${idx + 1}`}
                className="rounded-lg shadow"
              />
            ))}
          </div>
        )}

        <button
          className={`px-4 py-2 rounded-lg mb-4 ${
            completedLessons.includes(lesson._id)
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition`}
          onClick={handleMarkComplete}
          disabled={completedLessons.includes(lesson._id)}
        >
          {completedLessons.includes(lesson._id) ? (
            <span className={animateBadge ? "animate-pop" : ""}>✅ Completed</span>
          ) : (
            "Mark as Completed"
          )}
        </button>

        <CourseProgress courseId={courseId} />

        {course && (
          <LessonList
            lessons={course.modules?.flatMap((m) => m.lessons) || []}
            completedLessons={completedLessons}
            setCurrentLesson={(l) => setLesson(l)}
            currentLesson={lesson}
            onMarkComplete={handleMarkComplete}
          />
        )}
      </div>
    </div>
  );
}
