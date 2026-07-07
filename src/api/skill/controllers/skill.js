"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::skill.skill", ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You must be logged in.");
    }

    const { data } = ctx.request.body;

    const skill = await strapi.documents("api::skill.skill").create({
      data: {
        ...data,
        owner: user.documentId,
      },
    });

    return this.transformResponse(skill);
  },
}));