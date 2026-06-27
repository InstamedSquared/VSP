const csrf = require("csrf-csrf");

// 1. Handle different import styles (CommonJS vs ESM)
const doubleCsrf = csrf.doubleCsrf || csrf.default?.doubleCsrf;

if (!doubleCsrf) {
    throw new Error("Failed to import 'doubleCsrf' from 'csrf-csrf'. Check your installation.");
}

const CSRF_SECRET = process.env.COOKIE_SECRET || "fallback_secret_key_change_in_prod";

const csrfOptions = {
    getSecret: () => CSRF_SECRET,
    cookieName: "x-csrf-token",
    cookieOptions: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    },
    // 2. REQUIRED: Binds the token to the user session
    getSessionIdentifier: (req) => {
        return req.user ? req.user.id.toString() : "anon";
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromRequest: (req) => {
        return req.headers["x-csrf-token"];
    },
};

// 3. Capture the result object
const csrfUtilities = doubleCsrf(csrfOptions);

// 4. Extract the specific function using the name found in your logs
// We check for both 'generateCsrfToken' (your version) and 'generateToken' (newer versions)
const tokenGenerator = csrfUtilities.generateCsrfToken || csrfUtilities.generateToken;

// 5. Verify it exists
if (typeof tokenGenerator !== 'function') {
    console.error("🔴 CRITICAL: CSRF token generator function not found.");
    console.error("Available keys:", Object.keys(csrfUtilities));
}

const handleCsrfError = (error, req, res, next) => {
  if (error === csrfUtilities.invalidCsrfTokenError) {
    console.warn(`CSRF validation failed: ${req.path}`);
    console.warn('Headers received:', JSON.stringify(req.headers, null, 2));
    console.warn('Cookies:', JSON.stringify(req.cookies, null, 2));
    console.warn('Signed Cookies:', JSON.stringify(req.signedCookies, null, 2));
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token.",
    });
  }
  next(error);
};

module.exports = {
    doubleCsrfProtection: csrfUtilities.doubleCsrfProtection,
    csrfErrorHandler: handleCsrfError,
    generateToken: tokenGenerator // Export as 'generateToken' for index.js compatibility
};