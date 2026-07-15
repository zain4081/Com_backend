"use strict";


module.exports = {
  routes: [
    {
      method: "GET",
      path: "/skills/top-rated",
      handler: "skill.findTopRated",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/skills/homepage",
      handler: "skill.homepageSkills",
      config: {
        auth: false,
      },
    },
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