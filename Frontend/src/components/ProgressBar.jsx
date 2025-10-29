import React from "react";

export default function ProgressBar({ progress = 0 }) {
  return (
    <div className="w-full bg-gray-300 dark:bg-slate-700 h-5 rounded-full overflow-hidden shadow-inner">
      <div
        className="h-5 flex items-center justify-center text-xs font-semibold text-white transition-all duration-500 ease-out
                   bg-gradient-to-r from-pink-500 to-purple-500"
        style={{ width: `${progress}%` }}
      >
        {progress > 5 && `${progress}%`}
      </div>
    </div>
  );
}
