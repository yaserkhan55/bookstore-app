// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./home/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import About from "./components/About";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./context/PrivateRoute";
import MyPurchases from "./components/MyPurchases";
import BookCards from "./components/BookCards";
import PaidBooks from "./components/PaidBooks";

function App() {
  // ✅ Ensure userId exists in localStorage
  if (
    !localStorage.getItem("userId") ||
    localStorage.getItem("userId") === "undefined"
  ) {
    localStorage.setItem("userId", "64f8c2a1aa9c6302c2bfb262");
    console.log("✅ userId initialized in localStorage");
  }

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-20 flex-grow">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />

  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />

  <Route
    path="/purchases"
    element={
      <PrivateRoute>
        <MyPurchases />
      </PrivateRoute>
    }
  />

  <Route
    path="/books"
    element={
      <PrivateRoute>
        <BookCards />
      </PrivateRoute>
    }
  />

  <Route
    path="/paid-books"
    element={
      <PrivateRoute>
        <PaidBooks />
      </PrivateRoute>
    }
  />

  {/* ✅ NEW ROUTE for reading purchased book */}
  <Route
    path="/paid-books/read/:bookId"
    element={
      <PrivateRoute>
        <PaidBooks />
      </PrivateRoute>
    }
  />

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

      </div>

      <Footer />
    </div>
  );
}

export default App;
