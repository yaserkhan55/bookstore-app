// middleware/defaultUser.js
export const attachDefaultUser = (req, res, next) => {
  if (!req.body.userId) {
    // fallback user (string, since schema is String-based for now)
    req.body.userId = "test-user";
    console.warn("⚠️ userId missing, defaulted to 'test-user'");
  }
  next();
};
