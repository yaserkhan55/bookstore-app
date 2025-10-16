import React, { useState } from "react";
import LessonPlayer from "./LessonPlayer";

export default function LessonDetail({ lesson }) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [codingResults, setCodingResults] = useState({});

  if (!lesson) return <p className="text-gray-500">No lesson selected.</p>;

  const handleQuizChange = (quizIndex, value) => {
    setQuizAnswers({ ...quizAnswers, [quizIndex]: value });
  };

  const handleRunCode = (exerciseIndex) => {
    // For demo: echo starterCode as output
    setCodingResults({
      ...codingResults,
      [exerciseIndex]: lesson.codingExercises[exerciseIndex].starterCode,
    });
  };

  return (
    <div className="space-y-6">
      {/* Video */}
      {lesson.videoUrl && <LessonPlayer url={lesson.videoUrl} />}

      {/* Quizzes */}
      {lesson.quizzes?.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-lg mb-2 text-blue-700">Quizzes</h3>
          {lesson.quizzes.map((q, idx) => (
            <div key={idx} className="mb-3 p-3 bg-white rounded shadow-sm">
              <p className="font-medium">{q.question}</p>
              {q.options.map((opt, i) => (
                <label key={i} className="block cursor-pointer mt-1">
                  <input
                    type="radio"
                    name={`quiz-${idx}`}
                    value={opt}
                    checked={quizAnswers[idx] === opt}
                    onChange={() => handleQuizChange(idx, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
              {quizAnswers[idx] && (
                <p
                  className={`mt-1 font-semibold ${
                    quizAnswers[idx] === q.correctAnswer ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {quizAnswers[idx] === q.correctAnswer
                    ? "✅ Correct"
                    : `❌ Incorrect, answer: ${q.correctAnswer}`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Coding Exercises */}
      {lesson.codingExercises?.length > 0 && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-lg mb-2 text-green-700">Coding Exercises</h3>
          {lesson.codingExercises.map((ex, idx) => (
            <div key={idx} className="mb-3 p-3 bg-white rounded shadow-sm">
              <p className="font-medium mb-2">{ex.title}</p>
              <textarea
                className="w-full p-2 border border-gray-300 rounded mb-2"
                rows={5}
                defaultValue={ex.starterCode}
                id={`code-${idx}`}
              />
              <button
                onClick={() => handleRunCode(idx)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Run Code
              </button>
              {codingResults[idx] && (
                <pre className="bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
                  {codingResults[idx]}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assignments */}
      {lesson.assignments?.length > 0 && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-lg mb-2 text-yellow-700">Assignments</h3>
          {lesson.assignments.map((as, idx) => (
            <div
              key={idx}
              className="mb-3 p-3 bg-white rounded shadow-sm flex justify-between items-center"
            >
              <p>{as.title}</p>
              <a
                href={as.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
