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

// Free Books Component
import BookCards from "./components/BookCards";

// Paid Books Component
import PaidBooks from "./components/PaidBooks";

function App() {
  // Initialize userId if not set
  if (!localStorage.getItem("userId") || localStorage.getItem("userId") === "undefined") {
    localStorage.setItem("userId", "64f8c2a1aa9c6302c2bfb262");
    console.log("✅ userId initialized in localStorage");
  }

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-20 flex-grow">
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
<Route path="/purchases" element={<MyPurchases />} />
          {/* Free Books */}
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <BookCards />
              </PrivateRoute>
            }
          />

          {/* Paid Books */}
          <Route
            path="/paid-books"
            element={
              <PrivateRoute>
                <PaidBooks />
              </PrivateRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Users Route */}
          <Route path="/users" element={<Dashboard />} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
