"use strict";

module.exports = {
  routes: [
    {
      method: "PATCH",
      path: "/notifications/:id/read",
      handler: "notification.markAsRead",
      config: {
        auth: {},
      },
    },
  ],
};