"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::report.report", ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const input = ctx.request.body?.data ?? {};
    const report = await strapi.db.query("api::report.report").create({
      data: {
        skill: input.skill,
        reason: input.reason,
        details: input.details ?? "",
        reporter: user.id,
        status: "open",
      },
      populate: {
        skill: true,
        reporter: true,
      },
    });

    ctx.body = { data: report };
  },
}));

