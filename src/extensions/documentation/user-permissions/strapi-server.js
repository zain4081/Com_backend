module.exports = (plugin) => {
  const originalCallback = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx) => {
    console.log("==== LOGIN REQUEST ====");
    console.log(ctx.request.body);

    return originalCallback(ctx);
  };

  return plugin;
};