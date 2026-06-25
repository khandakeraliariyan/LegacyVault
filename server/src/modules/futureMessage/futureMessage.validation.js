const { z } = require("zod");

const createFutureMessageSchema =
    z.object({
        title: z.string(),

        messageType: z.enum([
            "TEXT",
            "AUDIO",
            "VIDEO",
        ]),

        content: z.string().optional(),
    });

module.exports = {
    createFutureMessageSchema,
};