"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/reviews/skill/:documentId",
      handler: "review.findBySkill",
      config: {
        auth: false,
      },
    },
  ],
};