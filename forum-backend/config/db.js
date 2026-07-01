module.exports = {
    mongoURI: process.env.MONGODB_URI || "mongodb://localhost:27017/forum",
    port: process.env.PORT || 5000,
    rateLimitWindowMs: 15 * 60 * 1000,
    rateLimitMax: 100,
};
