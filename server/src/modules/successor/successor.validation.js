const { z } = require("zod");

const createSuccessorSchema = z.object({
    fullName: z.string(),

    email: z.string().email(),

    phone: z.string(),

    nidNumber: z.string(),

    relationship: z.string(),
});

module.exports = {
    createSuccessorSchema,
};
