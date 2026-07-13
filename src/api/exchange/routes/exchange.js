"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/exchange/me",
      handler: "exchange.me",
      config: {
        auth: {},
      },
    },
    {
      method: "PUT",
      path: "/exchange/me",
      handler: "exchange.updateMe",
      config: {},
    },
    {
      method: "GET",
      path: "/exchange/bookings",
      handler: "exchange.bookings",
      config: {},
    },
    {
      method: "GET",
      path: "/exchange/stats",
      handler: "exchange.stats",
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
