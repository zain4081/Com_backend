"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

const ALLOWED_TYPES = ["offer", "request"];

module.exports = createCoreController("api::skill.skill", ({ strapi }) => ({
  /**
   * GET /api/skills/:type
   * Returns approved skills of the given type,
   * excluding the authenticated user's own skills.
   */
  async findByType(ctx) {
    const { type } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return ctx.badRequest("Invalid skill type.");
    }

    const skills = await strapi.documents("api::skill.skill").findMany({
      filters: {
        skillType: {
          $eq: type,
        },
        approvalStatus: {
          $eq: "approved",
        },
        owner: {
          id: {
            $ne: user.id,
          },
        },
      },
      populate: {
        category: true,
        owner: {
          fields: ["id", "username", "email"],
        },
      },
      sort: {
        createdAt: "desc",
      },
    });

    ctx.body = {
      data: skills,
    };
  },

  /**
   * GET /api/skills/:type/me
   * Returns the authenticated user's skills of the given type.
   */
  async findMySkillsByType(ctx) {
    const { type } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return ctx.badRequest("Invalid skill type.");
    }

    const skills = await strapi.documents("api::skill.skill").findMany({
      filters: {
        skillType: {
          $eq: type,
        },
        owner: {
          id: {
            $eq: user.id,
          },
        },
      },
      populate: {
        category: true,
        owner: {
          fields: ["id", "username", "email"],
        },
      },
      sort: {
        createdAt: "desc",
      },
    });

    ctx.body = {
      data: skills,
    };
  },
}));