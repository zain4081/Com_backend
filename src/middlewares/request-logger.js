"use strict";

module.exports = () => {
  return async (ctx, next) => {

      console.log("==================================");
      console.log("METHOD :", ctx.method);
      console.log("URL    :", ctx.url);
      console.dir(ctx.request.body, { depth: null });
      console.log("==================================");

    await next();
  };
};