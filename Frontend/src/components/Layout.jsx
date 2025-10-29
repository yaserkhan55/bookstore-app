import React from "react";

export default function LessonList({
  lessons = [],
  courseId,
  completedLessons = [],
  onMarkComplete,
  setCurrentLesson,
  currentLesson,
  disabled = false, // disables interactions when course completed
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
              ${isActive ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-slate-700"}
              ${disabled ? "opacity-50 pointer-events-none" : "hover:bg-gray-200 dark:hover:bg-slate-600"}`}
            onClick={() => !disabled && setCurrentLesson(lesson)}
          >
            <div className="flex items-center space-x-2">
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold
                ${isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200"}`}
              >
                {isCompleted ? "✓" : index + 1}
              </span>
              <span className={`${isCompleted ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
                {lesson.title}
              </span>
            </div>

            {!isCompleted && !disabled && (
              <button
                className="ml-2 px-3 py-1 text-sm font-medium rounded-lg shadow-sm
                  bg-white text-gray-800 border border-gray-300
                  hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600
                  transition"
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
