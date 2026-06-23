const { z } = require("zod");

const createFinalWishSchema =
    z.object({
        category: z.enum([
            "PERSONAL",
            "FAMILY",
            "ASSET",
            "BUSINESS",
            "OTHER",
        ]),

        title: z.string(),

        content: z.string(),
    });

module.exports = {
    createFinalWishSchema,
};