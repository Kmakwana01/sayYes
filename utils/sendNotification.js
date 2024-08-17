const USER = require("../models/user");
const admin = require("firebase-admin");
const serviceAccount = require("../sayyes-f2ae4-firebase-adminsdk-z62zb-0d5a1d75a9.json");
const { getMessaging } = require("firebase-admin/messaging");
const { Op } = require("sequelize");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sayyes-f2ae4'
});

exports.sendToAll = async (title, body, userId) => {
  try {

    console.log(title, body, userId)

    const users = await USER.findAll({
      where: {
        userId: {
          [Op.ne]: userId
        }
      },
      attributes: ['device_token', "userId"]
    });

    const tokens = users
      .map(user => user?.device_token) // Extract device tokens
      .filter(token => token != null);

    console.log('tokens', tokens)

    const message = {
      data: {
        title: title,
        body: body,
      },
      notification: {
        title: title,
        body: body
      },
      tokens: tokens
    };

    let response = await admin.messaging().sendEachForMulticast(message);
    console.log(response)
    return response

  } catch (error) {

    console.log('notification sending error.', error);
    return

  }
}

exports.sendToSingleUser = async (message) => {
  try {

    console.log(message)

    const response = await getMessaging().send(message)
    return response;

  } catch (error) {
    console.log('notification sending error.', error);
    return
  }
}

