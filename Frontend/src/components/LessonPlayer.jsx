import React from "react";

export default function LessonPlayer({ url }) {
  if (!url) return <p className="text-center text-gray-500">No video available</p>;

  // Check if it's a YouTube embed URL
  const isYouTube = url.includes("youtube.com/embed");

  return (
    <div className="w-full h-64 md:h-96 bg-black rounded-lg overflow-hidden">
      {isYouTube ? (
        <iframe
          width="100%"
          height="100%"
          src={url}
          title="YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          width="100%"
          height="100%"
          controls
          className="rounded-lg"
          src={url}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
