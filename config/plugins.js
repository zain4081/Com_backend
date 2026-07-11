module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
      register: {
        allowedFields: ['type'],
      }
    },
  },
});