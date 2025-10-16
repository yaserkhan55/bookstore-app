// src/pages/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("isSignedUp");

      toast.success("Logged out successfully");

      // Redirect to homepage after short delay
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // ensures UI updates after logout
      }, 500);
    } catch (error) {
      toast.error("Error during logout: " + error);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="px-3 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
