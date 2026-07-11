"use strict";


module.exports = {
  routes: [
    {
      method: "GET",
      path: "/skills/type/:type",
      handler: "skill.findByType",
      config: {
        auth: {},
      },
    },
    {
      method: "GET",
      path: "/skills/type/:type/me",
      handler: "skill.findMySkillsByType",
      config: {
        auth: {},
      },
    },
  ],
};