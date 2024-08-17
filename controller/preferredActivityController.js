const { Sequelize, Op } = require("sequelize");
const PREFERRED_ACTIVITIES = require("../models/preferredActivities");
const SELECTED_ACTIVITIES = require("../models/selectedActivities");
const MATCH_USERS = require('../models/matchUsers')
const USER = require("../models/user");

exports.addActivity = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) throw new Error('name is required.');

        let findActivity = await PREFERRED_ACTIVITIES.findOne({
            where: {
                name
            }
        })

        if (!findActivity) {
            findActivity = await PREFERRED_ACTIVITIES.create({
                name
            })
        }

        res.status(201).json({
            status: true,
            message: 'Activity Add Successfully.',
            data: findActivity
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.getActivities = async (req, res) => {
    try {

        let { userId } = req.query;
        if (!userId) throw new Error('userId is required');

        const findActivity = await PREFERRED_ACTIVITIES.findAll({
            attributes: [
                'id',
                'name',
                [
                    Sequelize.literal(`(
                        SELECT CASE
                            WHEN EXISTS (
                                SELECT 1
                                FROM selectedActivities AS sa
                                WHERE sa.preferredActivityId = preferredActivities.id
                                AND sa.userId = ${userId}
                            )
                            THEN true ELSE false
                        END
                    )`),
                    'isSelected'
                ]
            ]
        });

        findActivity.forEach(activity => {
            activity.dataValues.isSelected = Boolean(activity.dataValues.isSelected);
        });

        res.status(200).json({
            status: true,
            message: 'Activity Add Successfully.',
            data: findActivity
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.preferredTimeUpdate = async (req, res) => {
    try {

        let { userId, preferredTime } = req.body;

        if (!userId) throw new Error('userId is required');
        if (!preferredTime) throw new Error('preferredTime is required');

        let preferredTimeEnum = ['Week', 'Weekend', 'Both'];
        if (!preferredTimeEnum.includes(preferredTime)) throw new Error('please provide valid preferred time.');

        let user = await USER.findOne({ where: { userId } });
        if (!user) throw new Error('please provide valid userId.');

        user.preferredTime = preferredTime;
        await user.save();

        res.status(202).json({
            status: true,
            message: 'preferredTime update Successfully.',
            data: user
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

let updateMatchUser = async (req, res, userId) => {
    try {

        let findMatchActivity = await SELECTED_ACTIVITIES.findAll({
            where: {
                userId
            }
        })

        const selectedActivitiesIds = findMatchActivity.map(activity => activity.preferredActivityId);

        let findSelectedActivitiesUsers = await SELECTED_ACTIVITIES.findAll({
            where: {
                preferredActivityId: {
                    [Op.in]: selectedActivitiesIds
                }
            },
            attributes: ['userId', 'preferredActivityId',
                [
                    Sequelize.literal(`(
                        SELECT p.name
                        FROM preferredActivities AS p
                        WHERE p.id = selectedActivities.preferredActivityId
                    )`),
                    'name'
                ]
            ]
        })

        let userIdAndPreferredActivityId = findSelectedActivitiesUsers.map(activity => {
            return { userId: activity.userId, preferredActivityId: activity.preferredActivityId, name: activity.dataValues.name }
        })

        let uniqueUserIds = [...new Set(userIdAndPreferredActivityId.map(item => item.userId))];

        let idsArray = [];

        for (const iterator of uniqueUserIds) {

            let activityDetails = userIdAndPreferredActivityId.find(activity => activity.userId == iterator);
            let findMatchUser = await MATCH_USERS.findOne({
                where: {
                    userId: userId,
                    matchedUserId: iterator,
                }
            })

            if (findMatchUser) {

                findMatchUser.activityName = activityDetails.name;
                await findMatchUser.save()
                idsArray.push(findMatchUser.id)

            } else {

                if (iterator != userId) {
                    let newMatchUser = await MATCH_USERS.create({
                        userId,
                        matchedUserId: iterator,
                        activityName: activityDetails.name,
                        isSeen: false
                    });
                    idsArray.push(newMatchUser.id);
                }
            }
        }

        await MATCH_USERS.destroy({
            where: {
                id: {
                    [Op.notIn]: idsArray
                },
                userId: userId
            }
        });

        return uniqueUserIds

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: 'update matches users Error'
        });

    }
}

exports.selectActivity = async (req, res) => {
    try {

        const { userId, activityId } = req.query;

        if (!userId) {
            throw new Error('please provide a userId.')
        } else if (!activityId) {
            throw new Error('please provide a activityId.')
        }

        let user = await USER.findOne({ where: { userId } });
        let preferred_activity = await PREFERRED_ACTIVITIES.findOne({ where: { id: activityId } });

        if (!user) throw new Error('please provide valid userId.')
        if (!preferred_activity) throw new Error('please provide valid activityId.')

        let findSelectedActivity = await SELECTED_ACTIVITIES.findOne({
            where: {
                preferredActivityId: activityId,
                userId
            }
        })

        if (findSelectedActivity) {

            await findSelectedActivity.destroy();

            const allSelectedActivities = await SELECTED_ACTIVITIES.findAll({
                where: {
                    userId,
                },
                attributes: ['id', 'userId',
                    [
                        Sequelize.literal(`(
                         SELECT name FROM preferredActivities As p 
                         WHERE id = selectedActivities.preferredActivityId
                     )`), 'preferredActivityName'
                    ]
                ]
            });

            const userObj = {
                'selectedActivities': allSelectedActivities
            };

            let uniqueUserIds = await updateMatchUser(req, res, userId);
            for (const iterator of uniqueUserIds) {
                if (iterator != userId) {
                    await updateMatchUser(req, res, iterator);
                }
            }

            return res.status(202).json({
                status: true,
                message: "Activity removed from selections successfully",
                data: userObj
            });
        }
        // const currentDate = new Date();
        await SELECTED_ACTIVITIES.create({
            userId,
            preferredActivityId: activityId
        });

        const allSelectedActivities = await SELECTED_ACTIVITIES.findAll({
            where: {
                userId
            },
            attributes: ['id', 'userId',
                [
                    Sequelize.literal(`(
                    SELECT name FROM preferredActivities As p 
                    WHERE id = selectedActivities.preferredActivityId
                )`), 'preferredActivityName'
                ]
            ]
        });

        const obj = {
            allSelectedActivities
        }

        let uniqueUserIds = await updateMatchUser(req, res, userId);
        for (const iterator of uniqueUserIds) {
            if (iterator != userId) {
                await updateMatchUser(req, res, iterator);
            }
        }

        res.status(201).json({
            status: true,
            message: 'Activity added to selections successfully',
            data: obj
        });

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};

exports.getUnseenMatchedUserCount = async (userId) => {
    try {
        
        let matchUsers = await MATCH_USERS.findAll({
            where: {
                userId,
                isSeen: false
            }
        });

        let matchedUserIds = matchUsers.map(match => match.matchedUserId);

        let userQueryConditions = {
            userId: {
                [Op.in]: matchedUserIds,
                [Op.ne]: userId
            }
        };

        let findUser = await USER.findOne({
            where: {
                userId
            }
        });

        if (findUser.preferredTime !== 'Both') {
            userQueryConditions.genderId = findUser.intrestedIn;
            userQueryConditions.preferredTime = findUser.preferredTime;
        }

        let unseenMatchedUsersCount = await USER.count({
            where: userQueryConditions
        });

        return unseenMatchedUsersCount;
    } catch (error) {
        throw new Error('Error counting unseen matched users: ' + error.message);
    }
}


exports.getMatchUsers = async (req, res) => {
    try {

        let { userId } = req.query;

        let findUser = await USER.findOne({
            where: {
                userId
            }
        })

        if (!findUser) throw new Error('please provide valid userId')

        let matchUsers = await MATCH_USERS.findAll({
            where: {
                userId
            }
        })

        let matchedUserIds = matchUsers.map(match => match.matchedUserId);

        let userQueryConditions = {
            userId: {
                [Op.in]: matchedUserIds,
                [Op.ne]: userId
            },
            genderId : findUser.intrestedIn
        };

        if (findUser.preferredTime !== 'Both') {
            userQueryConditions.preferredTime = findUser.preferredTime;
        }

        let matchedUsersData = await USER.findAll({
            where: userQueryConditions,
            attributes: ['userId', "username", 'name', 'profileImage', 'aboutMe', 'preferredTime', 'genderId']
        });

        let response = matchedUsersData.map(user => {
            let match = matchUsers.find(match => match.matchedUserId === user.userId);
            return {
                ...user.dataValues,
                activityName: match.activityName,
                isSeen: Boolean(match.isSeen)
            };
        });

        await MATCH_USERS.update(
            { isSeen: true },
            { where: { userId, isSeen: false } }
        );

        res.status(200).json({
            status: true,
            message: 'Match users retrieved successfully.',
            data: response
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.getSelectedActivities = async (req, res) => {
    try {

        let { userId } = req.query;

        if (!userId) throw new Error('userId is required.');

        const allSelectedActivities = await SELECTED_ACTIVITIES.findAll({
            where: {
                userId,
            },
            attributes: ['id', 'userId',
                [
                    Sequelize.literal(`(
                     SELECT name FROM preferredActivities As p 
                     WHERE id = selectedActivities.preferredActivityId
                 )`), 'preferredActivityName'
                ]
            ]
        });

        res.status(200).json({
            status: true,
            message: 'selected Activities get Successfully.',
            data: allSelectedActivities
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}

exports.getActivities = async (req, res) => {
    try {

        let { userId } = req.query;
        if (!userId) throw new Error('userId is required');

        const findActivity = await PREFERRED_ACTIVITIES.findAll({
            attributes: [
                'id',
                'name',
                [
                    Sequelize.literal(`(
                        SELECT CASE
                            WHEN EXISTS (
                                SELECT 1
                                FROM selectedActivities AS sa
                                WHERE sa.preferredActivityId = preferredActivities.id
                                AND sa.userId = ${userId}
                            )
                            THEN true ELSE false
                        END
                    )`),
                    'isSelected'
                ]
            ]
        });

        findActivity.forEach(activity => {
            activity.dataValues.isSelected = Boolean(activity.dataValues.isSelected);
        });

        res.status(200).json({
            status: true,
            message: 'Activity Add Successfully.',
            data: findActivity
        });

    } catch (error) {

        res.status(400).json({
            status: 400,
            message: error.message
        });

    }
}
