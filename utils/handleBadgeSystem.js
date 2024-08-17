const USER = require('../models/user')

exports.handleEarningPointsAndBadges = async (userId, type = 'default') => {

    const typeCheckArray = ['postLike','Video', 'image', 'reel', 'invite', 'sayYes','register','default']

    if (!typeCheckArray.includes(type)) return

    let pointsEarned;

    switch (type) {
        case 'postLike':
            pointsEarned = 50;
            break;
        case 'image':
            pointsEarned = 50;
            break;
        case 'Video':
            pointsEarned = 100;
            break;
        case 'reel':
            pointsEarned = 150;
            break;
        case 'invite':
            pointsEarned = 250;
            break;
        case 'sayYes':
            pointsEarned = 1000;
            break;
        case 'register':
            const registeredUserCount = await USER.count();
            console.log(registeredUserCount,"registeredUserCount")
            pointsEarned = (registeredUserCount <= 2000) ? 15000 : 0;
            break;
        case 'default':
            pointsEarned = 0;
    }

    try {


        const existingUser = await USER.findOne({ where: { userId } });
        // console.log(`old Points for ${existingUser.userId}`, existingUser.badge_points, existingUser.userId,pointsEarned)
        console.log(existingUser)

        existingUser.badge_points = existingUser?.badge_points !== null ? parseInt(existingUser?.badge_points) + parseInt(pointsEarned) : pointsEarned;

        console.log('first',existingUser)

        await existingUser.save();

        const updatedPoints = existingUser?.badge_points;

        console.log(`updated Points for ${existingUser.userId}`, updatedPoints, existingUser.userId)

        let newLevel;

        if (updatedPoints >= 5000) {
            newLevel = 'platinum';
        } else if (updatedPoints >= 3000) {
            newLevel = 'gold';
        } else if (updatedPoints >= 1500) {
            newLevel = 'bronze';
        } else {
            newLevel = 'silver';
        }

        if (newLevel && newLevel !== existingUser?.level) {
            await existingUser.update({ level: newLevel });
        }
        return existingUser;

    } catch (error) {
        throw Error('points and level change error.')
    }

};

