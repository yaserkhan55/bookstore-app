// src/middleware/appConfig.js
import express from "express";
import cors from "cors";

export default function configureApp(app) {
  // enable cross-origin requests (frontend <-> backend)
  app.use(cors());

  // parse JSON request bodies
  app.use(express.json());

  // optional: parse urlencoded data
  app.use(express.urlencoded({ extended: true }));

  console.log("✅ Middleware configured (CORS + JSON + URL-Encoded)");
}
