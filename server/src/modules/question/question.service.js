const bcrypt = require("bcryptjs");

const Question = require("./question.model");

const { createAuditLog, } = require("../audit/audit.service");

const createQuestion = async (userId, payload) => {
    const hashedAnswer =
        await bcrypt.hash(
            payload.answer,
            10
        );

    const question =
        await Question.create({
            ownerId: userId,

            question: payload.question,

            answerHash: hashedAnswer,
        });

    await createAuditLog({
        actorId: userId,
        action: "QUESTION_CREATED",
        entity: "QUESTION",
        entityId: question._id,
    });

    return question;
};

const getMyQuestions = async (userId) => {
    return await Question.find({
        ownerId: userId,
    }).select("-answerHash");
};

const deleteQuestion = async (userId, questionId) => {
    return await Question.findOneAndDelete({
        _id: questionId,
        ownerId: userId,
    });
};

module.exports = {
    createQuestion,
    getMyQuestions,
    deleteQuestion,
};