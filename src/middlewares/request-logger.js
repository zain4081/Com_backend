"use strict";

module.exports = () => {
  return async (ctx, next) => {


      console.log("\n================ REQUEST ================");
      console.log("Method       :", ctx.method);
      console.log("URL          :", ctx.request.url);
      console.log("Content-Type :", ctx.request.headers["content-type"]);
      console.log("Authorization:", ctx.request.headers["authorization"] || "None");
      console.log("Body:");
      console.dir(ctx.request.body, { depth: null });
      console.log("=========================================\n");


    await next();


      console.log("\n================ RESPONSE ===============");
      console.log("Status:", ctx.status);
      console.log("Body:");
      console.dir(ctx.body, { depth: null });
      console.log("=========================================\n");
      console.log("===================END RESQUEST============\n");
  };
};