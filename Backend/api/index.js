// Backend/api/index.js
import app from "../index.js";
import serverless from "serverless-http";

// Wrap your Express app in a serverless function handler
export const handler = serverless(app);
export default handler;
