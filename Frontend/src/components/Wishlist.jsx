// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import CourseCard from "./CourseCard";

// export default function WishlistPage() {
//   const [wishlistCourses, setWishlistCourses] = useState([]);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);

//   const authRequest = async (requestFn) => {
//     let token = localStorage.getItem("token");
//     try {
//       return await requestFn(token);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         const refreshToken = localStorage.getItem("refreshToken");
//         if (!refreshToken) throw err;

//         try {
//           const res = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
//           token = res.data.token;
//           localStorage.setItem("token", token);
//           return await requestFn(token);
//         } catch (refreshErr) {
//           console.error("Token refresh failed", refreshErr);
//           throw refreshErr;
//         }
//       } else {
//         throw err;
//       }
//     }
//   };

//   const fetchWishlist = async () => {
//     try {
//       const res = await authRequest((token) =>
//         axios.get("http://localhost:5000/api/wishlist", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//       );
//       setWishlistCourses(res.data.courses || []);
//     } catch (err) {
//       console.error("Failed to fetch wishlist", err);
//       setWishlistCourses([]);
//     }
//   };

//   const fetchEnrolled = async () => {
//     try {
//       const res = await authRequest((token) =>
//         axios.get("http://localhost:5000/api/enrollments/user", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//       );
//       setEnrolledCourses(res.data.courses?.map((c) => c._id) || []);
//     } catch (err) {
//       console.error("Failed to fetch enrolled courses", err);
//       setEnrolledCourses([]);
//     }
//   };

//   useEffect(() => {
//     fetchWishlist();
//     fetchEnrolled();

//     // Auto-refresh when wishlist changes
//     const handleStorage = (e) => {
//       if (e.key === "wishlistUpdated") fetchWishlist();
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   const handleWishlistToggle = async (courseId, added) => {
//     try {
//       if (added) {
//         await authRequest((token) =>
//           axios.post(
//             "http://localhost:5000/api/wishlist/add",
//             { courseId },
//             { headers: { Authorization: `Bearer ${token}` } }
//           )
//         );
//       } else {
//         await authRequest((token) =>
//           axios.delete(`http://localhost:5000/api/wishlist/remove/${courseId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         );
//       }
//       // Re-fetch full wishlist to ensure no blank page
//       await fetchWishlist();
//       localStorage.setItem("wishlistUpdated", Date.now());
//     } catch (err) {
//       console.error("Wishlist toggle failed", err);
//     }
//   };

//   const handleEnroll = (courseId) => {
//     setEnrolledCourses((prev) => [...prev, courseId]);
//   };

//   if (!wishlistCourses.length) {
//     return (
//       <div className="p-6 text-center text-gray-500 dark:text-gray-300">
//         Your wishlist is empty.
//       </div>
//     );
//   }

//   return (
//     <div className="grid md:grid-cols-3 gap-8 p-6">
//       {wishlistCourses.map((course) => (
//         <CourseCard
//           key={course._id}
//           course={course}
//           enrolledCourses={enrolledCourses}
//           wishlist={wishlistCourses.map((c) => c._id)}
//           enrollCourse={handleEnroll}
//           addToWishlist={() => handleWishlistToggle(course._id, true)}
//           removeFromWishlist={() => handleWishlistToggle(course._id, false)}
//         />
//       ))}
//     </div>
//   );
// }
