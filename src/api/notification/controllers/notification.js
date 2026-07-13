"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::notification.notification",
  ({ strapi }) => ({

    /**
     * GET /api/notifications
     * Return logged-in user's notifications (latest first)
     */
    async find(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      const notifications = await strapi.db
        .query("api::notification.notification")
        .findMany({
          where: {
            recipient: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          populate: {
            booking: true,
          },
        });

      return {
        data: notifications,
      };
    },


    /**
     * PATCH /api/notifications/:id/read
     * Mark notification as read
     */
    async markAsRead(ctx) {
      const user = ctx.state.user;
      const { id } = ctx.params;

      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      const notification = await strapi.db
        .query("api::notification.notification")
        .findOne({
          where: {
            id,
            recipient: user.id,
          },
        });

      if (!notification) {
        return ctx.notFound("Notification not found");
      }


      const updatedNotification = await strapi.db
        .query("api::notification.notification")
        .update({
          where: {
            id,
          },
          data: {
            isRead: true,
          },
        });


      return {
        data: updatedNotification,
      };
    },

  })
);