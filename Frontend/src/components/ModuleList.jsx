// src/components/ModuleList.jsx
import React from "react";
import LessonList from "./LessonList";

export default function ModuleList({
  modules = [],
  courseId,
  completedLessons = [],
  onMarkComplete, // ✅ comes from CourseDetail
}) {
  return (
    <div className="space-y-6">
      {modules.map((mod, idx) => {
        const moduleId = String(mod._id || idx); // normalize

        return (
          <div
            key={moduleId}
            className="bg-slate-800 rounded-lg p-4"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {mod.title}
            </h3>

            <LessonList
              lessons={mod.lessons || []}
              courseId={courseId}
              moduleId={moduleId}
              completedLessons={completedLessons}
              onMarkComplete={(lessonId) => {
                console.log("📌 [ModuleList] Passing lessonId → CourseDetail:", {
                  moduleId,
                  lessonId,
                });
                if (onMarkComplete) {
                  onMarkComplete(lessonId);
                } else {
                  console.warn("⚠️ [ModuleList] onMarkComplete not provided!");
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
  