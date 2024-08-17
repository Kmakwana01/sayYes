const { Op } = require('sequelize');
const ICE_BREAKER_ANSWER = require('../models/icebreakerAnswer')
const ICE_BREAKER_QUESTION = require('../models/icebreakerQuestions');
const USER = require('../models/user');

exports.addQuestion = async (req, res) => {
    try {

        const { userId, question } = req.body;

        if (!question) throw new Error('question is required.')

        if (userId) {
            let findUser = await USER.findOne({
                where: {
                    userId
                }
            })
            if (!findUser) throw new Error('please provide valid userId.')
        }

        const newQuestion = await ICE_BREAKER_QUESTION.create({
            userId: userId ?? null,
            question: question
        })

        res.status(200).json({
            status: true,
            message: 'Question Add Successfully.',
            data: newQuestion
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.getQuestion = async (req, res) => {
    try {

        const { userId } = req.query;

        if (userId) {
            let findUser = await USER.findOne({
                where: {
                    userId
                }
            })
            if (!findUser) throw new Error('please provide valid userId.')
        }

        const getQuestions = await ICE_BREAKER_QUESTION.findAll({
            where: {
                [Op.or]: [
                    { userId: null },
                    { userId: userId }
                ]
            }
        })

        res.status(200).json({
            status: true,
            message: 'Questions Get Successfully.',
            data: getQuestions
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.updateQuestion = async (req, res) => {
    try {

        let { id, question } = req.body;

        if (!id) throw new Error('id is required.');
        if (!question) throw new Error('question is required.');

        let findQuestion = await ICE_BREAKER_QUESTION.findOne({
            where: {
                id
            }
        })
        if (!findQuestion) throw new Error('please provide valid id.')

        findQuestion.question = question
        await findQuestion.save();

        res.status(200).json({
            status: true,
            message: 'Question Update Successfully.',
            data: findQuestion
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.deleteQuestion = async (req, res) => {
    try {

        let { id } = req.query;

        if (!id) throw new Error('id is required.');

        let findQuestion = await ICE_BREAKER_QUESTION.findOne({
            where: {
                id
            }
        })

        await ICE_BREAKER_ANSWER.destroy({
            where : {
                questionId : id
            }
        })

        if (!findQuestion) throw new Error('please provide valid id.')

        await findQuestion.destroy()

        res.status(200).json({
            status: true,
            message: 'Question delete successfully.'
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.addAnswer = async (req, res) => {
    try {

        let { questionId, answer, userId } = req.body;

        if (!questionId) throw new Error('questionId is required.');
        if (!answer) throw new Error('answer is required.');
        if (!userId) throw new Error('userId is required.');

        let findUser = await USER.findOne({
            where: {
                userId
            }
        })
        if (!findUser) throw new Error('please provide valid userId.')

        let findQuestion = await ICE_BREAKER_QUESTION.findOne({
            where: {
                id: questionId,
            }
        })
        if (!findQuestion) throw new Error('please provide valid questionId.')

        let isAnswer = await ICE_BREAKER_ANSWER.findOne({
            where: {
                userId,
                questionId: questionId,
            }
        })

        if (isAnswer) {

            isAnswer.answer = answer;
            await isAnswer.save()

        } else {
            isAnswer = await ICE_BREAKER_ANSWER.create({
                userId,
                questionId: questionId,
                answer
            })
        }
        res.status(200).json({
            status: true,
            message: 'Answer Submit Successfully.',
            data: isAnswer
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
}

exports.getQuestionsWithAnswer = async (req, res) => {
    try {

        const { userId } = req.query;

        if (!userId) throw new Error('userId is required.');

        let findUser = await USER.findOne({
            where: {
                userId
            }
        })
        if (!findUser) throw new Error('please provide valid userId.')

        let findAnswers = await ICE_BREAKER_ANSWER.findAll({
            where: {
                userId
            }
        })

        let response = [];
        for (const iterator of findAnswers) {
            let findQuestion = await ICE_BREAKER_QUESTION.findOne({
                where: {
                    id: iterator.questionId
                }
            })
            response.push({
                question: findQuestion,
                answer: iterator
            })
        }

        res.status(200).json({
            status: true,
            message: 'Get Answers Successfully.',
            data: response
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.deleteAnswer = async (req, res) => {
    try {

        let { id } = req.query;

        if (!id) throw new Error('id is required.');

        let findAnswer = await ICE_BREAKER_ANSWER.findOne({
            where: {
                id
            }
        })

        if (!findAnswer) throw new Error('please provide valid id.')

        await findAnswer.destroy()

        res.status(200).json({
            status: true,
            message: 'Answer delete Successfully.'
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}
