"use strict";

async function getOrCreateProfile(strapi, user) {
  let profile = await strapi.db.query("api::profile.profile").findOne({
    where: { user: user.id },
    populate: { user: true },
  });

  if (!profile) {
    profile = await strapi.db.query("api::profile.profile").create({
      data: {
        fullName: user.username,
        bio: "",
        location: "",
        user: user.id,
      },
      populate: { user: true },
    });
  }

  return profile;
}

module.exports = {
  async me(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const profile = await getOrCreateProfile(strapi, user);
    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: profile.fullName,
      },
      profile,
    };
  },

  async updateMe(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const input = ctx.request.body ?? {};
    const profile = await getOrCreateProfile(strapi, user);

    const updated = await strapi.db.query("api::profile.profile").update({
      where: { id: profile.id },
      data: {
        fullName: input.fullName ?? profile.fullName,
        bio: input.bio ?? profile.bio,
        location: input.location ?? profile.location,
        avatarUrl: input.avatarUrl ?? profile.avatarUrl,
      },
      populate: { user: true },
    });

    ctx.body = { profile: updated };
  },

  async dashboard(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const profile = await getOrCreateProfile(strapi, user);
    const offeredSkills = await strapi.db.query("api::skill.skill").findMany({
      where: { owner: user.id, skillType: "offer" },
      populate: { category: true, owner: true },
      orderBy: { createdAt: "desc" },
    });
    const requestedSkills = await strapi.db.query("api::skill.skill").findMany({
      where: { owner: user.id, skillType: "request" },
      populate: { category: true, owner: true },
      orderBy: { createdAt: "desc" },
    });
    const incomingBookings = await strapi.db.query("api::booking.booking").findMany({
      where: { provider: user.id },
      populate: { skill: { populate: { category: true, owner: true } }, requester: true, provider: true },
      orderBy: { createdAt: "desc" },
    });
    const outgoingBookings = await strapi.db.query("api::booking.booking").findMany({
      where: { requester: user.id },
      populate: { skill: { populate: { category: true, owner: true } }, requester: true, provider: true },
      orderBy: { createdAt: "desc" },
    });
    const notifications = await strapi.db.query("api::notification.notification").findMany({
      where: { recipient: user.id },
      populate: { booking: { populate: { skill: { populate: { category: true, owner: true } }, requester: true, provider: true } } },
      orderBy: { createdAt: "desc" },
    });
    const reviews = await strapi.db.query("api::review.review").findMany({
      where: { reviewee: user.id },
      populate: { booking: { populate: { skill: true, requester: true, provider: true } }, skill: true, reviewer: true, reviewee: true },
      orderBy: { createdAt: "desc" },
    });

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: profile.fullName,
      },
      profile,
      offeredSkills,
      requestedSkills,
      incomingBookings,
      outgoingBookings,
      notifications,
      reviews,
      stats: {
        offeredCount: offeredSkills.length,
        requestedCount: requestedSkills.length,
        pendingBookingCount: [...incomingBookings, ...outgoingBookings].filter((booking) => booking.status === "pending")
          .length,
        unreadNotificationCount: notifications.filter((notification) => !notification.isRead).length,
      },
    };
  },

  async notifications(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const notifications = await strapi.db.query("api::notification.notification").findMany({
      where: { recipient: user.id },
      populate: {
        booking: { populate: { skill: { populate: { category: true, owner: true } }, requester: true, provider: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    ctx.body = { notifications };
  },

  async markNotificationRead(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    const notification = await strapi.db.query("api::notification.notification").findOne({
      where: { id: Number(ctx.params.id), recipient: user.id },
      populate: {
        booking: { populate: { skill: { populate: { category: true, owner: true } }, requester: true, provider: true } },
      },
    });

    if (!notification) {
      return ctx.notFound("Notification not found.");
    }

    const updated = await strapi.db.query("api::notification.notification").update({
      where: { id: notification.id },
      data: { isRead: true },
      populate: {
        booking: { populate: { skill: { populate: { category: true, owner: true } }, requester: true, provider: true } },
      },
    });

    ctx.body = { notification: updated };
  },
};

