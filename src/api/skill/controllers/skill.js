"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

const ALLOWED_TYPES = ["offer", "request"];

async function attachRatings(strapi, skills) {
  if (!skills.length) return skills;

  const skillIds = skills.map((skill) => skill.id);

  const reviews = await strapi.db.query("api::review.review").findMany({
    where: {
      skill: {
        id: {
          $in: skillIds,
        },
      },
    },
    select: ["id", "rating", "comment", "createdAt"],
    populate: {
      skill: {
        select: ["id"],
      },
      reviewer: {
        select: ["id", "username"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const ratingsMap = new Map();

  for (const review of reviews) {
    const skillId = review.skill?.id;
    if (!skillId) continue;

    if (!ratingsMap.has(skillId)) {
      ratingsMap.set(skillId, {
        total: 0,
        count: 0,
        reviews: [],
      });
    }

    const stats = ratingsMap.get(skillId);

    stats.total += review.rating;
    stats.count += 1;

    stats.reviews.push({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      reviewer: review.reviewer
        ? {
            id: review.reviewer.id,
            username: review.reviewer.username,
          }
        : null,
    });
  }

  return skills.map((skill) => {
    const stats = ratingsMap.get(skill.id);

    return {
      ...skill,
      averageRating: stats
        ? (stats.total / stats.count).toFixed(1)
        : "0.0",
      reviewCount: stats ? stats.count : 0,
      reviews: stats ? stats.reviews : [],
    };
  });
}

module.exports = createCoreController("api::skill.skill", ({ strapi, super: parent }) => ({
  /**
   * GET /api/skills
   */

  async findOne(ctx) {
  const result = await super.findOne(ctx);

  if (!result.data) {
    return result;
  }

  const [skill] = await attachRatings(strapi, [result.data]);

  result.data = skill;

  return result;
},

  /**
   * GET /api/skills/:type
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

    const skillsWithRatings = await attachRatings(strapi, skills);

    ctx.body = {
      data: skillsWithRatings,
    };
  },

  /**
   * GET /api/skills/:type/me
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

    const skillsWithRatings = await attachRatings(strapi, skills);

    ctx.body = {
      data: skillsWithRatings,
    };
  },
}));