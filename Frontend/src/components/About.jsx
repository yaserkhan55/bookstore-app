import React from "react";

export default function About() {
  return (
    <section className="p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          About <span className="text-pink-500">Us</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Learn more about who we are, what we do, and why we’re passionate about books.
        </p>
      </div>

      {/* Content Box */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-6">
          At BookStore, our mission is to make knowledge accessible to everyone, every day.
          We believe reading should be engaging, fun, and inspiring.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>📚 Wide selection of curated books</li>
          <li>🚀 Personalized recommendations</li>
          <li>❤️ Built by readers, for readers</li>
        </ul>
      </div>
    </section>
  );
}
