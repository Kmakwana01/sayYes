const User = require("../models/user");
const UserRequest = require("../models/userRequest");
const UserActivity = require("../models/userActivity");
const jwt = require('jsonwebtoken');
const sequelize = require("../database/database");
const moment = require("moment");
const { messages, main } = require("../utils/constants");
const _response = require("../utils/response");
const LiveActivity = require("../models/liveActivity");
const LiveActivityImage = require("../models/liveActivityImage");
const ConfirmActivities = require("../models/Confirmactivities");
const Room = require("../models/room");
const chat = require("../models/chat");
const { array } = require("../utils/fileUploader");
var FCM = require("fcm-node");
const Op = require("sequelize").Op;
const Notification = require("../models/notification_list");
const Blockuser = require("../models/block_user");
const Flage = require("../models/Flage");
const Activity = require("../models/activity");
const Likeliveactivitise = require("../models/Likeliveactivitise");
const UserImage = require("../models/userImage");
const USER_LIKE = require("../models/userLikes");
const USER = require("../models/user");
const LIKE_ACTIVITY = require('../models/likeActivity')
const ADVERTISE_MENT = require('../models/Advertisement')
const _constants = require('../utils/constants');
const { handleEarningPointsAndBadges } = require("../utils/handleBadgeSystem");
// const main_socket = require ("../controller/mainSocket");
// const main_socket = require("../server");
const tokenSecret = process.env.jwtKey;
var activitySocket;
const CHAT_REACTION = require('../models/chatReaction')
const INTERESTED = require('../models/interested');
const MATCH_USERS = require('../models/matchUsers')
const { sendToSingleUser } = require("../utils/sendNotification");
const { getUnseenMatchedUserCount } = require("./preferredActivityController");

const getAllUsers = async (req, res, next) => {
  try {
    const body = req.body;
    console.log("body", body);
    const users = await sequelize.query(
      `call sp_get_available_users(${body.intrestedIn},${body.availableForPick})`
    );

    var user_list = [];
    console.log(body.user_blocked_by);
    for (var i = 0; i < users.length; i++) {
      var exist = await Blockuser.findOne({
        where: {
          user_blocked_by: body.user_blocked_by,
          blocked_user_id: users[i].userId,
        },
      });

      if (exist == null) {
        if (users[i].userId != body.user_blocked_by) {
          user_list.push(users[i]);
        }
      }
    }
    return res.send(_response.getSuccessResponse(messages.success, user_list));
  } catch (e) {
    console.log(e);
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};
//----------------------------------------------------------------
const getUsers = async (req, res) => {
  try {

    let { usersCacheArray, videosCacheArray, activitiesCacheArray, advertiseCacheArray, limit } = req.body;

    let advertiseLimit = Math.floor(limit / 5)
    let activitiesLimit = Math.floor(limit / 3)
    let authorization = req.headers.authorization;
    let token = authorization.split(' ')[1];
    let userDetail = jwt.decode(token, tokenSecret);

    let findCurrentUser = await User.findOne({
      where: {
        userId: userDetail?.userId,
      }
    })

    // console.log('Decoded Token:', userDetail);
    // console.log('User ID:', userDetail.userId);

    if (!req.body.availableForPick) {
      throw new Error("availableForPick is required");
    } else if (!req.body.user_blocked_by) {
      throw new Error("user_blocked_by is required");
    }


    var users = await User.findAll({
      where: {
        availableForPick: req.body.availableForPick,
        // email: { [Op.not]: ["admin@sayyesadmin.com"] },
        name: {
          [Op.not]: ["admin", ""] // Exclude users with name "admin" or an empty string
        },
        username: {
          [Op.ne]: `${_constants.main.adminName}`,
        },
        userId: {
          [Op.and]: [
            { [Op.ne]: req.body.user_blocked_by },
            { [Op.notIn]: usersCacheArray }, // Exclude users with IDs in usersCacheArray
            { [Op.ne]: findCurrentUser.userId }
          ]
        }
      },
      limit,
      order: sequelize.literal('RAND()')
    });

    var user_list = [];
    let count = 0;

    let allAdvertiseData = await ADVERTISE_MENT.findAll({
      where: {
        id: {
          [Op.notIn]: advertiseCacheArray
        },
      },
      limit: advertiseLimit > 0 ? advertiseLimit : 10,
      order: sequelize.literal('RAND()')
    })

    let allAdvertiseMent = JSON.parse(JSON.stringify(allAdvertiseData))

    let whereCondition = {
      date: {
        [Op.gt]: new Date()
      }
    }
    if (findCurrentUser?.city) {
      whereCondition.city = findCurrentUser?.city;
    }
    if (findCurrentUser?.country) {
      whereCondition.country = findCurrentUser?.country;
    }
    if (findCurrentUser?.userId) {
      whereCondition.userId = findCurrentUser?.userId;
    }

    const latestUserActivities = await LiveActivity.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
      limit: 2
    });

    const latestUserActivityIds = latestUserActivities.map(activity => activity.id);

    let activityWhereCondition = {
      id: {
        [Op.notIn]: [...activitiesCacheArray, ...latestUserActivityIds]
      },
      date: {
        [Op.gt]: new Date()
      }
    }

    if (findCurrentUser.city) {
      activityWhereCondition.city = findCurrentUser.city;
    }
    if (findCurrentUser.country) {
      activityWhereCondition.country = findCurrentUser.country;
    }

    const otherActivities = await LiveActivity.findAll({
      where: activityWhereCondition,
      order: sequelize.literal('RAND()'),
      limit: activitiesLimit - 2 > 0 ? activitiesLimit - 2 : 10  // Adjust the limit to account for the two latest activities
    });

    const activities = [...latestUserActivities, ...otherActivities];

    let data_with_details = [];

    for (var i = 0; i < activities?.length; i++) {

      var total_like = await Likeliveactivitise.findAll({
        where: {
          live_activitise_id: activities[i].id,
          status: 0,
        },
      });

      var image = await LiveActivityImage.findAll({
        attributes: ["image"],
        where: {
          activityId: activities[i].id,
        },
      });

      var total_like_like = 0;
      if (total_like != null) {
        total_like_like = total_like.length;
      }

      var exist = await Likeliveactivitise.findOne({
        where: {
          user_id: findCurrentUser.userId,
          live_activitise_id: activities[i].id,
          status: 0,
        },
      });

      var status = 0;
      if (exist != null) {
        status = 1;
      }

      var userFind = await User.findOne({
        where: {
          userId: activities[i].userId,
        }
      })

      var userName = null;
      if (userFind != null) {
        // Check if the "userName" is an object
        if (userFind.username != null) {
          userName = userFind.username;
        } else {
          // Handle the case when "userName" is an object
          userName = userFind.username || null;
        }
      }
      console.log("userName", userName);
      var act = activities[i];
      act.total_like_count = total_like_like;
      act.status = status;
      act.image = image;

      data_with_details.push({
        userId: activities[i].userId.toString() || null,
        address: act.address || null,
        id: act.id.toString() || null,
        delete_notification_status: act.delete_notification_status,
        userName: userName || null,
        description: act.description || null,
        status: act.status || null,
        activityName: act.activityName || null,
        total_like_count: act.total_like_count.toString() || null,
        zipcode: act.zipcode || null,
        userProfileImage: userFind?.profileImage || null,
        date: act.date || null,
        createdAt: act.createdAt || null,
        favouriteActivity: act.favouriteActivity || null,
        image: act.image || null,
      });
    }

    let activities_data = data_with_details;
    let activities_data_count = 0;


    for (var i = 0; i < users.length; i++) {

      var exist = await Blockuser.findOne({
        where: {
          user_blocked_by: req.body.user_blocked_by,
          blocked_user_id: users[i].userId,
        },
      });

      const find = await USER_LIKE.findAll({
        where: {
          userId: users[i].userId,
          // likedBy: likedBy,
        },
      });

      var fileImages = await UserImage.findAll({
        where: { userId: users[i].userId, type: { [Op.in]: ['image'] }, }
        , order: [['createdAt', 'DESC']]
      })

      var fileVideos = await UserImage.findOne({
        where: {
          id: {
            [Op.notIn]: videosCacheArray ? videosCacheArray : []
          },
          userId: users[i].userId,
          type: {
            [Op.in]: ['Video']
          },
        },
        order: sequelize.literal('RAND()')
      })

      let findInterest = await INTERESTED.findOne({
        where: {
          interestedByProfileId: userDetail.userId,
          interestedToProfileId: users[i].userId
        }
      })

      const interestedCount = await INTERESTED.count({
        where: {
          interestedToProfileId: users[i].userId
        }
      })

      console.log(JSON.parse(JSON.stringify(findInterest)), 'findInterest')

      var alreadyLiked = find.some(
        (like) =>
          like.likedBy.toString() === req.body.user_blocked_by.toString()
      );

      // console.log(
      //   "user_blocked_by:::::::::::::::::::::::::::::::::::::::::::::::::::::::::",
      //   req.body.user_blocked_by
      // );
      // console.log(
      //   "alreadyLiked::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ",
      //   alreadyLiked
      // );
      // var alreadyLiked = find.filter(like => like.likedBy == req.body.user_blocked_by)
      if (exist == null) {
        if (users[i].userId != req.body.user_blocked_by) {
          // Include likes information as a property within the user object
          if (i % 5 === 0 && allAdvertiseMent[count] && i != 0) {

            const userObj = {

              user: {
                ...users[i].dataValues,
                likes: find.length,
                alreadyLiked: alreadyLiked,
                isInterested: findInterest ? true : false,
                interestedCount,
                images: fileImages,
                video: fileVideos
              },
              advertiseMent: allAdvertiseMent[count],
              activities_data: null
            };

            user_list.push(userObj);
            count++;

          } else if (i % 3 === 0 && activities_data[activities_data_count] && i != 0) {

            const userObj = {

              user: {
                ...users[i].dataValues,
                likes: find.length,
                alreadyLiked: alreadyLiked,
                isInterested: findInterest ? true : false,
                interestedCount,
                images: fileImages,
                video: fileVideos
              },
              advertiseMent: null,
              activities_data: activities_data[activities_data_count]
            };
            user_list.push(userObj);
            activities_data_count++;
            console.log('enter Activity', activities_data_count, i)

          } else {

            const userObj = {

              user: {
                ...users[i].dataValues,
                likes: find.length,
                alreadyLiked: alreadyLiked,
                isInterested: findInterest ? true : false,
                interestedCount,
                images: fileImages,
                video: fileVideos
              },

              advertiseMent: null,
              activities_data: null
            };

            user_list.push(userObj);
          }
        }
      }
    }

    let unseenInterestedCount = await INTERESTED.count({
      where: {
        interestedToProfileId: userDetail.userId,
        isSeen : 0
      },
    })

    let unseenMatchCount = await getUnseenMatchedUserCount(userDetail.userId)

    res.status(200).json({
      status: true,
      messages: "get users successfully.",
      unseenInterestedCount : unseenInterestedCount,
      unseenMatchCount : unseenMatchCount,
      data: user_list,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      messages: error.message,
    });
  }
};

