"use strict";

module.exports = (plugin) => {
  console.log("✅ Users & Permissions extension loaded");

  // Save original controllers
  const originalCallback = plugin.controllers.auth.callback;
  const originalRegister = plugin.controllers.auth.register;

  // Override login
  plugin.controllers.auth.callback = async (ctx) => {
    console.log("\n========== LOGIN ==========");
    console.log("Method:", ctx.method);
    console.log("URL:", ctx.url);
    console.log("Headers:", ctx.request.headers);
    console.log("Body:", ctx.request.body);
    console.log("===========================\n");

    return await originalCallback(ctx);
  };

  // Override register
  plugin.controllers.auth.register = async (ctx) => {
    console.log("\n========= REGISTER =========");
    console.log("Method:", ctx.method);
    console.log("URL:", ctx.url);
    console.log("Headers:", ctx.request.headers);
    console.log("Body:", ctx.request.body);
    console.log("============================\n");

    return await originalRegister(ctx);
  };

  return plugin;
};