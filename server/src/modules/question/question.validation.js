const { z } = require("zod");

const createQuestionSchema = z.object({
    question: z.string().min(5),

    answer: z.string().min(1),
});

module.exports = {
    createQuestionSchema,
};