//----------------------------------------------------------------
const sendFriendRequestToUser = async (req, res, next) => {
  try {
    const body = req.body;
    // const existingRequest = await UserRequest.findOne({
    //   where: {
    //     sentBy: body.sentBy,
    //     sentTo: body.sentTo,
    //   },
    // });
    // if (existingRequest != null) {
    //   if (existingRequest.clientResponse == false)
    //     await UserRequest.destroy({
    //       where: {
    //         sentBy: body.sentBy,
    //         sentTo: body.sentTo,
    //       },
    //     });
    //   else
    //     return res.send(
    //       _response.getFailResponse(messages.requestAlreadyThere, null)
    //     );
    // }
    // if (body.sentBy != body.sentTo) {

    if (body?.sentTo === body?.sentBy) {
      throw new Error("Cannot send friend request to yourself.");
    }

    // const isFriendRequest = await UserRequest.findOne({
    //   where: {
    //     sentBy: body.sentBy,
    //     sentTo: body.sentTo,
    //     isAccepted: false
    //   }
    // })

    var user_data = await User.findOne({
      where: {
        userId: body.sentTo,
      },
    });
    // console.log("user data: %j", user_data.dataValues.profileImage);
    console.log(body.sentToNAME, "body.sentToNAME"); // Birbal 😎 body.sentToNAME
    const request = await UserRequest.build({
      sentBy: body.sentBy,
      sentTo: body.sentTo,
      date: moment.utc(),
      sentToNAME: body.sentToNAME,
      sentBYNAME: body.sentBYNAME,
      activity_name: body.activity_name,
      activity_address: body.activity_address,
      activity_image: body.activity_image,
      sentToimage: user_data.dataValues.profileImage,
      clientResponse: 0,
      createdAt: moment.utc(),
      isAccepted: false
    });
    await request.save();
    console.log(request, "*****************", request)
    var savenotification = await Notification.build({
      message: `you have receive a request from ${body.sentBYNAME}`,
      user_id: body.sentTo,
      isRead: false,
      type: "request",
      created_at: moment.utc(),
    });
    await savenotification.save();
    var receiver = await User.findOne({
      where: {
        userId: req.body.sentTo,
      },
    });

    // const serverKey =
    //   // UPDATE UPDATE UPDATE
    //   // 'AAAAFTN1ifI:APA91bEdVo8JxbG2_bNDIJWor8VAdaiNfXVAOqMECt2K9SCEIK2ySvUiWGL60FeQX5s27XEfoRcVyXOjq_vHOTibJlk_X14MwAqr47SqUXD9xMlLGassGbGJsr7T6htL-_fQmaJyczya';
    //   "AAAAU2XdtVU:APA91bHeWPRUyqjgrjnSDgqNM5AcJ-_k3XvrT3xhPpAoqvyTcoKnaKP7BMUQs6SzhYwTtnvODMGiLZPKMTQlwrPgi4LS5TSownpgOjfRUKD6-RvEs-iMQYCIgnz3LAi9EAchmqan-zND";
    // //----------------------------------------------------------------
    // var fcm = new FCM(serverKey);

    // var  apns= {
    //   headers: {
    //       apns-priority: 10
    //   },
    //   payload: {
    //       aps: {
    //           badge: 1
    //       }
    //   }
    // };

    if (receiver?.device_token && body.sentBYNAME) {

      let message = {
        data: {
          title: "Notification",
          body: `you receive a new request form ${body.sentBYNAME}`,
        },
        notification: {
          title: "Notification",
          body: `you receive a new request form ${body.sentBYNAME}`,
        },
        token: receiver.device_token,
      };
      await sendToSingleUser(message)

    }

    var existingUser = await handleEarningPointsAndBadges(body.sentBy, 'invite')

    let obj = {
      badge_points: existingUser?.badge_points
    }
    return res.send(_response.getSuccessResponse(messages.requestSent, obj));
    // } else {
    //   return res.send([
    //    'message'="Sender id and receiver id same",
    //    'success' = false,
    //     'status'  =  400
    //   ]);
    // }
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const getUserFriendRequests = async (req, res, next) => {
  try {

    var requests = await sequelize.query(
      `call sp_get_user_requests(${req.params.userId})`
    );

    requests.forEach((request) => {
      if (!request.isAccepted) {
        request.isAccepted = false;
      } else {
        request.isAccepted = Boolean(request.isAccepted);
      }
      console.log(request.clientResponse)
      if (!request.clientResponse)
        request.clientResponse = Boolean(request.clientResponse);
    });

    return res.send(_response.getSuccessResponse(messages.success, requests));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const getMyOfferedFriendRequests = async (req, res, next) => {
  try {

    var requests = await sequelize.query(
      `call sp_get_my_offered_friend_requests(${req.params.userId})`
    );

    requests.forEach((request) => {
      // console.log('client response',request.clientResponse)
      if (!request.isAccepted) {
        request.isAccepted = false;
      } else {
        request.isAccepted = Boolean(request.isAccepted);
      }
      if (!request.clientResponse) {
        request.clientResponse = request.clientResponse;
      }
    });

    // let requestArray = requests.filter( request => !request.isAccepted && !request.clientResponse)
    // console.log(requestArray,'requestArray')
    return res.send(_response.getSuccessResponse(messages.success, requests));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const responseFriendRequest = async (req, res, next) => {
  try {
    const body = req.body;
    console.log("req body:", body);

    var userRequest = await UserRequest.update(
      {
        clientResponse: 1,
        isAccepted: body.isAccepted,
      },
      {
        where: { id: body.id },
      }
    );

    var request = await UserRequest.findOne({
      where: { id: body.id },
    });

    // console.log('updated request:', JSON.parse(JSON.stringify(request)));

    var receiver = await User.findOne({
      where: {
        userId: request.sentTo,
      },
    });
    // console.log("receiver================================", receiver);

    var sender = await User.findOne({
      where: {
        userId: request.sentBy,
      },
    });

    if (body.isAccepted === "true" || body.isAccepted === true || request?.isAccepted === true) { // Fix: Use === for strict equality check
      console.log("IS ACCEPTED");

      if (receiver.userId) {
        console.log(receiver.userId, 'receiver userId');
        var exitingUser = await handleEarningPointsAndBadges(receiver.userId, 'sayYes')
      }

      var savenotification = await Notification.build({
        message: `${receiver.name}  accepted your request`,
        user_id: sender.userId,
        isRead: false,
        type: "requestAccepted",
        created_at: moment.utc(),
      });
      await savenotification.save();

      // var serverKey =
      //   // Update the FCM server key as needed
      //   "AAAAU2XdtVU:APA91bHeWPRUyqjgrjnSDgqNM5AcJ-_k3XvrT3xhPpAoqvyTcoKnaKP7BMUQs6SzhYwTtnvODMGiLZPKMTQlwrPgi4LS5TSownpgOjfRUKD6-RvEs-iMQYCIgnz3LAi9EAchmqan-zND";

      // var fcm = new FCM(serverKey);

      if (sender.device_token && receiver.name) {
        let message = {
          data: {
            title: "Notification",
            body: `${receiver.name}  accepted your request`,
          },
          notification: {
            title: "Notification",
            body: `${receiver.name}  accepted your request`,
          },
          token: sender.device_token,
        };
        await sendToSingleUser(message)
      }
      // console.log("message received", message);

      // fcm.send(message, function (err, response) {
      //   if (err) {
      //     console.log("Error sending FCM message:", err);
      //     console.log("Response:", response);
      //   } else {
      //     console.log("FCM message sent successfully");
      //   }
      //   // console.log("FCM Response:", response);
      // });

    } else if (body.isAccepted === "false" || body.isAccepted === false || request?.isAccepted === false) { // Fix: Use === for strict equality check
      console.log("IS DECLINED");

      var savenotification = await Notification.build({
        message: `${sender.name}  declined your request `,
        user_id: receiver.userId,
        isRead: false,
        type: "requestDeclined",
        created_at: moment.utc(),
      });
      await savenotification.save();

      // var serverKey =
      //   // Update the FCM server key as needed
      //   "AAAAU2XdtVU:APA91bHeWPRUyqjgrjnSDgqNM5AcJ-_k3XvrT3xhPpAoqvyTcoKnaKP7BMUQs6SzhYwTtnvODMGiLZPKMTQlwrPgi4LS5TSownpgOjfRUKD6-RvEs-iMQYCIgnz3LAi9EAchmqan-zND";

      // var fcm = new FCM(serverKey);

      let message = {
        data: {
          title: "Notification",
          body: `${receiver.name}  declined your request`,
        },
        notification: {
          title: "Notification",
          body: `${receiver.name}  declined your request`,
        },
        token: sender.device_token,
      };

      await sendToSingleUser(message)

    }

    let obj = {
      badge_points: exitingUser?.badge_points
    }
    console.log("OUT");
    return res.send(_response.getSuccessResponse(messages.accepted, obj));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const responseconfirm = async (req, res, next) => {
  try {
    const body = req.body;

    // var request = await UserRequest.findOne({
    //     id:body.id,
    // });
    console.log("Date: " + body.confirmdate);
    var data_update = await UserRequest.update(
      {
        // clientResponse: body.isAccepted,
        confirm: body.isAccepted,
        date: new Date(body.confirmdate),
      },
      {
        where: { id: body.id },
      }
    );
    const data = await ConfirmActivities.build({
      SendTo: body.sendto,
      SendBY: body.sendby,
      Date: new Date(body.confirmdate),
    });
    await data.save();
    // if(request == null) return res.send(_response.getFailResponse(messages.notFound,null,400));

    // request.clientResponse = body.isAccepted;
    // request.isAccepted = body.isAccepted;

    // await request.save();

    var receiver = await User.findOne({
      where: {
        userId: body.sendto,
      },
    });

    var sender = await User.findOne({
      where: {
        userId: body.sendby,
      },
    });

    var savenotification = await Notification.build({
      message: `${receiver.name}  confirm the date at ${body.confirmdate}`,
      user_id: sender.userId,
      isRead: false,
      type: "confirm",
      created_at: moment.utc(),
    });

    await savenotification.save();
    // const serverKey =
    //   // UPDATE UPDATE UPDATE
    //   // 'AAAAFTN1ifI:APA91bEdVo8JxbG2_bNDIJWor8VAdaiNfXVAOqMECt2K9SCEIK2ySvUiWGL60FeQX5s27XEfoRcVyXOjq_vHOTibJlk_X14MwAqr47SqUXD9xMlLGassGbGJsr7T6htL-_fQmaJyczya';
    //   "AAAAU2XdtVU:APA91bHeWPRUyqjgrjnSDgqNM5AcJ-_k3XvrT3xhPpAoqvyTcoKnaKP7BMUQs6SzhYwTtnvODMGiLZPKMTQlwrPgi4LS5TSownpgOjfRUKD6-RvEs-iMQYCIgnz3LAi9EAchmqan-zND";
    // //----------------------------------------------------------------
    // var fcm = new FCM(serverKey);

    if (sender.device_token && body.confirmdate) {
      let message = {
        data: {
          title: "Notification",
          body: `${receiver.name}  confirm the date at ${body.confirmdate}`,

        },
        notification: {
          title: "Notification",
          body: `${receiver.name}  confirm the date at ${body.confirmdate}`,

        },
        token: sender.device_token,
      };
      console.log("message received", message);
      await sendToSingleUser(message)
    }

    if (data_update) {
      return res.send(_response.getSuccessResponse(messages.accepted, null));
    } else {
      return res.send(_response.getFailResponse(e.message, null, 400));
    }
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const getMyFriends = async (req, res, next) => {
  try {
    const friends = await sequelize.query(
      `call sp_get_my_friends(${req.params.userId})`
    );

    var user_list = [];
    for (var i = 0; i < friends.length; i++) {
      var exist = await Blockuser.findOne({
        where: {
          user_blocked_by: req.params.userId,
          blocked_user_id: friends[i].userId,
        },
      });

      if (exist == null) {
        user_list.push(friends[i]);
      }
    }

    return res.send(_response.getSuccessResponse(messages.success, user_list));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null));
  }
};

const registerLiveActivity = async (req, res, next) => {
  try {
    console.log(req.body, typeof req.body.date, 'datetime'); //2024-05-09T6:31:00.000+0530
    const body = req.body;
    console.log(body);

    var time = moment.utc();

    var activities = await LiveActivity.findOne({
      where: { userId: body.userId },
      order: [["id", "DESC"]],
    });

    let convertTime = moment(req.body.date, 'YYYY-MM-DDTHH:mm:ssZ').format("YYYY-MM-DD HH:mm:ss");

    console.log(convertTime)
    console.log("activities" + activities);
    if (activities && activities.dataValues.createdAt >= time) {
      console.log("2 Error");
      return res.json({
        success: false,
        status: 400,
        message:
          "you can not create the new activity within 24 hours. Please try after 24 hours",
      });
    } else {
      console.log("3");
      const la = await LiveActivity.build({
        activityName: body.activityName,
        description: body.description,
        address: body.address,
        city: body.city,
        country: body.country,
        date: convertTime,
        userId: body.userId,
        createdAt:/* moment.utc().add(24, "hours")*/  Date.now(),
      });
      console.log("LA" + la);
      await la.save();
      req.files.forEach(async (file) => {
        console.log("FilesFiles: %j", file);
        await LiveActivityImage.build({
          activityId: la.id,
          image: `${main.filePath}${file.filename}`,
        }).save();
      });
      console.log("4" + la);
      return res.send(_response.getSuccessResponse(messages.success, null));
    }
  } catch (e) {
    //console.log("5" + la)
    return res.send(_response.getFailResponse(e.message, null));
  }
};

// const getLiveActvities = async (req, res, next) => {
//   try {
//     // console.log('FSDsdffd');

//     const time = moment.utc();

//     console.log(time.format("YYYY-MM-DD"));

//     // const activities = await sequelize.query(
//     //   `call sp_get_live_activities('${time.format("YYYY-MM-DD")}',
//     //   '${req.query.city}',  
//     //   '${req.query.country}')`
//     // );
//     const activities = await LiveActivity.findAll({
//       date: time.format("YYYY-MM-DD"),
//       city: req.query.city,
//       country: req.query.country,
//     });
//     console.log("activities", activities.length);
//     var data_like = [];

//     for (var i = 0; i < activities.length; i++) {
//       var total_like = await Likeliveactivitise.findAll({
//         where: {
//           live_activitise_id: activities[i].id,
//           status: 0,
//         },
//       });

//       var image = await LiveActivityImage.findAll({
//         attributes: ["image"],
//         where: {
//           activityId: activities[i].id,
//         },
//       });
//       // console.log("image============================================================",image);
//       var total_like_like = 0;
//       if (total_like != null) {
//         var total_like_like = total_like.length;
//       }

//       var exist = await Likeliveactivitise.findOne({
//         where: {
//           user_id: req.query.user_id,
//           live_activitise_id: activities[i].id,
//           status: 0,
//         },
//       });
//       var status = 0;
//       if (exist != null) {
//         var status = 1;
//       }

//       var act = activities[i];
//       act.total_like_count = total_like_like;
//       act.status = status;
//       act.image = image;
// console.log("act:::::::::::::::::::::::::::::: " , act.status);
//       data_like.push(act);
//     }
//     console.log("data_like",data_like);
//     var activities_data = data_like;
//     return res.send(
//       _response.getSuccessResponse(messages.success, activities_data)
//     );
//   } catch (e) {
//     return res.send(_response.getFailResponse(e.message, null));
//   }
// };


const getLiveActvities = async (req, res, next) => {
  try {
    // console.log('FSDsdffd');

    const time = moment.utc();
    console.log(time.format("YYYY-MM-DD"));

    // const activities = await sequelize.query(
    //   `call sp_get_live_activities('${time.format("YYYY-MM-DD")}',
    //   '${req.query.city}',  
    //   '${req.query.country}')`
    // );

    let activities = await LiveActivity.findAll({
      where: {
        city: req.query.city,
        country: req.query.country,
        date: {
          [Op.gt]: new Date()
        }
      },
    })

    // var data_like = [];
    var data_with_details = [];

    for (var i = 0; i < activities.length; i++) {

      var total_like = await Likeliveactivitise.findAll({
        where: {
          live_activitise_id: activities[i].id,
          status: 0,
        },
      });

      console.log(JSON.parse(JSON.stringify(total_like)), "total_like")

      var image = await LiveActivityImage.findAll({
        attributes: ["image"],
        where: {
          activityId: activities[i].id,
        },
      });

      var total_like_like = 0;
      if (total_like != null) {
        total_like_like = total_like.length;
      }
      console.log({
        userId: req.query.user_id,
        activityId: activities[i].id,
        status: 0,
      })

      var exist = await Likeliveactivitise.findOne({
        where: {
          user_id: req.query.user_id,
          live_activitise_id: activities[i].id,
          status: 0,
        },
      });

      var status = 0;
      if (exist != null) {
        status = 1;
      }

      var userFind = await User.findOne({
        where: {
          userId: activities[i].userId,
        }
      })
      // console.log("users ", userFind);
      var userName = null;
      if (userFind != null) {
        // Check if the "userName" is an object
        if (userFind.username != null) {
          userName = userFind.username;
        } else {
          // Handle the case when "userName" is an object
          userName = userFind.username || null;
        }
      }
      console.log("userName", userName);
      var act = activities[i];
      act.total_like_count = total_like_like;
      act.status = status;
      act.image = image;

      data_with_details.push({
        userId: activities[i].userId.toString() || null,
        address: act.address || null,
        id: act.id.toString() || null,
        delete_notification_status: act.delete_notification_status,
        userName: userName || null,
        description: act.description || null,
        status: act.status || null,
        activityName: act.activityName || null,
        total_like_count: act.total_like_count.toString() || null,
        zipcode: act.zipcode || null,
        userProfileImage: userFind?.profileImage || null,
        date: act.date || null,
        createdAt: act.createdAt || null,
        favouriteActivity: act.favouriteActivity || null,
        image: act.image || null,
      });
    }
    var activities_data = data_with_details;
    return res.send(
      _response.getSuccessResponse(messages.success, activities_data)
    );
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null));
  }
};

const sendActivityRequest = async (req, res, next) => {
  try {
    const body = req.body;
    const request = await UserActivity.build({
      sentBy: body.sentBy,
      sentTo: body.sentTo,
      latitude: body.latitude,
      longitude: body.longitude,
      address: body.address,
      activityId: body.activityId,
      activityTime: body.activityTime,
      createdAt: moment.utc(),
    });
    await request.save();
    return res.send(_response.getSuccessResponse(messages.requestSent, null));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const getUserActivityRequests = async (req, res, next) => {
  try {
    var requests = await sequelize.query(
      `call sp_get_user_activity_requests(${req.params.userId})`
    );
    requests.forEach((request) => {
      if (!request.isAccepted) {
        request.isAccepted = false;
      } else {
        request.isAccepted = Boolean(request.isAccepted);
      }
      if (!request.clientResponse)
        request.clientResponse = Boolean(request.clientResponse);
    });

    let requestArray = requests.filter(request => !request.isAccepted && !request.clientResponse)

    return res.send(_response.getSuccessResponse(messages.success, requestArray));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const getMyOfferedActivityRequests = async (req, res, next) => {
  try {
    var requests = await sequelize.query(
      `call sp_get_my_offered_activity_requests(${req.params.userId})`
    );
    requests.forEach((request) => {
      if (!request.isAccepted) {
        request.isAccepted = false;
      } else {
        request.isAccepted = Boolean(request.isAccepted);
      }
      if (!request.clientResponse)
        request.clientResponse = Boolean(request.clientResponse);
    });
    return res.send(_response.getSuccessResponse(messages.success, requests));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const responseActivityRequest = async (req, res, next) => {
  try {
    const body = req.body;
    await UserActivity.update(
      {
        isAccepted: body.isAccepted,
        clientResponse: body.isAccepted,
      },
      {
        where: { id: body.id },
      }
    );

    return res.send(_response.getSuccessResponse(messages.accepted, null));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const getMyActivities = async (req, res, next) => {
  try {
    var requests = await sequelize.query(
      `call sp_get_my_activities(${req.params.userId})`
    );
    requests.forEach((request) => {
      if (!request.isAccepted) {
        request.isAccepted = false;
      } else {
        request.isAccepted = Boolean(request.isAccepted);
      }
      if (!request.clientResponse)
        request.clientResponse = Boolean(request.clientResponse);
    });
    return res.send(_response.getSuccessResponse(messages.success, requests));
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const creatchat = async (req, res, next) => {
  try {
    // console.log('file11', `${_constants.main.filePathWithAudio}${req.file.originalname}`)
    // console.log("req.file", req.file, req.body);
    var exists = await Room.findOne({
      where: {
        sender_id: req.body.sender_id,
        receiver_id: req.body.receiver_id,
      },
    });

    let filePath, type, thumbnailPath;

    // console.log(req.files,"req.file")
    let file = req.files.filter(file => file.fieldname === 'file')[0];
    let thumbnail = req.files.filter(file => file.fieldname === 'thumbnail')[0];

    if (thumbnail) {
      thumbnailPath = `${_constants.main.filePath}${thumbnail?.filename}`;
    }

    if (file.mimetype.startsWith('audio/')) {
      filePath = `${_constants.main.filePathWithAudio}${file.filename}`;
      type = 'audio';
    } else if (file.mimetype.startsWith('video/')) {
      filePath = `${_constants.main.filePath}${file.filename}`;
      type = 'video';
    } else if (file.mimetype.startsWith('image/')) {
      filePath = `${_constants.main.filePath}${file.filename}`;
      type = 'image';
    } else {
      filePath = `${_constants.main.filePath}${file.filename}`;
      type = null;
    }

    console.log(filePath)
    if (exists != null) {
      if (exists.id == null) {
        var creat_room = await Room.build({
          sender_id: req.body.sender_id,
          receiver_id: req.body.receiver_id,
          createdAt: moment.utc(),
        });
        creat_room.save();

        var message_save = await chat.build({
          sender_id: req.body.sender_id,
          receiver_id: req.body.receiver_id,
          room_id: creat_room.id,
          message: req.body.message,
          file: filePath,
          thumbnail: thumbnailPath ? thumbnailPath : null,
          type,
          isRead: false,
          createdAt: moment.utc(),
        });

        await message_save.save();
        var receiver = await User.findOne({
          where: {
            userId: req.body.receiver_id,
          },
        });
        var sender = await User.findOne({
          where: {
            userId: req.body.sender_id,
          },
        });

        var savenotification = await Notification.build({
          message: `you receive a new message form ${sender.name}`,
          user_id: req.body.receiver_id,
          isRead: false,
          type: "message",
          created_at: moment.utc(),
        });
        await savenotification.save();
      } else {

        var message_save = await chat.build({
          sender_id: req.body.sender_id,
          receiver_id: req.body.receiver_id,
          room_id: exists.id,
          message: req.body.message,
          file: filePath,
          thumbnail: thumbnailPath ? thumbnailPath : null,
          type,
          isRead: false,
          createdAt: moment.utc(),
        });
        await message_save.save();
      }
    } else {
      var existscheck = await Room.findOne({
        where: {
          receiver_id: req.body.sender_id,
          sender_id: req.body.receiver_id,
        },
      });
      if (existscheck != null) {
        if (existscheck.id == null) {
          var creat_room = await Room.build({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            createdAt: moment.utc(),
          });
          creat_room.save();
          console.log("sdfsdf", creat_room.id);
          var message_save = await chat.build({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            room_id: creat_room.id,
            message: req.body.message,
            file: filePath,
            thumbnail: thumbnailPath ? thumbnailPath : null,
            type,
            isRead: false,
            createdAt: moment.utc(),
          });
          await message_save.save();
          var receiver = await User.findOne({
            where: {
              userId: req.body.receiver_id,
            },
          });
          var sender = await User.findOne({
            where: {
              userId: req.body.sender_id,
            },
          });
          var savenotification = await Notification.build({
            message: `you receive a new message form ${sender.name}`,
            user_id: req.body.receiver_id,
            isRead: false,
            type: "message",
            created_at: moment.utc(),
          });
          await savenotification.save();
        } else {
          var message_save = await chat.build({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            room_id: existscheck.id,
            message: req.body.message,
            file: filePath,
            thumbnail: thumbnailPath ? thumbnailPath : null,
            type,
            isRead: false,
            createdAt: moment.utc(),
          });
          await message_save.save();
        }
      } else {
        var creat_room = await Room.build({
          sender_id: req.body.sender_id,
          receiver_id: req.body.receiver_id,
          createdAt: moment.utc(),
        });
        await creat_room.save();
        var message_save = await chat.build({
          sender_id: req.body.sender_id,
          receiver_id: req.body.receiver_id,
          room_id: creat_room.id,
          message: req.body.message,
          file: filePath,
          thumbnail: thumbnailPath ? thumbnailPath : null,
          type,
          isRead: false,
          createdAt: moment.utc(),
        });
        await message_save.save();
      }
    }

    if (message_save) {
      console.log(message_save);
      var receiver = await User.findOne({
        where: {
          userId: req.body.receiver_id,
        },
      });
      var sender = await User.findOne({
        where: {
          userId: req.body.sender_id,
        },
      });

      // console.log(message_save.dataValues.id)

      var data = new Date(message_save.dataValues.createdAt)
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");

      let chat_list = {
        sender_name: sender.name,
        sender_id: sender.userId,
        receiver_id: receiver.userId,
        receiver_name: receiver.name,
        message: req.body.message,
        file: filePath,
        thumbnail: thumbnailPath ? thumbnailPath : null,
        type,
        createdAt: data,
        id: message_save?.dataValues?.id,
      };

      console.log("call brodacst : " + chat_list);
      broadcastMessage(chat_list);


      // const serverKey =
      // UPDATE UPDATE UPDATE
      // 'AAAAFTN1ifI:APA91bEdVo8JxbG2_bNDIJWor8VAdaiNfXVAOqMECt2K9SCEIK2ySvUiWGL60FeQX5s27XEfoRcVyXOjq_vHOTibJlk_X14MwAqr47SqUXD9xMlLGassGbGJsr7T6htL-_fQmaJyczya';
      // "AAAAU2XdtVU:APA91bHeWPRUyqjgrjnSDgqNM5AcJ-_k3XvrT3xhPpAoqvyTcoKnaKP7BMUQs6SzhYwTtnvODMGiLZPKMTQlwrPgi4LS5TSownpgOjfRUKD6-RvEs-iMQYCIgnz3LAi9EAchmqan-zND";
      //----------------------------------------------------------------
      // var fcm = new FCM(serverKey);
      // var notification = {
      //   title: "Notification",
      //   type: 0,
      //   body: `you received a new message form ${sender.name}`,
      // };

      if (receiver.device_token && sender.name) {
        let message = {
          data: {
            title: "Notification",
            body: `you received a new message form ${sender.name}`,

          },
          notification: {
            title: "Notification",
            body: `you received a new message form ${sender.name}`,

          },
          token: receiver.device_token,
        };
        await sendToSingleUser(message)
      }

      return res.json({
        data: "Successfully create message",
        status: 200,
        success: true,
        message: chat_list,
      });
    } else {
      return res.json({
        message: "please try agian",
        status: 400,
        success: false,
      });
    }

  } catch (e) {
    console.log(e);
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const broadcastMessage = async function (data_of_chat) {
  if (this.activitySocket != null) {
    console.log("send message : " + data_of_chat);
    this.activitySocket.emit('receive_message', data_of_chat);
  }
};

const getmessage = async (req, res, next) => {
  try {
    var chat_list_data = [];
    var existCheck = await Room.findOne({
      where: {
        sender_id: req.body.sender_id,
        receiver_id: req.body.receiver_id,
      },
    });

    if (existCheck != null) {
      console.log("----------------------------------------------------1");
      var chat_data = await chat.findAll({
        where: {
          room_id: existCheck.dataValues.id,
        },
      });

      for (var i = 0; i < chat_data.length; i++) {
        var sender = await User.findOne({
          where: {
            userId: chat_data[i].dataValues.sender_id,
          },
        });
        var receiver = await User.findOne({
          where: {
            userId: chat_data[i].dataValues.receiver_id,
          },
        });
        var data = new Date(chat_data[i].dataValues.createdAt)
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");

        let reactions = await CHAT_REACTION.findAll({
          where: {
            chatId: chat_data[i].dataValues.id
          }
        })

        if (
          req.body.sender_id == chat_data[i].dataValues.userId_dele &&
          chat_data[i].dataValues.status == 1
        ) {
        } else {
          var chat_list = {
            sender_name: sender.name,
            sender_id: sender.userId,
            receiver_id: receiver.userId,
            receiver_name: receiver.name,
            receiver_image: receiver.profileImage,
            sender_image: sender.profileImage,
            message: chat_data[i].dataValues.message,
            file: chat_data[i].dataValues?.file || null,
            thumbnail: chat_data[i].dataValues?.thumbnail || null,
            type: chat_data[i].dataValues?.type || null,
            id: chat_data[i].dataValues.id,
            isRead: chat_data[i].dataValues.isRead,
            createdAt: data,
            reactions: reactions ? reactions : []
          };
          chat_list_data.push(chat_list);
        }
      }
    } else {

      var chat_datadata = await Room.findOne({
        where: {
          receiver_id: req.body.sender_id,
          sender_id: req.body.receiver_id,
        },
      });
      console.log("----------------------------------------------------2");

      var chat_data = await chat.findAll({
        where: {
          room_id: chat_datadata.dataValues.id,
        },
      });
      for (var i = 0; i < chat_data.length; i++) {
        var sender = await User.findOne({
          where: {
            userId: chat_data[i].dataValues.sender_id,
          },
        });
        var receiver = await User.findOne({
          where: {
            userId: chat_data[i].dataValues.receiver_id,
          },
        });
        var data = new Date(chat_data[i].dataValues.createdAt)
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");

        let reactions = await CHAT_REACTION.findAll({
          where: {
            chatId: chat_data[i].dataValues.id
          }
        })

        if (
          req.body.sender_id == chat_data[i].dataValues.userId_dele &&
          chat_data[i].dataValues.status == 1
        ) {
        } else {
          var chat_list = {
            sender_name: sender.name,
            sender_id: sender.userId,
            receiver_id: receiver.userId,
            receiver_name: receiver.name,
            receiver_image: receiver.profileImage,
            sender_image: sender.profileImage,
            message: chat_data[i].dataValues.message,
            file: chat_data[i].dataValues?.file || null,
            type: chat_data[i].dataValues?.type || null,
            thumbnail: chat_data[i].dataValues?.thumbnail || null,
            id: chat_data[i].dataValues.id,
            isRead: chat_data[i].dataValues.isRead,
            createdAt: data,
            reactions: reactions ? reactions : []
          };
          chat_list_data.push(chat_list);
        }
      }
    }

    // UPDATE UPDATE UPDATE

    for (var i = 0; i < chat_list_data.length; i++) {
      if (
        req.body.sender_id == chat_list_data[i].receiver_id &&
        chat_list_data[i].isRead == false
      ) {
        // Update isRead to true for this item
        chat_list_data[i].isRead = true;

        // You can also update the database here if needed
        // Example:
        await chat.update(
          { isRead: true },
          { where: { id: chat_list_data[i].id } }
        );
      }
    }

    //----------------------------------------------------------------
    if (chat_list_data) {
      return res.json({
        message: "chat list",
        status: 200,
        success: true,
        data: chat_list_data,
      });
    } else {
      return res.json({
        message: "no data found",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const getroom = async (req, res, next) => {
  try {
    var room = [];

    var room_data = await Room.findAll({
      order: [["id", "DESC"]],
    });

    for (var i = 0; i < room_data.length; i++) {
      if (
        room_data[i].dataValues.sender_id == req.params.sender_id ||
        room_data[i].dataValues.receiver_id == req.params.sender_id
      ) {
        var sender = await User.findOne({
          where: {
            userId: room_data[i].dataValues.sender_id,
          },
        });
        var receiver = await User.findOne({
          where: {
            userId: room_data[i].dataValues.receiver_id,
          },
        });

        var chatCount = await chat.findAll({
          where: {
            room_id: room_data[i].dataValues.id,
            receiver_id: req.params.sender_id,
            isRead: false,
          },
        });
        // if (chatCount.isRead =  true) {
        //   var unreadCount = chatCount.length
        // }
        let chat_data = await chat.findOne({
          order: [["id", "DESC"]],
          where: {
            room_id: room_data[i].dataValues.id,
          },
        });

        if (chat_data) {

          let reactions = await CHAT_REACTION.findAll({
            where: {
              chatId: chat_data.id
            }
          })
          // console.log(reactions)

          if (chat_data != null) {
            var data = new Date(chat_data.createdAt)
              .toISOString()
              .replace(/T/, " ") // replace T with a space
              .replace(/\..+/, "");
            var message;
            if (chat_data.type === "text") {
              message = chat_data.message;
            } else {
              message = chat_data.type;
            }
            var file = chat_data?.file || null;
          } else {
            var message = "";
            var file = "";
          }

          var exits = await Blockuser.findOne({
            where: {
              user_blocked_by: room_data[i].dataValues.sender_id,
              blocked_user_id: room_data[i].dataValues.receiver_id,
            },
          });

          var exits_new = await Blockuser.findOne({
            where: {
              user_blocked_by: room_data[i].dataValues.receiver_id,
              blocked_user_id: room_data[i].dataValues.sender_id,
            },
          });

          if (exits || exits_new) {
            var status = 1;

            if (exits) {
              var blockBy = exits.user_blocked_by;
            }

            if (exits_new) {
              var blockBy = exits_new.user_blocked_by;
            }


          } else {
            var status = 0;
            var blockBy = null;
          }

          let room_list = {
            sender_name: sender.name,
            message: message,
            file: file,
            type: chat_data?.type || null,
            thumbnail: chat_data?.thumbnail || null,
            sender_image: sender.profileImage,
            sender_id: sender.userId,
            receiver_id: receiver.userId,
            receiver_name: receiver.name,
            receiver_image: receiver.profileImage,
            id: room_data[i].dataValues.id,
            createdAt: data,
            status: status,
            blockBy: blockBy,
            unReadCount: chatCount.length,
            reactions: reactions ? reactions : []
          };
          room.push(room_list);
        }
      }
    }


    function sortByDate(a, b) {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0;
    }

    const room_data_data = room.sort(sortByDate);

    if (room_data_data) {
      return res.json({
        message: "chat list",
        status: 200,
        success: true,
        data: room_data_data,
      });
    } else {
      return res.json({
        message: "no data found",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const getnotification_list = async (req, res) => {
  try {
    var push_data_list = [];
    var user_notification_list = await Notification.findAll({
      where: {
        user_id: req.params.user_id,
      },
    });
    for (var i = 0; i < user_notification_list.length; i++) {
      var data = new Date(user_notification_list[i].created_at)
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      var data_push = {
        id: user_notification_list[i].id,
        message: user_notification_list[i].message,
        isRead: user_notification_list[i].isRead,
        type: user_notification_list[i].type,
        created_at: data,
      };
      push_data_list.push(data_push);
    }
    if (push_data_list) {
      return res.json({
        message: "Notification list",
        status: 200,
        success: true,
        data: push_data_list,
      });
    } else {
      return res.json({
        message: "no data found",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const sendFriendRequestToUsercustom = async (req, res, next) => {
  try {
    const body = req.body;
    console.log(req.body);
    const nameexist = await User.findAll({
      where: {
        name: body.sentToNAME,
        username: {
          [Op.ne]: `${_constants.main.adminName}`,
        }
      },

    });
    if (nameexist.length == 0) {
      return res.json({
        message: "No user found",
        status: 400,
        success: false,
      });
    } else {
      for (var k = 0; k < nameexist.length; k++) {
        console.log(
          nameexist[k].dataValues.userId,
          "ddedddlkfidfsaifdaishidfsaiojfdsaoijfdasoijfdsoijfdsoijdfsofsdajidsf"
        );
        const existingRequest = await UserRequest.findOne({
          where: {
            sentBy: body.sentBy,
            sentTo: nameexist[k].dataValues.userId,
          },
        });

        if (existingRequest != null) {
          console.log("dddddddddddddddddddddddd");
          if (existingRequest.clientResponse == false)
            await UserRequest.destroy({
              where: {
                sentBy: body.sentBy,
                sentTo: nameexist[k].dataValues.userId,
              },
            });
          else
            return res.send(
              _response.getFailResponse(messages.requestAlreadyThere, null)
            );
        }
        // if (body.sentBy != body.sentTo) {
        console.log("Sfdfsdsfdfdsfdssfd");
        const request = await UserRequest.build({
          sentBy: body.sentBy,
          sentTo: nameexist[k].dataValues.userId,
          date: Date.now(),
          sentToNAME: body.sentToNAME,
          sentBYNAME: body.sentBYNAME,
          activity_name: body.sendToActivityName ?? "Test Name",
          activity_address: body.sendToActivityAddress ?? "Test address",
          activity_image: body.activity_image,
          sentToimage: nameexist[k].dataValues.profileImage,
          createdAt: moment.utc(),
          isAccepted: false
        });
        await request.save();
        var savenotification = await Notification.build({
          message: `you have receive a request from ${body.sentBYNAME}`,
          user_id: nameexist[k].dataValues.userId,
          isRead: false,
          type: "request",
          created_at: moment.utc(),
        });
        await savenotification.save();
        var receiver = await User.findOne({
          where: {
            userId: nameexist[k].dataValues.userId,
          },
        });
        // const serverKey =
        //   // UPDATE UPDATE UPDATE
        //   // 'AAAAFTN1ifI:APA91bEdVo8JxbG2_bNDIJWor8VAdaiNfXVAOqMECt2K9SCEIK2ySvUiWGL60FeQX5s27XEfoRcVyXOjq_vHOTibJlk_X14MwAqr47SqUXD9xMlLGassGbGJsr7T6htL-_fQmaJyczya';
        //   "AAAAU2XdtVU:APA91bHeWPRUyqjgrjnSDgqNM5AcJ-_k3XvrT3xhPpAoqvyTcoKnaKP7BMUQs6SzhYwTtnvODMGiLZPKMTQlwrPgi4LS5TSownpgOjfRUKD6-RvEs-iMQYCIgnz3LAi9EAchmqan-zND";
        // //----------------------------------------------------------------
        // console.log(receiver);
        // var fcm = new FCM(serverKey);

        if (receiver.device_token && body.sentBYNAME) {
          let message = {
            data: {
              title: "Notification",
              body: `you receive a new request form ${body.sentBYNAME}`,
            },
            notification: {
              title: "Notification",
              body: `you receive a new request form ${body.sentBYNAME}`,
            },
            token: receiver.device_token,
          };
          await sendToSingleUser(message)
        }
        // FCM. send(message, function(err, resp) { if(err){ throw err; }else{ console. log('Successfully sent notification'); } });
        console.log(
          "send SUCCESSFULLY................................................................"
        );
        return res.send(
          _response.getSuccessResponse(messages.requestSent, null)
        );
      }
    }
    // } else {
    //   return res.send([
    //    'message'="Sender id and receiver id same",
    //    'success' = false,
    //     'status'  =  400
    //   ]);
    // }
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const deletechat = async (req, res, next) => {
  try {

    // var upate = await chat.update(
    //   {
    //     userId_dele: req.params.userId_delete,
    //     status: 1,
    //   },
    //   {
    //     where: {
    //       id: req.params.message_id,
    //     },
    //   }
    // );

    let findMessage = await chat.findOne({
      where: {
        id: req.params.message_id
      }
    })

    if (!findMessage) {
      throw new Error("No data found for message");
    }

    let receiver = await User.findOne({
      where: {
        userId: findMessage.receiver_id,
      },
    });

    let sender = await User.findOne({
      where: {
        userId: findMessage.sender_id,
      },
    });

    const deleteResult = await chat.destroy({
      where: {
        id: req.params.message_id,
      }
    });

    // Check if any rows were deleted
    if (deleteResult) {

      let chat_list = {
        sender_name: sender?.name,
        sender_id: sender?.userId,
        receiver_id: receiver.userId,
        receiver_name: receiver.name,
        message: findMessage.message,
        file: findMessage?.file,
        type: findMessage?.type,
        createdAt: findMessage.createdAt,
        id: findMessage?.id,
      };

      console.log("call brodacst : " + chat_list);
      broadcastMessage(chat_list);


      return res.json({
        message: "Delete",
        status: 200,
        success: true,
      });
    } else {
      return res.json({
        message: "No data found",
        status: 400,
        success: false,
      });
    }

  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const RequestDelete = async (req, res) => {
  try {
    var deletedata = await UserRequest.destroy({
      where: { id: req.params.id },
    });
    if (deletedata) {
      return res.json({
        message: "Delete",
        status: 200,
        success: true,
      });
    } else {
      return res.json({
        message: "no data found",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const flaginsert = async (req, res) => {
  try {
    var insertflage = await Flage.findOne({
      where: {
        activity_id: req.body.activity_id,
      },
    });

    if (insertflage != null) {
      return res.json({
        message: "You are already mentioned",
        status: 400,
        success: false,
      });
    } else {
      var insertflage = await new Flage();
      insertflage.activity_id = req.body.activity_id;
      insertflage.user_id = req.body.user_id;
      insertflage.message = req.body.message;
      insertflage.save();
      if (insertflage) {
        return res.json({
          message: "Save successfully",
          status: 200,
          success: true,
        });
      } else {
        return res.json({
          message: "Please try again",
          status: 400,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.send(_response.getSuccessResponse(error.message, null, 400));
  }
};

const block_user_list = async (req, res) => {
  try {
    var block_user_list = await Blockuser.findAll({
      where: { user_blocked_by: req.params.user_id },
    });
    var block_user_push = [];
    for (var i = 0; i < block_user_list.length; i++) {
      var user = await User.findOne({
        where: { userId: block_user_list[i].blocked_user_id },
      });

      block_user_push.push({
        user_id: user.userId,
        name: user.name,
        zipCode: user.zipCode,
        image: user.profileImage,
      });
    }
    if (block_user_push) {
      return res.json({
        message: "Block user list",
        status: 200,
        success: true,
        data: block_user_push,
      });
    } else {
      return res.json({
        message: "No data ",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.send(_response.getSuccessResponse(error.message, null, 400));
  }
};

const Likeliveactivitise_data = async (req, res) => {
  try {
    var exist = await Likeliveactivitise.findOne({
      where: {
        user_id: req.body.user_id,
        live_activitise_id: req.body.live_activitise_id,
      },
    });

    if (exist == null) {
      var save_like = await new Likeliveactivitise();
      save_like.user_id = req.body.user_id;
      save_like.live_activitise_id = req.body.live_activitise_id;
      save_like.save();
      if (save_like) {
        return res.json({
          message: "Sucessfully like",
          status: 200,
          success: true,
        });
      } else {
        return res.json({
          message: "Please try again ",
          status: 400,
          success: false,
        });
      }
    } else {
      if (exist.status == 0) {
        var unlike = await Likeliveactivitise.update(
          { status: 1 },
          {
            where: {
              user_id: req.body.user_id,
              live_activitise_id: req.body.live_activitise_id,
            },
          }
        );
        if (unlike) {
          return res.json({
            message: "Sucessfully unlike",
            status: 200,
            success: true,
          });
        } else {
          return res.json({
            message: "Please try again ",
            status: 400,
            success: false,
          });
        }
      } else {
        var like = await Likeliveactivitise.update(
          { status: 0 },
          {
            where: {
              user_id: req.body.user_id,
              live_activitise_id: req.body.live_activitise_id,
            },
          }
        );
        if (like) {
          return res.json({
            message: "Sucessfully like",
            status: 200,
            success: true,
          });
        } else {
          return res.json({
            message: "Please try again ",
            status: 400,
            success: false,
          });
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.send(_response.getSuccessResponse(error.message, null, 400));
  }
};

const userdetail = async (req, res) => {
  try {
    var user_details = await User.findOne({
      where: {
        userId: req.params.id,
      },
    });
    if (user_details) {
      return res.json({
        message: "User detail",
        status: 200,
        success: true,
        data: user_details,
      });
    } else {
      return res.json({
        message: "No data ",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.send(_response.getSuccessResponse(error.message, null, 400));
  }
};
const deleteimage = async (req, res) => {
  try {
    var destroy_success = await UserImage.destroy({
      where: {
        id: req.query.id,
      },
    });
    if (destroy_success) {
      return res.json({
        message: "delete user image",
        status: 200,
        success: true,
      });
    } else {
      return res.json({
        message: "Please try again",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.send(_response.getSuccessResponse(error.message, null, 400));
  }
};

// UPDATE UPDATE UPDATE
const userLikes = async (req, res) => {
  try {

    const userId = req.body.userId;
    const likedBy = req.body.likedBy;

    // Check if userId and likedBy are defined
    if (!userId || !likedBy) {
      return res.status(400).json({
        status: false,
        message: "userId and likedBy are required parameters",
      });
    }

    const likedByUser = await USER.findOne({
      where: { userId: likedBy },
    });

    const user = await USER.findOne({
      where: { userId: userId },
    });

    if (!user || !likedByUser) throw new Error('please provid valid userId.');

    // Check if the user has already liked the content
    const find = await USER_LIKE.findOne({
      where: {
        userId: userId,
        likedBy: likedBy,
      },
    });

    if (!find) {
      // If not liked, create a new like record
      const userLikes = await USER_LIKE.create({
        userId: userId,
        likedBy: likedBy,
        createdAt: new Date(),
      });

      var savenotification = await Notification.build({
        message: `${likedByUser.name} liked your feed.`,
        user_id: userId,
        isRead: false,
        type: "like",
        created_at: moment.utc(),
      });
      await savenotification.save();

      sendPushNotification(likedByUser, user);

      const find = await USER_LIKE.findAll({
        where: {
          userId: userId,
        },
      });

      const likeObject = {
        'id': userLikes.id,
        'userId': userLikes.userId,
        'likedBy': userLikes.likedBy,
        'createdAt': userLikes.createdAt,
        'likesCount': find.length
      }

      return res.status(200).json({
        status: true,
        message: "Liked successfully",
        data: likeObject
      });
    } else {
      // If already liked, remove the like record
      await USER_LIKE.destroy({
        where: {
          userId: userId,
          likedBy: likedBy,
        },
      });

      const find = await USER_LIKE.findAll({
        where: {
          userId: userId,
        },
      });

      const userObj = {
        'likesCount': find.length,
      };

      return res.status(200).json({
        status: true,
        message: "Disliked successfully",
        data: userObj
      });
    }

  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const sendPushNotification = async (likedByUser, user) => {

  let notification = {
    title: 'Notification',
    body: `${likedByUser.name} liked your feed.`,
  };

  if (user.device_token && likedByUser.name) {
    let message = {
      token: user.device_token,
      notification: {
        title: 'Notification',
        body: `${likedByUser.name} liked your feed.`,
      },
      data: notification,
    };
    await sendToSingleUser(message);
  }

}

const notificationIsReadUpdate = async (req, res) => {
  try {

    var notificationFind = await Notification.findAll({
      where: { user_id: req.params.user_id, isRead: false }
    });

    for (const notification of notificationFind) {
      await notification.update({ isRead: true })
    }

    const updatedNotifications = await Notification.findAll({
      where: { user_id: req.params.user_id }
    });

    return res.status(202).json({
      status: true,
      message: "Notifications update successfully",
      data: updatedNotifications
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    var roomId = req.params.roomId
    if (!roomId) {
      throw new Error("roomId is required.")
    }
    var chats = await chat.destroy({
      where: {
        room_id: roomId,
      }
    })
    var rooms = await Room.destroy({
      where: {
        id: roomId
      }
    })
    res.status(200).json({
      status: true,
      message: "Room deleted successfully.",
      data: rooms
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

function activitySetSocketIo(socketIo) {
  this.activitySocket = socketIo;
  console.log("Activity socket : " + this.activitySocket);
}

//----------------------------------------------------------------
module.exports = {
  getAllUsers,
  sendFriendRequestToUser,
  getUserFriendRequests,
  sendActivityRequest,
  responseFriendRequest,
  responseActivityRequest,
  getMyActivities,
  getUserActivityRequests,
  getMyOfferedActivityRequests,
  getMyOfferedFriendRequests,
  getMyFriends,
  registerLiveActivity,
  getLiveActvities,
  responseconfirm,
  creatchat,
  getmessage,
  getroom,
  getnotification_list,
  sendFriendRequestToUsercustom,
  deletechat,
  RequestDelete,
  flaginsert,
  block_user_list,
  Likeliveactivitise_data,
  userdetail,
  deleteimage,
  getUsers,
  userLikes,
  notificationIsReadUpdate,
  deleteRoom,
  activitySetSocketIo,
  sendPushNotification,
  broadcastMessage

};
