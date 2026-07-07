const categoryUid = "api::category.category";
const pageUid = "api::page.page";

const starterCategories = [
  { name: "IT", slug: "it", description: "Web, app, and digital support." },
  { name: "Arts", slug: "arts", description: "Design, photography, and creative work." },
  { name: "Education", slug: "education", description: "Tutoring, mentoring, and study help." },
  { name: "Household", slug: "household", description: "Practical home and neighborhood help." },
];

const starterPages = [
  {
    title: "About",
    slug: "about",
    excerpt: "Why this platform exists.",
    content:
      "Community Skills Exchange Platform helps people trade useful skills and support without money. It focuses on trust, simple booking, and practical local collaboration.",
  },
  {
    title: "FAQ",
    slug: "faq",
    excerpt: "Common questions.",
    content:
      "Create an account, add a skill you offer or need, browse the skill board, and send a request. Once the exchange is completed, leave a review to help others decide.",
  },
  {
    title: "Policies",
    slug: "policies",
    excerpt: "Basic platform and safety rules.",
    content:
      "Be respectful, communicate clearly, and report abusive or misleading content. Moderators can reject content that breaks community guidelines.",
  },
];

module.exports = {
  async bootstrap({ strapi }) {
    const existingCategories = await strapi.db.query(categoryUid).findMany({ limit: 1 });
    if (!existingCategories.length) {
      for (const category of starterCategories) {
        await strapi.db.query(categoryUid).create({ data: category });
      }
    }

    const existingPages = await strapi.db.query(pageUid).findMany({ limit: 1 });
    if (!existingPages.length) {
      for (const page of starterPages) {
        await strapi.db.query(pageUid).create({ data: page });
      }
    }
  },
};
