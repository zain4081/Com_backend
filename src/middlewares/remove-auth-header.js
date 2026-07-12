module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const path = ctx.request.path;

    if (
      path === "/api/auth/local" ||
      path === "/api/auth/local/register"
    ) {
      // Remove Authorization header if present
      delete ctx.request.headers.authorization;
    }

    await next();
  };
};