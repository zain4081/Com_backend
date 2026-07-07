"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/exchange/me",
      handler: "exchange.me",
      config: {},
    },
    {
      method: "PUT",
      path: "/exchange/me",
      handler: "exchange.updateMe",
      config: {},
    },
    {
      method: "GET",
      path: "/exchange/dashboard",
      handler: "exchange.dashboard",
      config: {},
    },
    {
      method: "GET",
      path: "/exchange/notifications",
      handler: "exchange.notifications",
      config: {},
    },
    {
      method: "PUT",
      path: "/exchange/notifications/:id/read",
      handler: "exchange.markNotificationRead",
      config: {},
    }
  ]
};
