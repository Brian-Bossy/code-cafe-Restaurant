module.exports = {
  cookieName: 'coffeeJWT',
  // Use the PORT environment variable provided by Render, default to 3030 locally
  port: process.env.PORT || 3030,
  // Use the JWT_SECRET environment variable, default to the local one if not set
  // IMPORTANT: Set JWT_SECRET in Render's environment variables!
  secret: process.env.JWT_SECRET || 'bnr-secret-sauce',
};
