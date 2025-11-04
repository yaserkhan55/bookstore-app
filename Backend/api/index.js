// /api/index.js
import app from "../Backend/index.js";
import serverless from "serverless-http";

export const handler = serverless(app);
