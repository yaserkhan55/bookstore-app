// src/components/LessonList.jsx
import React from "react";
import "./LessonList.css";

export default function LessonList({
  lessons = [],
  completedLessons = [],
  onMarkComplete,
  setCurrentLesson,
  currentLesson,
  disabled = false,
}) {
  if (!lessons.length) return <p>No lessons available</p>;

  return (
    <ul className="space-y-2">
      {lessons.map((lesson, index) => {
        const isCompleted = completedLessons.includes(lesson._id);
        const isActive = currentLesson?._id === lesson._id;

        return (
          <li
            key={lesson._id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition
              ${isActive ? "bg-pink-100 dark:bg-purple-900" : "bg-gray-100 dark:bg-slate-700"}
              ${disabled ? "opacity-50 pointer-events-none" : "hover:bg-gray-200 dark:hover:bg-slate-600"}`}
            onClick={() => !disabled && setCurrentLesson(lesson)}
          >
            <div className="flex items-center space-x-2">
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold
                  ${isCompleted
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200"}`}
              >
                {isCompleted ? "✓" : index + 1}
              </span>
              <span className={`${isCompleted ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
                {lesson.title}
              </span>

              {/* Completed badge */}
              {isCompleted && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full 
                                 bg-gradient-to-r from-pink-500 to-purple-500 text-white completed-badge animate-pop">
                  ✅ Completed
                </span>
              )}
            </div>

            {!isCompleted && !disabled && (
              <button
                className="ml-2 px-3 py-1 text-sm font-medium rounded-lg shadow-sm
                  text-white bg-gradient-to-r from-pink-500 to-purple-500
                  hover:from-pink-600 hover:to-purple-600 active:from-pink-700 active:to-purple-700
                  transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkComplete(lesson._id);
                }}
              >
                Mark Complete
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
