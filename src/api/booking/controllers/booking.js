"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

async function createNotification(strapi, recipient, title, message, bookingId, type = "system") {
  await strapi.db.query("api::notification.notification").create({
    data: {
      recipient,
      title,
      message,
      type,
      booking: bookingId,
      isRead: false,
    },
  });
}

module.exports = createCoreController("api::booking.booking", ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const input = ctx.request.body?.data ?? {};
    const skillId = Number(input.skill);
    const skill = await strapi.db.query("api::skill.skill").findOne({
      where: { id: skillId },
      populate: { owner: true },
    });

    if (!skill || !skill.owner) {
      return ctx.notFound("Skill not found.");
    }

    if (skill.owner.id === user.id) {
      return ctx.badRequest("You cannot book your own skill.");
    }

    const booking = await strapi.db.query("api::booking.booking").create({
      data: {
        skill: skill.id,
        requester: user.id,
        provider: skill.owner.id,
        message: input.message,
        scheduledFor: input.scheduledFor,
        durationHours: Number(input.durationHours ?? 1),
        status: "pending",
        reviewed: false,
      },
      populate: {
        skill: { populate: { category: true, owner: true } },
        requester: true,
        provider: true,
      },
    });

    await createNotification(
      strapi,
      skill.owner.id,
      "New booking request",
      `${user.username} requested "${skill.title}".`,
      booking.id,
      "booking",
    );

    ctx.body = { data: booking };
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const bookingId = Number(ctx.params.id);
    const nextStatus = ctx.request.body?.data?.status;
    const booking = await strapi.db.query("api::booking.booking").findOne({
      where: { id: bookingId },
      populate: {
        skill: { populate: { owner: true } },
        requester: true,
        provider: true,
      },
    });

    if (!booking) {
      return ctx.notFound("Booking not found.");
    }

    if (nextStatus === "cancelled") {
      if (booking.requester?.id !== user.id) {
        return ctx.forbidden("Only the requester can cancel a booking.");
      }
    } else if (booking.provider?.id !== user.id) {
      return ctx.forbidden("Only the provider can update this booking.");
    }

    const updated = await strapi.db.query("api::booking.booking").update({
      where: { id: bookingId },
      data: {
        status: nextStatus,
      },
      populate: {
        skill: { populate: { category: true, owner: true } },
        requester: true,
        provider: true,
      },
    });

    const recipientId = nextStatus === "cancelled" ? booking.provider?.id : booking.requester?.id;
    if (recipientId) {
      await createNotification(
        strapi,
        recipientId,
        "Booking updated",
        `Booking for "${booking.skill?.title}" is now ${nextStatus}.`,
        bookingId,
        "status",
      );
    }

    ctx.body = { data: updated };
  },
}));

