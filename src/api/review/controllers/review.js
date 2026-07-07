"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const input = ctx.request.body?.data ?? {};
    const bookingId = Number(input.booking);

    const booking = await strapi.db.query("api::booking.booking").findOne({
      where: { id: bookingId },
      populate: {
        skill: true,
        requester: true,
        provider: true,
      },
    });

    if (!booking) {
      return ctx.notFound("Booking not found.");
    }

    if (booking.status !== "completed") {
      return ctx.badRequest("Only completed bookings can be reviewed.");
    }

    if (booking.requester?.id !== user.id && booking.provider?.id !== user.id) {
      return ctx.forbidden("You do not have permission to review this booking.");
    }

    const exists = await strapi.db.query("api::review.review").findOne({
      where: {
        booking: bookingId,
        reviewer: user.id,
      },
    });

    if (exists) {
      return ctx.badRequest("You have already reviewed this booking.");
    }

    const revieweeId = booking.requester?.id === user.id ? booking.provider?.id : booking.requester?.id;
    const review = await strapi.db.query("api::review.review").create({
      data: {
        booking: bookingId,
        skill: booking.skill?.id,
        reviewer: user.id,
        reviewee: revieweeId,
        rating: Number(input.rating),
        comment: input.comment ?? "",
      },
      populate: {
        booking: { populate: { skill: true, requester: true, provider: true } },
        skill: true,
        reviewer: true,
        reviewee: true,
      },
    });

    await strapi.db.query("api::booking.booking").update({
      where: { id: bookingId },
      data: {
        reviewed: true,
      },
    });

    if (revieweeId) {
      await strapi.db.query("api::notification.notification").create({
        data: {
          recipient: revieweeId,
          title: "New review received",
          message: `${user.username} left a ${Number(input.rating)}-star review.`,
          type: "review",
          booking: bookingId,
          isRead: false,
        },
      });
    }

    ctx.body = { data: review };
  },
}));

