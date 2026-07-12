module.exports = [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
          "media-src": ["'self'", "data:", "blob:", "https:"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: ["http://localhost:3000"],
      headers: "*",
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",

    // Custom middlewares
  "global::request-logger",
  "global::remove-auth-header",

  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];