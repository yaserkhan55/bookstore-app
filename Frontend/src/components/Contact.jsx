import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponseMsg(data.message || "Message sent");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setResponseMsg("❌ Failed to send message. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Contact <span className="text-pink-500">Us</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Have questions, suggestions, or just want to say hello? We’d love to hear from you!
        </p>
      </div>

      {/* Layout: Info + Form */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="mb-6">
            Our team is here to answer your questions and provide support.
          </p>
          <ul className="space-y-4">
            <li>📍 <strong>Address:</strong> 123 Book Street, Knowledge City</li>
            <li>📞 <strong>Phone:</strong> +1 (555) 123-4567</li>
            <li>📧 <strong>Email:</strong> support@bookstore.com</li>
          </ul>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 
                       text-gray-900 dark:text-white bg-white dark:bg-slate-900"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 
                       text-gray-900 dark:text-white bg-white dark:bg-slate-900"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 
                       text-gray-900 dark:text-white bg-white dark:bg-slate-900"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 
                       text-gray-900 dark:text-white bg-white dark:bg-slate-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {responseMsg && (
            <p
              className={`mt-2 text-sm ${
                responseMsg.includes("❌") ? "text-red-600" : "text-green-600"
              }`}
            >
              {responseMsg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
