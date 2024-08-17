const _response = require('../utils/response');
const _constants = require('../utils/constants');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Gender = require('../models/gender');
const UserImage = require('../models/userImage');
const ForgetPassword = require('../models/forgetPassword');
const sequelize = require('../database/database');
const _twilioService = require('../utils/twilio');
const Activity = require('../models/activity');
const LiveActivity = require('../models/liveActivity');
const Notification = require('../models/notification_list');
const { Op, Sequelize } = require('sequelize');
const LiveActivityImage = require('../models/liveActivityImage');
const Blockuser = require('../models/block_user');
const UserRequest = require('../models/userRequest');
const Userreport = require('../models/userreport');
const Advertisement = require('../models/Advertisement');
const Flage = require('../models/Flage');
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
const mysql = require('mysql2');
const USER_LIKE = require('../models/userLikes');
const LIKE_ACTIVITY = require('../models/likeActivity')
const USER = require("../models/user");
const HASHTAG = require('../models/hashTag')
const ADVERTISE_MENT = require('../models/Advertisement')
const STORY_SEEN = require('../models/storySeen')
const { sendPushNotification } = require('./activity.controller');
const { handleEarningPointsAndBadges } = require('../utils/handleBadgeSystem');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const Likeliveactivitise = require("../models/Likeliveactivitise");
const path = require('path');
const chat = require('../models/chat');
const CHAT_REACTION = require('../models/chatReaction')
const { broadcastMessage } = require('./activity.controller')
const FCM = require("fcm-node");
const INTERESTED = require('../models/interested');
const { sendToSingleUser, sendToAll } = require('../utils/sendNotification');
const MATCH_USERS = require('../models/matchUsers');
const { getUnseenMatchedUserCount } = require('./preferredActivityController');
var activitySocket;

const checkUsernameExists = async (req, res, next) => {
  try {
    const body = req.body;
    const username = await User.findOne({
      where: {
        username: body.username,
      },
    });
    if (username == null)
      return res.send(
        _response.getSuccessResponse(_constants.messages.success, null)
      );
    else
      return res.send(
        _response.getFailResponse(_constants.messages.uniqueUsername, null)
      );
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null));
  }
};

const register = async (req, res, next) => {
  try {
    const body = req.body;
    const fileName = req.file.filename;
    const existingUser = await User.findOne({
      where: { username: body.username },
      attributes: ['userId'],
    });
    if (existingUser != null)
      return res.send(
        _response.getFailResponse(_constants.messages.uniqueUsername, null)
      );
    const birthday = moment(body.birthday);
    const age = moment().diff(birthday, 'years');

    const newUser = await User.build({
      username: body.username,
      birthday: birthday.format('MM/DD/YYYY').toString(),
      name: body.name,
      age: age,
      email: body.email,
      password: await bcrypt.hash(body.password, _constants.main.saltRound),
      genderId: body.gender,
      city: body.city,
      country: body.country || 'USA',
      aboutMe: body.aboutMe,
      zipCode: body.zipCode,
      intrestedIn: body.intrestedIn,
      favActivities: body.favActivities,
      phoneNumberConfirmed: false,
      availableForPick: true,
      profileImage: (fileName === undefined || fileName === undefined) ? user.profileImage : `${_constants.main.filePath}${fileName}`,
      latitude: body.latitude,
      longitude: body.longitude,
      createdAt: moment.utc(),
    });

    await newUser.save();

    var user = await sequelize.query(
      `call sp_login_user('${body.username}')`
    );
    user = user[0];
    // var response = {
    //   userId:  user._id,
    //   name: user.name,
    //   username: user.username,
    //   gender: user.genderId,
    //   profileImage: user.profileImage,
    //   city: user.city,
    //   age: user.age,
    //   email: user.email,
    //   country: user.country,
    //   isAdmin: user.isAdmin,
    //   zipCode: user.zipCode,
    //   favActivities: user.favActivities,
    //   aboutMe: user.aboutMe,
    //   phoneNumberConfirmed: Boolean(user.phoneNumberConfirmed),
    //   availableForPick: Boolean(user.availableForPick),
    //   birthday: user.birthday,
    //   intrestedIn: user.intrestedIn,
    // }
    // console.log(JSON.parse(JSON.stringify(user)))

    // badge poits system

    let updatedUser = await handleEarningPointsAndBadges(user.userId, 'register')

    let loginResponse = await createLoginResponse(updatedUser);

    let isAdmin;
    if (body.username === 'Admin' && body.password === 'Test@123') {
      isAdmin = true
    } else {
      isAdmin = false
    }

    loginResponse.user.isAdmin = isAdmin

    return res.send(
      _response.getSuccessResponse(
        _constants.messages.registered,
        loginResponse,
        null
      )
    );
    // res.status(200).json({
    //   status: 200,
    //   message : "Registration successfully.",
    //   data : response,token: jwt.sign({ userId: user.id }, process.env.jwtKey, {
    //     expiresIn: '1d',
    //   }),
    // })
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null));
  }
};

const logout = async (req, res) => {
  try {

    let { userId } = req.query;

    if (!userId) {
      throw new Error('userId is required.')
    }

    let user = await USER.findOne({
      where: {
        userId
      }
    })

    if (!user) {
      throw new Error('please provide valid userId.')
    }

    user.device_token = null;
    await user.save()

    res.status(200).json({
      status: true,
      message: 'User logout Successfully.'
    });

  } catch (error) {

    res.status(400).json({
      status: 400,
      message: error.message
    });

  }
}

const verifyPhoneNumber = async (req, res, next) => {
  try {
    const body = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);
    console.log("Verify pone number code: " + code);
    return res.send(_response.getFailResponse("API is under development", null));
    /*const result = await _twilioService.sendMessage(body.phoneNumber, code);
    if (!result)
      return res.send(
        _response.getFailResponse(_constants.messages.codeNotSent, null)
      );

    const existingCode = await ForgetPassword.findOne({
      where: {
        username: body.username,
      },
    });
    if (existingCode === null) {
      const fgp = ForgetPassword.build({
        username: body.username,
        code: code,
      });
      await fgp.save();
    } else {
      existingCode.code = code;
      await existingCode.save();
    }

    return res.send(
      _response.getSuccessResponse(_constants.messages.codeSent, null)
    );*/
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null));
  }
};

const updatePhoneNumberConfirmed = async (req, res, next) => {
  try {
    const body = req.body;

    const existingCode = await ForgetPassword.findOne({
      where: {
        username: body.username,
        code: body.code,
      },
    });
    if (existingCode === null)
      return res.send(
        _response.getFailResponse(_constants.messages.notFound, null)
      );

    const user = await User.findOne({
      where: {
        username: body.username,
      },
    });

    user.phoneNumberConfirmed = true;
    await user.save();

    return res.send(
      _response.getSuccessResponse(
        _constants.messages.phoneNumberConfirmed,
        null
      )
    );
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null));
  }
};

const login = async (req, res, next) => {
  try {
    const body = req.body;
    var user = await sequelize.query(
      `call sp_login_user('${body.username}')`
    );

    if (user === null || user.length < 1) {
      return res.send(
        _response.getFailResponse(_constants.messages.notFound, null, 400)
      );
    }

    user = user[0];
    console.log("###### ", user.username);
    console.log("###### ", user.password);
    var data = await User.update(
      {
        device_token: body.device_token,
      },
      {
        where: {
          username: user.username,
        },
      }
    );

    await bcrypt.compare(
      `${body.password}`,
      `${user.password}`,

      async (err, success) => {
        console.log(success);
        if (success) {
          console.log("SUCCESS")
          const loginResponse = await createLoginResponse(user);

          let isAdmin;
          if (body.username === 'Admin' && body.password === 'Test@123') {
            isAdmin = true
          } else {
            isAdmin = false
          }

          loginResponse.user.isAdmin = isAdmin

          return res.send(
            _response.getSuccessResponse(
              _constants.messages.login,
              loginResponse,
              null
            )
          );
        } else {
          console.log("err", err);
        }
        return res.send(
          _response.getFailResponse(
            _constants.messages.incorrectCreds,
            null,
            400
          )
        );
      }
    );


  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const updateProfile = async (req, res, next) => {
  try {

    const body = req.body;
    console.log("req.body", req.body);
    const fileName = req?.file?.filename;
    const userId = body.userId;
    if (userId === null || userId === '')
      return res.send(
        _response.getFailResponse(_constants.messages.notFound, null, 400)
      );

    let isUsername = await User.findOne({
      where: {
        username: body.username
      }
    })

    var user = await User.findOne({
      where: { userId: userId },
      // attributes: [
      //   'userId',
      //   'username',
      //   'password',
      //   'name',
      //   'birthday',
      //   'genderId',
      //   'intrestedIn',
      // ],
    });

    if (isUsername && body.username !== user.username) {
      throw new Error('Username is already exists.')
    }

    console.log(body.birthday) //23/05/1998
    let parsedBirthday = moment(body.birthday, 'DD/MM/YYYY');

    if (parsedBirthday.isValid()) {
      var formattedBirthday = parsedBirthday.format('MM/DD/YYYY');
      var age = moment().diff(parsedBirthday, 'years');
    }

    user.username =
      body.username === undefined ? user.username : body.username;
    user.name = body.name === undefined ? user.name : body.name;
    user.email = body.email === undefined ? user.email : body.email;
    user.birthday =
      body.birthday === undefined
        ? user.birthday
        : formattedBirthday;
    // Calculate age based on birthday
    user.age = age;
    user.genderId = body.gender === undefined ? user.genderId : body.gender;
    user.intrestedIn =
      body.intrestedIn === undefined ? user.intrestedIn : body.intrestedIn;
    user.profileImage =
      fileName === 'undefined' || fileName === undefined
        ? user.profileImage
        : `${_constants.main.filePath}${fileName}`;
    user.aboutMe = body.aboutMe === undefined ? user.aboutMe : body.aboutMe;
    user.city = body.city === undefined ? user.city : body.city;
    user.country = body.country === undefined ? user.country : body.country;
    user.zipCode = body.zipCode === undefined ? user.zipCode : body.zipCode;
    user.latitude = body.latitude === undefined ? user.latitude : body.latitude;
    user.longitude = body.longitude === undefined ? user.longitude : body.longitude;
    user.favActivities =
      body.favActivities === undefined
        ? user.favActivities
        : body.favActivities;
    await user.save();
    var userTosend = await sequelize.query(
      `call sp_login_user('${user.username}')`
    );
    userTosend = userTosend[0];
    console.log("UserToSend: %j", userTosend);
    var loginResponse = await createLoginResponse(userTosend);
    let lr = _response.getSuccessResponse(
      _constants.messages.profileUpadated,
      loginResponse
    );
    console.log("lr: %j", lr);
    console.log("login response: %j", loginResponse);
    return res.send(
      _response.getSuccessResponse(
        _constants.messages.profileUpadated,
        loginResponse
      )
    );
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const uploadUserImage = async (req, res, next) => {
  try {

    const body = req.body;

    if (!body.type) {
      throw new Error("type is required.");
    } else if (!body.userId) {
      throw new Error("userId is required.");
    }

    let uploadedFile = req.files.filter(file => file.fieldname === "file")[0]
    let thumbnail = req.files.filter(file => file.fieldname === "thumbnail")[0]

    const fileSizeLimit = 30 * 1024 * 1024; // 10MB in bytes
    if (uploadedFile.size > fileSizeLimit) {
      return res.status(400).json({
        message: _constants.messages.fileSize,
        success: false,
        status: 400,
      });
    }

    if (!uploadedFile) {
      throw new Error('please provide a file.')
    } else if (!thumbnail) {
      throw new Error('please provide a thumbnail.')
    }

    let currentUser = await User.findOne({ where: { userId: req.body.userId } })

    if (!currentUser) {
      throw new Error('please provide valid user')
    }

    if (body.type === 'reel') {

      if (!uploadedFile.mimetype.startsWith('video/')) {
        throw new Error("Invalid file type. Only video files are allowed.");
      }

      const maxVideoDuration = 90;
      const videoDuration = await getVideoDurationInSeconds(uploadedFile.path);
      console.log(`Video duration: ${videoDuration}`)
      if (videoDuration > maxVideoDuration) {
        fs.unlink(uploadedFile.path, (err) => {
          if (err) {
            console.error('Error deleting the video file:');
          } else {
            console.log('Video file unlinked successfully.');
          }
        });
        throw new Error(`Maximum video duration is ${maxVideoDuration} seconds.`);
      }

      let user = await User.findOne({ where: { userId: body.userId } });

      if (!user) {
        throw new Error("Incorrect credentials");
      }

      const file = await UserImage.build({
        userId: body.userId,
        type: body.type || null,
        file: `${_constants.main.filePath}${uploadedFile.filename}` || null, //${_constants.main.filePath}${req.file.filename}
        thumbnail: `${_constants.main.filePath}${thumbnail.filename}` || null,
        description: body?.description || null,
        createdAt: Date.now(),
        updatedAt: Date.now()
        // file :  req.protocol + "://" + req.get("host") + "/assets/images/" +req.file.filename
      });
      await file.save();

      const createdPost = JSON.parse(JSON.stringify(file));

      let { hashTags } = req.body

      let hashTagsArray = [];

      if (hashTags && hashTags.length > 0) {
        for (let index = 0; index < hashTags.length; index++) {
          const element = hashTags[index]
          if (element && element.trim() !== "") {
            let hashTag = await HASHTAG.create({
              name: element,
              postId: createdPost.id
            })
            hashTagsArray.push(hashTag?.name)
          }
        }
      }

      if (body.type && currentUser) {
        var exitingUser = await handleEarningPointsAndBadges(currentUser?.userId, body.type)
      }
      let response = JSON.parse(JSON.stringify(file))
      response.hashTags = hashTagsArray
      response.badge_points = exitingUser.badge_points

      // await sendToAll('Notification', `Check out the latest ${body.type} uploaded by ${currentUser.name}!`, currentUser.userId);

      res.json({
        message: 'File uploaded successfully',
        success: true,
        status: 200,
        data: response,
      });

    } else if (body.type === 'story') {

      const { userId } = req.body

      if (uploadedFile.mimetype.startsWith('video/')) {
        const maxVideoDuration = 90;
        const videoDuration = await getVideoDurationInSeconds(uploadedFile.path);
        console.log(`Video duration: ${videoDuration}`)
        if (videoDuration > maxVideoDuration) {
          fs.unlink(uploadedFile.path, (err) => {
            if (err) {
              console.error('Error deleting the video file:');
            } else {
              console.log('Video file unlinked successfully.');
            }
          });
          throw new Error(`Maximum video duration is ${maxVideoDuration} seconds.`);
        }
      }

      const storyCreatedUser = await USER.findOne({
        where: {
          userId
        }
      })

      if (!storyCreatedUser) {
        throw new Error('this is not valid user')
      }

      const file = await UserImage.build({
        userId: body.userId,
        type: body.type || null,
        file: `${_constants.main.filePath}${uploadedFile.filename}` || null, //${_constants.main.filePath}${req.file.filename}
        thumbnail: `${_constants.main.filePath}${thumbnail.filename}` || null,
        description: body?.description || null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      await file.save();

      let stories = [file]

      let filteredStoriesByUser = {};

      stories.forEach(story => {
        const { userId } = story;
        if (!filteredStoriesByUser[userId]) {
          filteredStoriesByUser[userId] = [];
        }
        filteredStoriesByUser[userId].push(story);
      });


      const getUser = async (userId) => {
        let findUser = await User.findOne({
          where: {
            userId: userId
          }
        });
        if (!findUser) {
          return null;
        } else {
          return findUser;
        }
      };

      const result = Object.keys(filteredStoriesByUser).map(userId => ({
        userId,
        stories: filteredStoriesByUser[userId].map(async story => {
          let isSeen = await STORY_SEEN.findOne({
            where: {
              storyId: story.id,
              viewerId: currentUser
            }
          });
          return {
            ...story.dataValues,
            isSeen: isSeen ? true : false,
            userId: parseInt(story.userId) // Convert userId to integer
          };
        }),
      }));

      let resolvedResult = await Promise.all(result.map(async user => {
        const userDetails = await getUser(user.userId);
        return {
          userId: user.userId || null,
          profileImage: userDetails?.profileImage || null,
          username: userDetails?.username || null,
          name: userDetails?.name || null,
          stories: await Promise.all(user.stories)
        };
      }));

      let storyResponse = {
        status: "success",
        message: "new story create",
        data: resolvedResult
      }

      console.log(storyResponse)

      const broadcastMessage = async function (story_data) {
        if (this.activitySocket != null) {
          console.log("send message : " + story_data);
          this.activitySocket.emit('storyUpload', story_data);
        }
      };


      await broadcastMessage(storyResponse)

      const response = JSON.parse(JSON.stringify(file));
      // console.log(response)

      // await sendToAll('Notification', `Check out the latest ${body.type} uploaded by ${currentUser.name}!`, currentUser.userId);

      res.json({
        message: 'File uploaded successfully',
        success: true,
        status: 200,
        data: response,
      });

    } else {

      if (body.type === 'Video') {

        if (!uploadedFile.mimetype.startsWith('video/')) {
          throw new Error("Invalid file type. Only video files are allowed.");
        }

        const allowedExtensions = ['.mp4']; // Define allowed video extensions
        const fileExtension = path.extname(uploadedFile.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error('Invalid file extension. Allowed extensions are: ' + allowedExtensions.join(', '));
        }

        const maxVideoDuration = 300;
        const videoDuration = await getVideoDurationInSeconds(uploadedFile.path);

        console.log(`Video duration: ${videoDuration}`)

        if (videoDuration > maxVideoDuration) {
          fs.unlink(uploadedFile.path, (err) => {
            if (err) {
              console.error('Error deleting the video file:');
            } else {
              console.log('Video file unlinked successfully.');
            }
          });
          throw new Error('Maximum video duration is 5 minutes.');
        }
      }
      // console.log("req.file.buffer", req.file.buffer);
      const file = await UserImage.build({
        userId: body.userId,
        type: body.type || null,
        file: `${_constants.main.filePath}${uploadedFile.filename}` || null, //${_constants.main.filePath}${req.file.filename}
        thumbnail: `${_constants.main.filePath}${thumbnail.filename}` || null,
        description: body?.description || null,
        createdAt: Date.now(),
        updatedAt: Date.now()
        // file :  req.protocol + "://" + req.get("host") + "/assets/images/" +req.file.filename
      });
      await file.save();

      const createdPost = JSON.parse(JSON.stringify(file));
      // console.log(createdPost)

      let { hashTags } = req.body

      let hashTagsArray = [];

      if (hashTags && hashTags.length > 0) {
        for (let index = 0; index < hashTags.length; index++) {
          const element = hashTags[index];
          if (element && element.trim() !== "") {
            let hashTag = await HASHTAG.create({
              name: element,
              postId: createdPost.id
            })
            hashTagsArray.push(hashTag?.name)
          }
        }
      }

      if (body.type && currentUser) {
        var exitingUser = await handleEarningPointsAndBadges(currentUser?.userId, body?.type)
      }

      let response = JSON.parse(JSON.stringify(file))
      response.hashTags = hashTagsArray
      response.badge_points = exitingUser.badge_points
      console.log('first', `${body.type} uploaded by ${currentUser.name}!`, currentUser.userId)
      // await sendToAll('Notification', `Check out the latest ${body.type} uploaded by ${currentUser.name}!`, currentUser.userId);

      res.json({
        message: 'File uploaded successfully',
        success: true,
        status: 200,
        data: response
      });
    }

  } catch (error) {
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};
//----------------------------------------------------------------

const deleteFile = async (req, res, next) => {
  try {
    id = req.body.id
    var file = await UserImage.findOne({ where: { id: id } })
    if (!file) {
      throw new Error('file not found.')
    }
    var fileDelete = await UserImage.destroy({
      where: { id: id }
    })
    res.status(200).json({
      status: "success",
      message: "User File deleted successfully",
      data: fileDelete
    })
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    })
  }
};
//----------------------------------------------------------------
const updateUserImage = async (req, res, next) => {
  try {
    const body = req.body;

    const file = await UserImage.update(
      {
        file: `${_constants.main.filePath}${req.file.filename}`, //${_constants.main.filePath}${req.file.filename}
      },
      {
        where: { id: body.id },
      }
    );

    return res.send(
      _response.getSuccessResponse(_constants.messages.fileUpdated, null)
    );
  } catch (e) {
    console.log(e.message);
    return res.send(_response.getSuccessResponse(e.message, null, 400));
  }
};

const getImages = async (req, res, next) => {
  try {
    const params = req.params;

    const images = await UserImage.findAll({
      where: {
        userId: params.userId,
        type: {
          [Op.ne]: 'story'
        }
      },
    });

    let arrayData = []

    for (let allData of images) {

      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: allData.id }
      });

      let users = await User.findOne({
        where: { userId: allData.userId }
      });

      let updatedReel = {
        ...allData.dataValues,
        username: users.username ?? null,
        name: users.name ?? null,
        profileImage: users.profileImage ?? null,
        likes: 0,
        hashTags: [],
        isLiked: false
      };

      if (userLikes && userLikes.length > 0) {
        updatedReel.likes = userLikes ? userLikes.length : 0;
        for (let index = 0; index < userLikes.length; index++) {
          const element = userLikes[index];
          //console.log(element.likedBy,currentUser,"check")
          if (element.likedBy == params.userId) {
            updatedReel.isLiked = true;
          }
        }
      }

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: allData.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      if (hashTagArray && hashTagArray.length > 0) {
        updatedReel.hashTags = hashTagArray ? hashTagArray : [];
      }
      arrayData.push(updatedReel);
    }

    return res.send(
      _response.getSuccessResponse(_constants.messages.fileUploaded, arrayData)
    );
  } catch (e) {
    return res.send(_response.getSuccessResponse(e.message, null, 400));
  }
};
//----------------------------------------------------------------
const getImage = async (req, res, next) => {
  try {
    console.log("HELLO ");
    id = req.body.userId;
    var user = await User.findOne({ where: { userId: id } });
    console.log("USER================", user);
    if (!user) {
      throw new Error("Couldn't find user")
    }
    var file = await UserImage.findAll({
      where: { userId: id, type: 'image', }
      , order: [['createdAt', 'DESC']]
    })
    if (!file) {
      throw new Error("Couldn't find images")
    }

    let arrayData = []

    for (let imagesData of file) {

      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: imagesData.id }
      });

      let users = await User.findOne({
        where: { userId: imagesData.userId }
      });

      let updatedReel = { ...imagesData.dataValues, username: users.username, name: users.name, profileImage: users.profileImage, likes: 0, hashTags: [], isLiked: false };
      if (userLikes && userLikes.length > 0) {
        updatedReel.likes = userLikes ? userLikes.length : 0;
        for (let index = 0; index < userLikes.length; index++) {
          const element = userLikes[index];
          console.log(element.likedBy, currentUser, "check")
          if (element.likedBy == currentUser) {
            updatedReel.isLiked = true;
          }
        }
      }

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: imagesData.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      if (hashTagArray && hashTagArray.length > 0) {
        updatedReel.hashTags = hashTagArray ? hashTagArray : [];
      }
      arrayData.push(updatedReel);
    }

    res.status(200).json({
      status: "success",
      message: "image get successfully",
      data: arrayData
    })
  } catch (error) {
    res.status(400).json({
      status: "success",
      message: error.message,
    })
  }
};

const getVideo = async (req, res, next) => {
  try {
    console.log("HELLO ");
    id = req.body.userId;
    var user = await User.findOne({ where: { userId: id } });
    console.log("USER================", user);
    if (!user) {
      throw new Error("Couldn't find user")
    }
    var file = await UserImage.findAll({
      where: {
        userId: id,
        type: {
          [Op.like]: 'video'
        },
      }
      , order: [['createdAt', 'DESC']]
    })
    if (!file) {
      throw new Error("Couldn't find images")
    }

    let arrayData = []

    for (let videoData of file) {

      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: videoData.id }
      });

      let users = await User.findOne({
        where: { userId: videoData.userId }
      });

      let updatedReel = { ...videoData.dataValues, username: users.username, name: users.name ? users.name : null, profileImage: users.profileImage, likes: 0, hashTags: [], isLiked: false };
      if (userLikes && userLikes.length > 0) {
        updatedReel.likes = userLikes ? userLikes.length : 0;
        for (let index = 0; index < userLikes.length; index++) {
          const element = userLikes[index];
          console.log(element.likedBy, currentUser, "check")
          if (element.likedBy == currentUser) {
            updatedReel.isLiked = true;
          }
        }
      }

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: videoData.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      if (hashTagArray && hashTagArray.length > 0) {
        updatedReel.hashTags = hashTagArray ? hashTagArray : [];
      }
      arrayData.push(updatedReel);
    }

    res.status(200).json({
      status: "success",
      message: "video get successfully",
      data: arrayData
    })
  } catch (error) {
    res.status(400).json({
      status: "success",
      message: error.message,
    })
  }
};

// NEW UPDATES

// create new reels APIs

const getReels = async (req, res, next) => {
  try {
    let userId = req.query.userId;

    if (!userId) {
      throw new Error('please provide a userId.')
    }

    let user = await User.findOne({ where: { userId: userId } });

    if (!user) {
      throw new Error("Couldn't find user");
    }

    let files = await UserImage.findAll({
      where: { userId: userId, type: 'reel' },
      order: [['createdAt', 'DESC']]
    });

    let arrayData = []

    for (let allData of files) {

      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: allData.id }
      });

      let users = await User.findOne({
        where: { userId: allData.userId }
      });

      let updatedReel = {
        ...allData.dataValues,
        username: users.username ?? null,
        name: users.name ?? null,
        profileImage: users.profileImage ?? null,
        likes: 0,
        hashTags: [],
        isLiked: false
      };

      if (userLikes && userLikes.length > 0) {
        updatedReel.likes = userLikes ? userLikes.length : 0;
        for (let index = 0; index < userLikes.length; index++) {
          const element = userLikes[index];
          if (element.likedBy == userId) {
            updatedReel.isLiked = true;
          }
        }
      }

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: allData.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      if (hashTagArray && hashTagArray.length > 0) {
        updatedReel.hashTags = hashTagArray ? hashTagArray : [];
      }
      arrayData.push(updatedReel);
    }
    res.status(200).json({
      status: "success",
      message: "reels get successfully",
      data: arrayData // Directly use updated mainArray
    });
  } catch (error) {
    console.error("Error fetching user reels:", error); // Error log
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

const likeActivityForPost = async (req, res) => {
  try {

    const { likedBy, postId } = req.query;

    if (!likedBy) {
      throw new Error('please provide a likedBy.')
    }

    let likedUser = await User.findOne({ where: { userId: likedBy } });

    if (!likedUser) {
      throw new Error("Couldn't find likedBy");
    }

    if (!req.query.likedBy) {
      throw new Error('please provide a likedBy');
    } else if (!req.query.postId) {
      throw new Error('please provide a postId')
    }

    let file = await UserImage.findOne({ where: { id: postId } });

    if (!file) {
      throw new Error('post not found.')
    }

    const likedByUser = await USER.findOne({
      where: { userId: likedBy },
    });

    const existingLike = await LIKE_ACTIVITY.findOne({
      where: { likedBy: likedBy, postId }
    });

    if (existingLike) {

      await existingLike.destroy();

      const allLikes = await LIKE_ACTIVITY.findAll({
        where: {
          postId: postId,
        },
      });

      const userObj = {
        'likesCount': allLikes.length,
      };

      return res.status(200).json({
        status: true,
        message: "Disliked successfully",
        data: userObj
      });
    }
    // const currentDate = new Date();
    const newLike = await LIKE_ACTIVITY.create({
      postId: postId,
      likedBy: likedBy
    });

    const isPostUploadedUser = await User.findOne({
      where: {
        userId: file.userId
      }
    })

    if (isPostUploadedUser) {
      if (likedBy != file.userId) {
        await handleEarningPointsAndBadges(file?.userId, 'postLike')
      }

      if (isPostUploadedUser.device_token && likedByUser.name) {
        if (isPostUploadedUser.userId != req.userId) {

          const savenotification = await Notification.build({
            message: `${likedByUser.name} liked your post.`,
            user_id: file.userId,
            isRead: false,
            type: "like",
            created_at: moment.utc(),
          });
          await savenotification.save();

          let notification = {
            title: 'Notification',
            body: `${likedByUser.name} liked your post.`,
          };

          let message = {
            token: isPostUploadedUser.device_token,
            notification: {
              title: 'Notification',
              body: `${likedByUser.name} liked your post.`,
            },
            data: notification,
          };
          await sendToSingleUser(message)

        }
      }
    }

    const allLikes = await LIKE_ACTIVITY.findAll({
      where: {
        postId: postId,
      },
    });

    const likeObject = {
      'id': newLike.id,
      'userId': newLike.userId,
      'likedBy': newLike.likedBy,
      'createdAt': newLike.createdAt,
      'likesCount': allLikes.length
    }

    res.status(200).json({
      status: true,
      message: 'Liked Successfully',
      data: likeObject
    });

  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    });
  }
};

const getAllReels = async (req, res) => {

  try {

    let { limit, currentUser } = req.query
    let { cacheArray } = req.body;

    if (!cacheArray) {
      cacheArray = []
    }

    if (!limit) {
      throw new Error('please provide a limit.')
    } else if (!currentUser) {
      throw new Error('please provide a currentUser.')
    }

    if (typeof cacheArray === 'string') {
      try {
        cacheArray = JSON.parse(cacheArray);
      } catch (error) {
        throw new Error('cacheArray must be a valid JSON array.');
      }
    }

    const user = await User.findOne({
      where: {
        userId: currentUser
      }
    })

    if (!user) {
      throw new Error('please provide valid user.')
    }

    let reelsArray = [];

    // if(typeof)

    const excludeIds = cacheArray.join(',');

    // userId != ${currentUser} 
    const randomReels = await sequelize.query(
      `SELECT * FROM userFiles 
      WHERE type = "reel" 
      ${excludeIds ? `AND id NOT IN (${excludeIds})` : ``} 
      AND EXISTS (SELECT 1 FROM users WHERE users.userId = userFiles.userId)
      ORDER BY RAND() 
      LIMIT ${limit}
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    // if (!randomReels || randomReels.length === 0) {
    //   throw new Error("Couldn't find random reels");
    // }

    for (let singleReel of randomReels) {

      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: singleReel.id }
      });

      let users = await User.findOne({
        where: { userId: singleReel.userId }
      });

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: singleReel.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      let isLiked = false;
      if (userLikes && userLikes.length > 0) {
        for (let index = 0; index < userLikes?.length; index++) {
          const element = userLikes[index];
          if (element.likedBy == currentUser) {
            isLiked = true;
          }
        }
      }

      let findInterest = await INTERESTED.findOne({
        where: {
          interestedByProfileId: req.userId,
          interestedToProfileId: users.userId
        }
      })

      const interestedCount = await INTERESTED.count({
        where: {
          interestedToProfileId: users.userId
        }
      })

      let updatedReel = {
        ...singleReel,
        username: users.username ?? null,
        name: users.name ?? null,
        profileImage: users.profileImage ?? null,
        hashTags: hashTagArray?.length > 0 ? hashTagArray : [],
        likes: userLikes?.length > 0 ? userLikes?.length : 0,
        isLiked: isLiked,
        isInterested: findInterest ? true : false,
        interestedCount,
      };

      reelsArray.push(updatedReel);
    }

    res.status(200).json({
      status: "success",
      message: "reels get successfully",
      data: reelsArray
    });

  } catch (error) {
    console.error("Error fetching reels:", error);
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

const deleteReel = async (req, res) => {
  try {

    const { postId } = req.query

    if (!postId) {
      throw new Error('please provide postId.')
    }

    let findReel = await UserImage.findOne({
      where: { id: postId, type: 'reel' }
    });

    if (!findReel) {
      throw new Error('reel not found.')
    }

    await UserImage.destroy({
      where: { id: postId, type: 'reel' }
    });


    await LIKE_ACTIVITY.destroy({
      where: { postId: postId },
    });

    res.status(200).json({
      status: "success",
      message: "reel Delete successfully"
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

// interested Section 

const interestedActivities = async (req, res) => {
  try {

    const { interestedByProfileId, interestedToProfileId } = req.query;

    if (!interestedByProfileId) {
      throw new Error('interestedByProfileId is required.');
    } else if (!interestedToProfileId) {
      throw new Error('interestedToProfileId is required.');
    }

    let likedByUser = await User.findOne({ where: { userId: interestedByProfileId } });
    let likedToUser = await User.findOne({ where: { userId: interestedToProfileId } });

    if (!likedByUser) {
      throw new Error("Couldn't find interestedByProfileId.");
    } else if (!likedToUser) {
      throw new Error("Couldn't find interestedToProfileId.");
    }

    let existingInterested = await INTERESTED.findOne({ where: { interestedByProfileId, interestedToProfileId } });

    if (existingInterested) {

      await existingInterested.destroy();

      const interestedCount = await INTERESTED.count({
        where: {
          interestedToProfileId: existingInterested.interestedToProfileId
        }
      })

      return res.status(200).json({
        status: true,
        message: "Successfully marked as unInterested.",
        data: {
          interestedCount
        }
      });

    }

    const interested = await INTERESTED.create({
      interestedByProfileId,
      interestedToProfileId
    });

    const interestedCount = await INTERESTED.count({
      where: {
        interestedToProfileId: interestedToProfileId
      }
    })

    let response = {
      ...JSON.parse(JSON.stringify(interested)),
      interestedCount
    }

    res.status(200).json({
      status: true,
      message: 'Successfully marked as interested.',
      data: response
    });

  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    });
  }
};

const getInterestedUsers = async (req, res) => {
  try {

    const { userId } = req.query;

    if (!userId) throw new Error('userId is required in query');

    let interestedByProfiles = await INTERESTED.findAll({
      where: {
        interestedByProfileId: userId,
      },
    })

    let interestedToProfiles = await INTERESTED.findAll({
      where: {
        interestedToProfileId: userId
      },
    })

    const interestedByProfilesIds = interestedByProfiles.map(profile => profile.interestedToProfileId);
    const interestedToProfilesIds = interestedToProfiles.map(profile => profile.interestedByProfileId);

    let usersInterestedBy = await USER.findAll({
      where: {
        userId: {
          [Op.in]: interestedToProfilesIds
        },
      },
      attributes: ['profileImage', 'userId', 'name', 'aboutMe', 'city', 'country', 'username',
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM userLikes AS ul
            WHERE ul.userId = users.userId
          )`), 'likeCount'
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM interestedActivities AS i
            WHERE i.interestedToProfileId = users.userId
          )`), 'interestedCount'
        ],
        [
          Sequelize.literal(`(
            SELECT CASE WHEN EXISTS (
              SELECT 1
              FROM userLikes AS ul
              WHERE ul.userId = users.userId
              AND ul.likedBy = ${req.userId}
            ) THEN true ELSE false END
          )`), 'alreadyLiked'
        ],
        [
          Sequelize.literal(`(
            SELECT CASE WHEN EXISTS (
              SELECT 1
              FROM interestedActivities AS i
              WHERE i.interestedByProfileId = ${req.userId}
              AND i.interestedToProfileId = users.userId
            ) THEN true ELSE false END
          )`), 'isInterested'
        ]
      ]
    })

    let usersInterestedTo = await USER.findAll({
      where: {
        userId: {
          [Op.in]: interestedByProfilesIds
        }
      },
      attributes: ['profileImage', 'userId', 'name', 'aboutMe', 'city', 'country', 'username',
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM userLikes AS ul
            WHERE ul.userId = users.userId
          )`), 'likeCount'
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM interestedActivities AS i
            WHERE i.interestedToProfileId = users.userId
          )`), 'interestedCount'
        ],
        [
          Sequelize.literal(`(
            SELECT CASE WHEN EXISTS (
              SELECT 1
              FROM userLikes AS ul
              WHERE ul.userId = users.userId
              AND ul.likedBy = ${req.userId}
            ) THEN true ELSE false END
          )`), 'alreadyLiked'
        ],
        [
          Sequelize.literal(`(
            SELECT CASE WHEN EXISTS (
              SELECT 1
              FROM interestedActivities AS i
              WHERE i.interestedByProfileId = ${req.userId}
              AND i.interestedToProfileId = users.userId
            ) THEN true ELSE false END
          )`), 'isInterested'
        ],
      ]
    })

    usersInterestedBy.forEach(user => {
      user.dataValues.alreadyLiked = Boolean(user.dataValues.alreadyLiked);
      user.dataValues.isInterested = Boolean(user.dataValues.isInterested);
      const profile = interestedToProfiles.find(p => p.interestedByProfileId === user.userId);
      if (profile) {
        user.dataValues.isSeen = Boolean(profile.isSeen);
        user.dataValues.isSeen = Boolean(profile.isSeen);
      }
    });

    usersInterestedTo.forEach(user => {
      user.dataValues.alreadyLiked = Boolean(user.dataValues.alreadyLiked);
      user.dataValues.isInterested = Boolean(user.dataValues.isInterested);
      console.log(JSON.parse(JSON.stringify(interestedToProfiles)), 'interestedToProfiles')
      // const profile = interestedByProfiles.find(p => p.interestedByProfileId === user.userId);
      // if (profile) {
      //   user.dataValues.isSeen = profile.isSeen;
      // }
    });

    await INTERESTED.update(
      { isSeen: 1 },
      {
        where: {
          interestedToProfileId: userId,
          isSeen: 0,
        },
      }
    );

    const response = {
      usersInterestedBy,
      usersInterestedTo: usersInterestedTo.sort((a, b) => (a.dataValues.isSeen === false && b.dataValues.isSeen === true) ? -1 : 1),
    }

    res.status(200).json({
      status: true,
      message: 'interested Users get Successfully.',
      data: response
    });

  } catch (error) {

    res.status(400).json({
      status: 400,
      message: error.message
    });

  }
}

// search for reels and profiles

const searchForReelsAndProfiles = async (req, res) => {
  try {

    const { search, currentUser } = req.query;

    if (!search) {
      throw new Error('please provide a search.')
    }

    const user = await User.findOne({
      where: {
        userId: currentUser
      }
    });

    if (!user) {
      throw new Error('please provide valid user.')
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } }
        ],
        username: {
          [Op.not]: `${_constants.main.adminName}`
        }
      },
      attributes: ['userId', 'username', 'name', 'profileImage', 'city', 'country']
    });

    const hashtagsAllData = await HASHTAG.findAll({
      where: {
        name: { [Op.like]: `%${search}%` }
      },
      attributes: ['postId', 'name']
    });

    const hashTags = JSON.parse(JSON.stringify(hashtagsAllData))

    const reelsArray = [];
    const imagesArray = [];
    const videosArray = [];

    for (const iterator of hashTags) {

      let singleFile = await UserImage.findOne({
        where: {
          id: iterator.postId,
          // userId: {
          //   [Op.ne]: currentUser
          // },
          type: {
            [Op.ne]: 'story'
          },
          [Op.and]: sequelize.literal(`EXISTS (SELECT 1 FROM users WHERE users.userId = userFiles.userId)`)
        }
      })

      if (!singleFile) {
        continue;
      }

      if (singleFile.type === 'reel') {

        let singleReel = JSON.parse(JSON.stringify(singleFile));

        let userLikes = await LIKE_ACTIVITY.findAll({
          where: { postId: singleReel.id }
        });

        let user = await User.findOne({
          where: { userId: singleReel.userId }
        });

        let allHashTagsData = await HASHTAG.findAll({
          where: { postId: singleReel.id }
        });

        const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

        let hashTagArray = [];

        for (let i = 0; i < allTagsData.length; i++) {
          const hashTag = allTagsData[i];
          hashTagArray.push(hashTag.name)
        }

        let isLiked = false;
        if (userLikes && userLikes.length > 0) {
          for (let index = 0; index < userLikes?.length; index++) {
            const element = userLikes[index];
            if (element.likedBy == currentUser) {
              isLiked = true;
            }
          }
        }

        let updatedReel = {
          ...singleReel,
          username: user?.username ?? null,
          name: user?.name ?? null,
          profileImage: user?.profileImage ?? null,
          hashTags: hashTagArray?.length > 0 ? hashTagArray : [],
          likes: userLikes?.length > 0 ? userLikes?.length : 0,
          isLiked: isLiked
        };

        reelsArray.push(updatedReel)

      } else if (singleFile.type === 'image') {

        let singleImage = JSON.parse(JSON.stringify(singleFile));

        let userLikes = await LIKE_ACTIVITY.findAll({
          where: { postId: singleImage.id }
        });

        let user = await User.findOne({
          where: { userId: singleImage.userId }
        });

        let allHashTagsData = await HASHTAG.findAll({
          where: { postId: singleImage.id }
        });

        const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

        let hashTagArray = [];

        for (let i = 0; i < allTagsData.length; i++) {
          const hashTag = allTagsData[i];
          hashTagArray.push(hashTag.name)
        }

        let isLiked = false;
        if (userLikes && userLikes.length > 0) {
          for (let index = 0; index < userLikes?.length; index++) {
            const element = userLikes[index];
            if (element.likedBy == currentUser) {
              isLiked = true;
            }
          }
        }

        let updatedImage = {
          ...singleImage,
          username: user?.username ?? null,
          name: user?.name ?? null,
          profileImage: user?.profileImage ?? null,
          hashTags: hashTagArray.length > 0 ? hashTagArray : [],
          likes: userLikes?.length > 0 ? userLikes?.length : 0,
          isLiked: isLiked
        };

        imagesArray.push(updatedImage)

      } else if (singleFile.type === 'Video') {

        let singleVideo = JSON.parse(JSON.stringify(singleFile));

        let userLikes = await LIKE_ACTIVITY.findAll({
          where: { postId: singleVideo.id }
        });

        let user = await User.findOne({
          where: { userId: singleVideo.userId }
        });

        let allHashTagsData = await HASHTAG.findAll({
          where: { postId: singleVideo.id }
        });

        const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

        let hashTagArray = [];

        for (let i = 0; i < allTagsData.length; i++) {
          const hashTag = allTagsData[i];
          hashTagArray.push(hashTag.name)
        }

        let isLiked = false;
        if (userLikes && userLikes.length > 0) {
          for (let index = 0; index < userLikes?.length; index++) {
            const element = userLikes[index];
            if (element.likedBy == currentUser) {
              isLiked = true;
            }
          }
        }

        let updatedVideo = {
          ...singleVideo,
          username: user?.username ?? null,
          name: user?.name ?? null,
          profileImage: user?.profileImage ?? null,
          hashTags: hashTagArray?.length > 0 ? hashTagArray : [],
          likes: userLikes?.length > 0 ? userLikes?.length : 0,
          isLiked: isLiked
        };
        videosArray.push(updatedVideo)
      }

    }

    const response = {
      users,
      reels: reelsArray,
      videos: videosArray,
      images: imagesArray
    }

    res.status(200).json({
      status: "success",
      message: "search successfully",
      data: response
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

const getMultiplePosts = async (req, res) => {
  try {

    let { limit, currentUser } = req.query
    let { cacheArray } = req.body;

    if (!cacheArray) {
      cacheArray = []
    }

    if (!limit) {
      throw new Error('please provide a limit.')
    } else if (!currentUser) {
      throw new Error('please provide a currentUser.')
    }

    if (typeof cacheArray === 'string') {
      try {
        cacheArray = JSON.parse(cacheArray);
      } catch (error) {
        throw new Error('cacheArray must be a valid JSON array.');
      }
    }

    let randomPostsArray = [];

    const user = await User.findOne({
      where: {
        userId: currentUser
      }
    })

    if (!user) {
      throw new Error('please provide valid user.')
    }

    const excludeIds = cacheArray.join(',');

    // userId != ${currentUser}
    const randomPosts = await sequelize.query(
      `SELECT * FROM userFiles
      WHERE ${excludeIds ? `id NOT IN (${excludeIds}) AND` : ``} 
      type != "story" 
      AND EXISTS (SELECT 1 FROM users WHERE users.userId = userFiles.userId) 
      ORDER BY RAND() 
      LIMIT ${limit}
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (!randomPosts || randomPosts.length === 0) {
      throw new Error("Couldn't find random reels");
    }

    for (let singlePost of randomPosts) {

      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: singlePost.id }
      });

      let user = await User.findOne({
        where: { userId: singlePost.userId }
      });

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: singlePost.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      let isLiked = false;
      if (userLikes && userLikes.length > 0) {
        for (let index = 0; index < userLikes?.length; index++) {
          const element = userLikes[index];
          if (element.likedBy == currentUser) {
            isLiked = true;
          }
        }
      }

      let findInterest = await INTERESTED.findOne({
        where: {
          interestedByProfileId: req.userId,
          interestedToProfileId: user.userId
        }
      })

      const interestedCount = await INTERESTED.count({
        where: {
          interestedToProfileId: user.userId
        }
      })

      let updatedPost = {
        ...singlePost,
        username: user?.username ? user?.username : null,
        name: user?.name ? user?.name : null,
        profileImage: user?.profileImage ? user.profileImage : null,
        hashTags: hashTagArray.length > 0 ? hashTagArray : [],
        likes: userLikes?.length > 0 ? userLikes?.length : 0,
        isLiked: isLiked,
        isInterested: findInterest ? true : false,
        interestedCount,
      };
      randomPostsArray.push(updatedPost);
    }

    res.status(200).json({
      status: "success",
      message: "reels get successfully",
      data: randomPostsArray
    });

  } catch (error) {
    console.error("Error fetching reels:", error);
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

const addBadgePoints = async (req, res) => {
  try {

    const { userId, points } = req.query;

    if (!userId) {
      throw new Error('please provide a userId.')
    } else if (!points) {
      throw new Error('please provide a points.')
    }

    if (isNaN(points)) {
      throw new Error('points must be a valid number');
    }

    const user = await User.findOne({
      where: { userId }
    })

    if (!user) {
      throw new Error('user not found.')
    }

    const updatedPoints = user.badge_points !== null ? parseInt(user.badge_points) + parseInt(points) : points;

    await User.update(
      { badge_points: updatedPoints },
      { where: { userId } }
    );

    const updatedUser = await User.findOne({
      where: { userId },
      attributes: ["username", "name", "userId", "badge_points"]
    })

    res.status(200).json({
      status: "success",
      message: "points add successfully",
      data: updatedUser
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}
// reel end

// story Functoinality

const getStory = async (req, res) => {
  try {
    const userId = req.params.id

    if (!userId) {
      throw new Error('please provide a valid userId')
    }

    const user = await User.findOne({
      where: {
        userId
      }
    })

    if (!user) {
      throw new Error('user not found.')
    }

    const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000)).getTime(); // Get the timestamp for 24 hours ago

    const stories = await UserImage.findAll({
      where: {
        type: 'story',
        userId,
        createdAt: {
          [Op.gte]: twentyFourHoursAgo // Filter stories created within the last 24 hours
        }
      },
      order: [['createdAt', 'DESC']], // For MySQL
    });

    const filteredStoriesByUser = {};

    stories.forEach(story => {
      const { userId } = story;
      if (!filteredStoriesByUser[userId]) {
        filteredStoriesByUser[userId] = [];
      }
      filteredStoriesByUser[userId].push(story);
    });

    const getUser = async (userId) => {

      let findUser = await User.findOne({
        where: {
          userId: userId
        }
      });

      if (!findUser) {
        return null;
      } else {
        return findUser;
      }
    };

    const result = Object.keys(filteredStoriesByUser).map(userId => ({
      userId,
      stories: filteredStoriesByUser[userId].map(async story => {
        // let { userId } = story;

        let isSeen = await STORY_SEEN.findOne({
          where: {
            storyId: story.id,
            viewerId: req.userId
          }
        });

        const likeCount = await LIKE_ACTIVITY.count({
          where: {
            postId: story.id,
          }
        });

        let isLiked = await LIKE_ACTIVITY.findOne({
          where: {
            postId: story.id,
            likedBy: req.userId
          }
        });

        return {
          ...story.dataValues,
          isSeen: isSeen ? true : false,
          isLiked: isLiked ? true : false,
          likeCount
        };
      }),
    }));

    const resolvedResult = await Promise.all(result.map(async user => {
      const userDetails = await getUser(user.userId);
      return {
        userId: userDetails.userId,
        profileImage: userDetails.profileImage,
        username: userDetails.username,
        name: userDetails.name,
        stories: await Promise.all(user.stories)
      };
    }));

    resolvedResult.forEach(user => {
      user.stories.sort((a, b) => a.createdAt - b.createdAt);
    });

    res.status(200).json({
      status: "success",
      message: "story get successfully",
      data: resolvedResult
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

const storySeen = async (req, res) => {
  try {

    let { postId, userId } = req.query;

    if (!postId) {
      throw new Error('postId is required.');
    } else if (!userId) {
      throw new Error('userId is required.');
    }

    const findStory = await UserImage.findOne({
      where: {
        // [Op.like]: `%${endsWithUrlForFile}`.
        id: postId,
        type: 'story'
      }
    });

    if (findStory) {

      const isViewer = await STORY_SEEN.findOne({
        where: {
          storyId: findStory?.id,
          viewerId: userId
        }
      })
      if (!isViewer) {
        await STORY_SEEN.create({
          storyId: findStory.id,
          viewerId: userId
        })
      }
    }

    res.status(200).json({
      status: "success",
      message: "Story seen successfully."
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

const getAllStory = async (req, res) => {
  try {

    let { currentUser } = req.query;
    let { usersCacheArray, limit } = req.body;

    if (!currentUser) {
      throw new Error('please provide a currentUser');
    }

    const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000)).getTime(); // Get the timestamp for 24 hours ago

    let stories = await UserImage.findAll({
      where: {
        type: 'story',
        userId: {
          [Op.and]: {
            [Op.ne]: currentUser,
            [Op.notIn]: usersCacheArray
          }
        },
        createdAt: {
          [Op.gte]: twentyFourHoursAgo // Filter stories created within the last 24 hours
        },
      },
      order: Sequelize.literal('RAND()'), // For MySQL
    });

    let filteredStoriesByUser = {};

    stories.forEach(story => {
      const { userId } = story;
      if (!filteredStoriesByUser[userId]) {
        filteredStoriesByUser[userId] = [];
      }
      filteredStoriesByUser[userId].push(story);
    });

    const getUser = async (userId) => {
      let findUser = await User.findOne({
        where: {
          userId: userId
        }
      });
      if (!findUser) {
        return null;
      } else {
        return findUser;
      }
    };

    const result = Object.keys(filteredStoriesByUser).map(userId => ({
      userId,
      stories: filteredStoriesByUser[userId].map(async story => {

        let isSeen = await STORY_SEEN.findOne({
          where: {
            storyId: story.id,
            viewerId: currentUser
          }
        });

        const likeCount = await LIKE_ACTIVITY.count({
          where: {
            postId: story.id,
          }
        });

        let isLiked = await LIKE_ACTIVITY.findOne({
          where: {
            postId: story.id,
            likedBy: currentUser
          }
        });


        return {
          ...story.dataValues,
          isSeen: isSeen ? true : false,
          isLiked: isLiked ? true : false,
          likeCount,

        };
      }),
    }));

    let resolvedResult = await Promise.all(result.map(async user => {

      const userDetails = await getUser(user.userId);

      let findInterest = await INTERESTED.findOne({
        where: {
          interestedByProfileId: req.userId,
          interestedToProfileId: user.userId
        }
      })

      const interestedCount = await INTERESTED.count({
        where: {
          interestedToProfileId: user.userId
        }
      })

      return {
        userId: user.userId || null,
        profileImage: userDetails?.profileImage || null,
        username: userDetails?.username || null,
        name: userDetails?.name || null,
        isInterested: findInterest ? true : false,
        interestedCount,
        stories: await Promise.all(user.stories)

      };

    }));

    resolvedResult.forEach(user => {
      user.stories.sort((a, b) => a.createdAt - b.createdAt);
    })

    resolvedResult = resolvedResult.slice(0, limit)

    res.status(200).json({
      status: "success",
      message: "stories get successfully",
      data: resolvedResult
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

const getFeedUser = async (req, res, next) => {

  try {

    let userId = req.query.userId;
    let currentUser = req.query.currentUser

    var user = await User.findOne({ where: { userId: userId } })

    if (!user) {
      throw new Error('User not found.')
    }

    var fileImages = await UserImage.findAll({
      where: { userId: userId, type: 'image', }
      , order: [['createdAt', 'DESC']]
    })

    var fileVideos = await UserImage.findAll({
      where: { userId: userId, type: 'video', }
      , order: [['createdAt', 'DESC']]
    })

    var fileReels = await UserImage.findAll({
      where: { userId: userId, type: 'reel', }
      , order: [['createdAt', 'DESC']]
    })

    let findInterest = await INTERESTED.findOne({
      where: {
        interestedByProfileId: currentUser,
        interestedToProfileId: user.userId
      }
    })

    const interestedCount = await INTERESTED.count({
      where: {
        interestedToProfileId: user.userId
      }
    })

    user.dataValues.isInterested = findInterest ? true : false;
    user.dataValues.interestedCount = interestedCount

    let reelsArray = []
    for (let singleReel of fileReels) {

      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: singleReel.id }
      });

      let users = await User.findOne({
        where: { userId: singleReel.userId }
      });

      let updatedReel = {
        ...singleReel.dataValues,
        username: users.username ?? null,
        name: users.name ?? null,
        profileImage: users.profileImage ?? null,
        likes: 0,
        hashTags: [],
        isLiked: false
      };

      if (userLikes && userLikes.length > 0) {
        updatedReel.likes = userLikes ? userLikes?.length : 0;
        for (let index = 0; index < userLikes.length; index++) {
          const element = userLikes[index];
          if (element.likedBy == currentUser) {
            updatedReel.isLiked = true;
          }
        }
      }

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: singleReel.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      if (hashTagArray && hashTagArray.length > 0) {
        updatedReel.hashTags = hashTagArray ? hashTagArray : [];
      }
      reelsArray.push(updatedReel);
    }

    let imageArray = [];
    for (let singleReel of fileImages) {
      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: singleReel.id }
      });

      let users = await User.findOne({
        where: { userId: singleReel.userId }
      });

      let updatedReel = {
        ...singleReel.dataValues,
        username: users.username ?? null,
        name: users.name ?? null,
        profileImage: users.profileImage ?? null,
        likes: 0,
        hashTags: [],
        isLiked: false
      };

      if (userLikes && userLikes.length > 0) {
        updatedReel.likes = userLikes ? userLikes.length : 0;
        for (let index = 0; index < userLikes.length; index++) {
          const element = userLikes[index];
          if (element.likedBy == currentUser) {
            updatedReel.isLiked = true;
          }
        }
      }

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: singleReel.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      if (hashTagArray && hashTagArray.length > 0) {
        updatedReel.hashTags = hashTagArray ? hashTagArray : [];
      }
      imageArray.push(updatedReel);
    }

    let videoArray = [];
    for (let singleReel of fileVideos) {
      let userLikes = await LIKE_ACTIVITY.findAll({
        where: { postId: singleReel.id }
      });

      let users = await User.findOne({
        where: { userId: singleReel.userId }
      });

      let updatedReel = {
        ...singleReel.dataValues,
        username: users.username ?? null,
        name: users.name ?? null,
        profileImage: users.profileImage ?? null,
        likes: 0,
        hashTags: [],
        isLiked: false
      };
      if (userLikes && userLikes.length > 0) {
        updatedReel.likes = userLikes ? userLikes.length : 0;
        for (let index = 0; index < userLikes.length; index++) {
          const element = userLikes[index];
          if (element.likedBy == currentUser) {
            updatedReel.isLiked = true;
          }
        }
      }

      let allHashTagsData = await HASHTAG.findAll({
        where: { postId: singleReel.id }
      });

      const allTagsData = JSON.parse(JSON.stringify(allHashTagsData));

      let hashTagArray = [];
      for (let i = 0; i < allTagsData.length; i++) {
        const hashTag = allTagsData[i];
        hashTagArray.push(hashTag.name)
      }

      if (hashTagArray && hashTagArray.length > 0) {
        updatedReel.hashTags = hashTagArray ? hashTagArray : [];
      }
      videoArray.push(updatedReel);
    }

    var response = {
      user: user,
      images: imageArray,
      videos: videoArray,
      reels: reelsArray
    }

    res.status(200).json({
      status: true,
      message: "get feed of user successfully.",
      data: response
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    })
  }
};

const chatReaction = async (req, res) => {
  try {
    const { userId, chatId, reaction, sendTo } = req.body;

    if (!userId) {
      throw new Error('userId is required.');
    } else if (!chatId) {
      throw new Error('chatId is required.');
    } else if (!reaction) {
      throw new Error('reaction is required.');
    }

    let sendUser = await User.findOne({
      where: {
        userId: sendTo,
      },
    });

    let findMessage = await chat.findOne({
      where: {
        id: chatId
      }
    })

    if (!findMessage) {
      throw new Error('please provide valid messageId.')
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

    let validIdsForUser = [findMessage?.sender_id, findMessage?.receiver_id]

    if (!validIdsForUser.includes(parseInt(userId))) {
      throw new Error('please provide valid user.')
    }

    let user = await USER.findOne({
      where: {
        userId: userId
      }
    })

    if (!user) {
      throw new Error('please provide valid userId.')
    }

    let exitingReaction = await CHAT_REACTION.findOne({
      where: {
        chatId: chatId, userId: userId
      }
    })

    if (exitingReaction) {

      exitingReaction.reaction = reaction;
      await exitingReaction.save();

      let updatedReaction = await CHAT_REACTION.findOne({
        where: {
          chatId: chatId, userId: userId
        }
      })

    } else {
      // Create a new reaction
      let newReaction = await CHAT_REACTION.create({
        userId,
        chatId,
        reaction
      });
    }

    var finalChat = await CHAT_REACTION.findOne({ where: { chatId: chatId } });


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

    console.log("call brodacst : " + JSON.parse(JSON.stringify(chat_list)));

    await broadcastMessage(chat_list);

    // var notification = {
    //   title: "Notification",
    //   type: 0,
    //   body: `you received a new message form ${sender.name}`,
    // };

    console.log("token : " + sendUser.device_token);
    if (userId !== sendTo) {
      if (sendUser.device_token && user.name) {
        const message = {
          data: {
            title: "Notification",
            body: `${user.name} reacted your message`
          },
          notification: {
            title: 'Notification',
            body: `${user.name} reacted your message`
          },
          token: sendUser.device_token
        };
        await sendToSingleUser(message);
      }
    }
    // Send success response
    res.status(200).json({
      status: "success",
      message: "Reaction added successfully",
      data: finalChat
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

const removeReaction = async (req, res) => {
  try {

    const { userId, chatId } = req.body;

    if (!userId) {
      throw new Error('userId is required.');
    } else if (!chatId) {
      throw new Error('chatId is required.');
    }

    let findMessage = await chat.findOne({
      where: {
        id: chatId
      }
    })

    if (!findMessage) {
      throw new Error('please provide valid messageId.')
    }

    let user = await USER.findOne({
      where: {
        userId: userId
      }
    })

    if (!user) {
      throw new Error('please provide valid userId.')
    }

    let exitingReaction = await CHAT_REACTION.findOne({
      where: {
        chatId: chatId, userId: userId
      }
    })

    if (!exitingReaction) {
      throw new Error('please provide valid details.')
    }

    await exitingReaction.destroy();

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

    await broadcastMessage(chat_list);

    return res.status(200).json({
      status: "success",
      message: "Reaction remove successfully"
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

const userFilters = async (req, res, next) => {
  try {

    const baseQuery = {

    };

    // genderId filter
    if (req.body.intrestedIn) {
      baseQuery.genderId = req.body.intrestedIn
    }

    // Add city filter if it exists
    if (req.body.city && typeof req.body.city === 'string' && req.body.city.trim() !== '') {
      baseQuery.city = req.body.city;
    }

    // Add country filter if it exists and is a non-empty string
    if (req.body.country && typeof req.body.country === 'string' && req.body.country.trim() !== '') {
      baseQuery.country = req.body.country;
    }

    // Add age filter if ageStart and ageEnd are provided
    if (req.body.ageStart && req.body.ageEnd) {
      baseQuery.age = {
        [Op.between]: [req.body.ageStart, req.body.ageEnd],
      };
    }

    baseQuery.username = {
      [Op.ne]: `${_constants.main.adminName}`,
    }

    var user = await User.findAll({
      where: baseQuery,
      order: sequelize.literal('RAND()')
    });

    let allAdvertiseData = await ADVERTISE_MENT.findAll({ order: sequelize.literal('RAND()') })
    let allAdvertiseMent = JSON.parse(JSON.stringify(allAdvertiseData))
    let count = 0;
    var response = [];

    let newQuery = {
      date: {
        [Op.gt]: new Date()
      }
    }

    if (req.body.city && typeof req.body.city === 'string' && req.body.city.trim() !== '') {
      newQuery.city = req.body.city;
    }

    if (req.body.country && typeof req.body.country === 'string' && req.body.country.trim() !== '') {
      newQuery.country = req.body.country;
    }

    const latestUserActivities = await LiveActivity.findAll({
      where: newQuery,
      order: [['createdAt', 'DESC']],
      limit: 2
    });

    const latestUserActivityIds = latestUserActivities.map(activity => activity.id);

    newQuery.id = {
      [Op.notIn]: [...latestUserActivityIds]
    }

    let otherActivities = await LiveActivity.findAll({
      where: newQuery,
      order: sequelize.literal('RAND()')
    })

    const activities = [...latestUserActivities, ...otherActivities];

    let data_with_details = [];

    for (var i = 0; i < activities.length; i++) {

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
          user_id: req.body.userId,
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

    for (var i = 0; i < user.length; i++) {

      if (user[i].userId != req.body.userId) {

        var find = await USER_LIKE.findAll({
          where: {
            userId: user[i].userId,
            // likedBy: likedBy,
          },
        });

        var fileImages = await UserImage.findAll({
          where: { userId: user[i].userId, type: 'image', }
          , order: [['createdAt', 'DESC']]
        })

        var fileVideos = await UserImage.findOne({
          where: {
            // id: {
            //   [Op.notIn]: videosCacheArray ? videosCacheArray : []
            // },
            userId: user[i].userId,
            type: {
              [Op.in]: ['Video']
            },
          },
          order: sequelize.literal('RAND()')
        })

        let findInterest = await INTERESTED.findOne({
          where: {
            interestedByProfileId: req.userId,
            interestedToProfileId: user[i].userId
          }
        })

        const interestedCount = await INTERESTED.count({
          where: {
            interestedToProfileId: user[i].userId
          }
        })

        var alreadyLiked = find.some(like => like.likedBy.toString() === req.body.userId.toString());

        if (i % 5 === 0 && allAdvertiseMent[count] && i != 0) {

          var obj = {
            user: {
              ...user[i].dataValues,
              likes: find.length,
              alreadyLiked: alreadyLiked,
              isInterested: findInterest ? true : false,
              interestedCount,
              images: fileImages,
              video: fileVideos
            },
            advertiseMent: allAdvertiseMent[count],
            activities_data: null
          }
          response.push(obj);
          count++;

        } else if (i % 3 === 0 && activities_data[activities_data_count] && i != 0) {


          var obj = {
            user: {
              ...user[i].dataValues,
              likes: find.length,
              alreadyLiked: alreadyLiked,
              isInterested: findInterest ? true : false,
              interestedCount,
              images: fileImages,
              video: fileVideos
            },
            advertiseMent: null,
            activities_data: activities_data[activities_data_count]
          }
          response.push(obj);

          activities_data_count++;

        } else {

          var obj = {
            user: {
              ...user[i].dataValues,
              likes: find.length,
              alreadyLiked: alreadyLiked,
              isInterested: findInterest ? true : false,
              interestedCount,
              images: fileImages,
              video: fileVideos
            },
            advertiseMent: null,
            activities_data: null
          }
          response.push(obj);
        }
      }
    }

    if (user.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No users found with the given filter criteria."
      });
    }

    let unseenInterestedCount = await INTERESTED.count({
      where: {
        interestedToProfileId: req.userId,
        isSeen: 0
      },
    })

    let unseenMatchCount = await getUnseenMatchedUserCount(req.userId)

    res.status(200).json({
      status: true,
      message: "User successfully get by filter ",
      unseenInterestedCount: unseenInterestedCount,
      unseenMatchCount: unseenMatchCount,
      count: response.length,
      data: response,
      newData: activities_data
    })

  } catch (error) {

    console.error(error);
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
}

// const pushNotifications = async(req, res, next) => {
//   try {
//     const { device_token, title, body } = req.body;

//     // Fetch recipient's FCM token from the database
//     const [results] = await db.promise().query('SELECT fcm_token FROM users WHERE user_id = ?', [recipientId]);

//     if (results.length === 0 || !results[0].fcm_token) {
//       return res.status(404).json({ status: false, message: 'Recipient not found or FCM token not available' });
//     }

//     const token = results[0].fcm_token;

//     const message = {
//       token,
//       notification: {
//         title,
//         body,
//       },
//     };
//     await admin.messaging().send(message);

//     res.status(200).json({
//       status : true,
//       message : "User successfully send notification",
//     })
//   } catch (error) {
//     res.status(500).json({
//       status : false,
//       message : error.message
//     })
//   }
// }
//----------------------------------------------------------------

const updateAvailability = async (req, res, next) => {
  try {
    const body = req.body;
    const params = req.params;
    var user = await User.findOne({
      where: { userId: params.userId },
      attributes: ['userId', 'availableForPick'],
    });
    if (user === null)
      return res.send(
        _response.getFailResponse(_constants.message.notFound, null, 400)
      );

    user.availableForPick = body.availableForPick;
    await user.save();
    return res.send(
      _response.getSuccessResponse(_constants.messages.updated, null)
    );
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const forgetPassword = async (req, res, next) => {
  try {

    var email = req.body.email;
    console.log("name ", email);
    if (email == null) {
      throw new Error("Please provide email.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      throw new Error(
        "'@' and '.' must be used in Email address like 'test@example.com'."
      );
    }
    let user = await User.findOne({ where: { email: req.body.email } });
    // const user = await User.findOne({
    //   where: { username: body.username },
    //   attributes: ['userId', 'username'],
    // });
    if (!user) {
      throw new Error("User not found")
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    console.log("Forgot password code: " + code);


    // await ForgetPasswords.deleteMany({where: { email: req.body.email }});

    let otpdata = new ForgetPassword({
      code: code,
      username: user.username
      // email: user.email,
    });
    let otpResponse = await otpdata.save();

    async function main() {
      //let testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: "sayyesadmin.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "noreply@sayyesadmin.com", // generated ethereal user
          pass: "noreply_2015", // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: "noreply@sayyesadmin.com", // sender address
        to: req.body.email, // list of receivers   "bipin.kheni.bk.bk21@gmail.com"
        subject: "Hello ✔", // Subject line
        text: "code:" + code, // plain text body
      });

      console.log("Message sent: %s", "Check your email Id.");
      console.log(
        "Preview URL: %s",
        nodemailer.getTestMessageUrl("Check your email.")
      );
    }
    main().catch(console.error);
    res.status(200).json({
      status: "success",
      message: "forget password successfully",
      data: user
    })
    return;
    /*const result = await _twilioService.sendMessage(user.phoneNumber, code);
    if (result) {
      var existingCode = await ForgetPassword.findOne({
        where: { username: body.username },
      });
      if (existingCode != null) {
        existingCode.code = code;
        await existingCode.save();
      } else {
        const fpToSave = new ForgetPassword({
          username: body.username,
          code: code,
        });
        await fpToSave.save();
      }

      return res.send(
        _response.getSuccessResponse(_constants.messages.codeSent, null)
      );
    } else {
      return res.send(
        _response.getSuccessResponse(_constants.messages.codeNotSent, null)
      );
    }*/

  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message
    })
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.findOne({
      where: {
        userId: body.userId,
      },
      // attributes: ['userId', 'username', 'password'],
    });
    if (user === null)
      return res.send(
        _response.getFailResponse(_constants.messages.notFound, null, 400)
      );

    const pswrd = await ForgetPassword.findOne({
      where: {
        code: body.code,
      },
    });
    console.log(pswrd);
    if (pswrd === null)
      return res.send(
        _response.getFailResponse(_constants.messages.notFound, null, 400)
      );

    await user.update({
      password: bcrypt.hashSync(body.password, _constants.main.saltRound),
    });
    await ForgetPassword.destroy({
      where: { code: body.code },
    });
    return res.send(
      _response.getSuccessResponse(_constants.messages.passwordUpdated, null)
    );
  } catch (e) {
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};
//admin code
const Adminlogin = async (req, res) => {
  try {
    console.log(req.body, 'jitendra kumar');
    var adminLogin = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    var password = await bcrypt.compare(
      `${req.body.password}`,
      `${adminLogin.password}`
    );
    if (password) {
      console.log('fdsfdsfdsfds');
      const loginResponse = await createLoginResponsedata(adminLogin);
      console.log('fdsfdsfdsfds', loginResponse);
      if (adminLogin) {
        return res.json({
          message: 'login',
          status: 200,
          success: true,
          data: loginResponse,
        });
      }
    } else {
      return res.json({
        message: 'Wrong credential',
        status: 400,
        success: false,
      });
    }
  } catch (e) {
    console.log(e);
    return res.send(_response.getFailResponse(e.message, null, 400));
  }
};

const Dashboard = async (req, res) => {
  try {
    var userlist = await User.findAll({
      where: {
        [Op.ne]: `${_constants.main.adminName}`
      }
    });
    var notificaitonlist = await Notification.findAll({});

    var LiveActivitydata = await LiveActivity.findAll();

    var male = await User.findAll({
      where: {
        genderId: 1,
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      },
      order: sequelize.literal('RAND()')
    });
    var intrested_in_male = await User.findAll({
      where: {
        intrestedIn: 1,
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      },
    });
    var femaile = await User.findAll({
      where: {
        genderId: 2,
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      },
    });
    var intrested_in_femaile = await User.findAll({
      where: {
        intrestedIn: 2,
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      },
    });
    var d = new Date();
    d.setDate(d.getDate() - 7);

    var a = d;
    var b = moment().format('YYYY-MM-DD');
    var userlistdata = [];
    for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
      console.log(m.format('YYYY-MM-DD'));
      var maledata = await User.findAll({
        where: {
          where: sequelize.where(
            sequelize.fn('date', sequelize.col('createdAt')),
            '=',
            m.format('YYYY-MM-DD')
          ),
          genderId: 1,
          username: {
            [Op.ne]: `${_constants.main.adminName}`
          }
        },
      });
      var female = await User.findAll({
        where: {
          where: sequelize.where(
            sequelize.fn('date', sequelize.col('createdAt')),
            '=',
            m.format('YYYY-MM-DD')
          ),
          genderId: 2,
          username: {
            [Op.ne]: `${_constants.main.adminName}`
          }
        },
      });
      var other = await User.findAll({
        where: {
          where: sequelize.where(
            sequelize.fn('date', sequelize.col('createdAt')),
            '=',
            m.format('YYYY-MM-DD')
          ),
          genderId: 0,
          username: {
            [Op.ne]: `${_constants.main.adminName}`
          }
        },
      });
      var datauser = {
        createdAt: m.format('YYYY-MM-DD'),
        maledata: maledata.length,
        female: female.length,
        other: other.length,
      };
      userlistdata.push(datauser);
    }

    var data = {
      total_userlist: userlist.length,
      total_intrested_in_femaile: intrested_in_femaile.length,
      total_femaile: femaile.length,
      total_intrested_in_male: intrested_in_male.length,
      total_male: male.length,
      toatal_notificaitonlist: notificaitonlist.length,
      total_LiveActivitydata: LiveActivitydata.length,
      userlistdata: userlistdata,
    };
    if (data) {
      return res.json({
        message: 'Dashboard data',
        status: 200,
        success: true,
        data: data,
      });
    } else {
      return res.json({
        message: 'no data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const Userlist = async (req, res) => {
  try {
    var userlistdata = await User.findAll({
      where: {
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      }
    });
    var male = await User.findAll({
      where: {
        genderId: 1,
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      },
    });
    var female = await User.findAll({
      where: {
        genderId: 2,
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      },
    });

    if (userlistdata) {
      return res.json({
        message: 'user list',
        status: 200,
        success: true,
        data: userlistdata,
      });
    } else {
      return res.json({
        message: 'no data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const adminprofile = async (req, res) => {
  try {
    console.log('req');
    var userlistdata = await User.findAll({
      where: {
        userId: req.params.adminid,
      },
    });
    if (userlistdata) {
      return res.json({
        message: 'user list',
        status: 200,
        success: true,
        data: userlistdata,
      });
    } else {
      return res.json({
        message: 'no data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const changepassword = async (req, res) => {
  try {
    var adminLogin = await User.findOne({
      where: {
        userId: req.body.user_id,
      },
    });

    var password = await bcrypt.compare(
      `${req.body.oldpassword}`,
      `${adminLogin.password}`
    );

    if (password) {
      var passsworddata = await bcrypt.hash(req.body.new_password, 11);
      console.log(passsworddata, 'datasdafdfddafsfddfafadfs');
      var adminLogin = await User.update(
        {
          password: passsworddata,
        },
        { where: { userId: req.body.user_id } }
      );
      if (adminLogin) {
        return res.json({
          message: 'Your passsword has been successfully change',
          status: 200,
          success: true,
        });
      } else {
        return res.json({
          message: 'Please try again',
          status: 400,
          success: false,
        });
      }
    } else {
      return res.json({
        message: 'Old password not matched',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const changemail = async (req, res) => {
  console.log(req.body);
  try {
    var adminLogin = await User.findOne({
      where: {
        userId: req.body.user_id,
      },
    });

    var password = await bcrypt.compare(
      `${req.body.password}`,
      `${adminLogin.password}`
    );

    if (password) {
      var adminLogin = await User.update(
        {
          email: req.body.email,
        },
        { where: { userId: req.body.user_id } }
      );
      if (adminLogin) {
        return res.json({
          message: 'Your email has been successfully change',
          status: 200,
          success: true,
        });
      } else {
        return res.json({
          message: 'Please try again',
          status: 400,
          success: false,
        });
      }
    } else {
      return res.json({
        message: 'Password not matched',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const userfilter = async (req, res) => {
  try {
    if (req.body.search != '') {
      var userlist = await User.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: '%' + req.body.search + '%',
              },
            },
            {
              zipCode: {
                [Op.like]: '%' + req.body.search + '%',
              },
            },
          ],
          username: {
            [Op.ne]: `${_constants.main.adminName}`
          }
        },
      });
    } else if (
      req.body.genderId != '' ||
      req.body.intrestedIn != '' ||
      req.body.country != '' ||
      req.body.birthday != ''
    ) {
      var userlist = await User.findAll({
        where: {
          genderId: {
            [Op.like]: '%' + req.body.genderId + '%',
          },
          intrestedIn: {
            [Op.like]: '%' + req.body.intrestedIn + '%',
          },
          country: {
            [Op.like]: '%' + req.body.country + '%',
          },
          birthday: {
            [Op.like]: '%' + req.body.birthday + '%',
          },
          username: {
            [Op.ne]: `${_constants.main.adminName}`
          }
        },
      });
      console.log('dsffdssfdfddfs', userlist);
    } else {
      userlist = [];
    }

    // where: {
    //   genderId: {
    //     [Op.like]: '%' + req.body.genderId + '%',
    //   },
    //   intrestedIn: {
    //     [Op.like]: '%' + req.body.intrestedIn + '%',
    //   },
    //   country: {
    //     [Op.like]: '%' + req.body.country + '%',
    //   },
    //   birthday: {
    //     [Op.like]: '%' + req.body.birthday + '%',
    //   },
    // },
    var datauserfileter1 = [];
    var datauserfileter = [];
    if (userlist.length > 0) {
      for (var i = 0; i < userlist.length; i++) {
        var userlistdataobj = await User.findOne({
          where: {
            userId: userlist[i].userId,
            genderId: {
              [Op.like]: '%' + req.body.genderId + '%',
            },
            intrestedIn: {
              [Op.like]: '%' + req.body.intrestedIn + '%',
            },
            country: {
              [Op.like]: '%' + req.body.country + '%',
            },
            birthday: {
              [Op.like]: '%' + req.body.birthday + '%',
            },
          },
        });

        var datatuser = userlistdataobj;

        if (datatuser != null) {
          datauserfileter1.push(datatuser);
        }
      }
      datauserfileter.push(datauserfileter1);
    } else {
      var userlistdata = await User.findAll({
        where: {
          username: {
            [Op.ne]: `${_constants.main.adminName}`
          }
        }
      });

      var datatuser = userlistdata;
      datauserfileter.push(datatuser);
    }

    var permanentUser = await User.findAll({
      where: {
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      }
    });

    if (datauserfileter) {
      return res.json({
        message: 'User list',
        status: 200,
        success: true,
        data: datauserfileter,
        permanent_user: [permanentUser],
      });
    } else {
      return res.json({
        message: 'No data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const alerts = async (req, res) => {
  try {
    console.log(moment().format('YYYY-MM-DD'));
    var currentuser = await User.findAll({
      where: {
        where: sequelize.where(
          sequelize.fn('date', sequelize.col('createdAt')),
          '=',
          moment().format('YYYY-MM-DD')
        ),
        delete_notification_status: 0,
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      },
    });
    var currentliveactivities = await LiveActivity.findAll({
      where: {
        where: sequelize.where(
          sequelize.fn('date', sequelize.col('createdAt')),
          '=',
          moment().format('YYYY-MM-DD')
        ),
        delete_notification_status: 0,
      },
    });
    console.log(
      currentuser.length,
      'currentuser >>>>>>>>>>>>>>>>>?????????????????????'
    );
    if (currentuser || currentliveactivities) {
      return res.json({
        message: 'data of alert',
        status: 200,
        success: true,
        total_register_user: currentuser.length,
        currentliveactivities: currentliveactivities.length,
      });
    } else {
      return res.json({
        message: 'No data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const CurrentActivitieslist = async (req, res) => {
  try {
    var currentliveactivities = await LiveActivity.findAll({
      where: {
        where: sequelize.where(
          sequelize.fn('date', sequelize.col('createdAt')),
          '=',
          moment().format('YYYY-MM-DD')
        ),
      },
    });
    var dataliveactivities = [];
    if (currentliveactivities) {
      for (var i = 0; i < currentliveactivities.length; i++) {
        var imageliveactivities = await LiveActivityImage.findAll({
          where: {
            activityId: currentliveactivities[i].id,
          },
        });

        var data = {
          id: currentliveactivities[i].id,
          activityName: currentliveactivities[i].activityName,
          description: currentliveactivities[i].description,
          address: currentliveactivities[i].address,
          date: currentliveactivities[i].date,
          createdAt: currentliveactivities[i].createdAt,
          userId: currentliveactivities[i].userId,
          image: imageliveactivities,
        };

        dataliveactivities.push(data);
      }

      return res.json({
        message: 'No data found',
        status: 200,
        success: true,
        ActivityList: dataliveactivities,
      });
    } else {
      return res.json({
        message: 'No data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const Currentuserlist = async (req, res) => {
  try {
    var currentuser = await User.findAll({
      where: {
        where: sequelize.where(
          sequelize.fn('date', sequelize.col('createdAt')),
          '=',
          moment().format('YYYY-MM-DD')
        ),
        username: {
          [Op.ne]: `${_constants.main.adminName}`
        }
      },
    });
    if (currentuser) {
      return res.json({
        message: 'User list',
        status: 200,
        success: true,
        data: currentuser,
      });
    } else {
      return res.json({
        message: 'No data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const blockuser = async (req, res) => {
  try {
    console.log(req.params, 'sdfffdsfdffdsfds');
    var data = await User.update(
      {
        status: req.params.status,
      },
      {
        where: {
          userId: req.params.userId,
        },
      }
    );
    if (data) {
      return res.json({
        message: 'Status update',
        status: 200,
        success: true,
      });
    } else {
      return res.json({
        message: 'please try again',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const social_login = async (req, res) => {
  try {
    if (req.body.social_type == null && req.body.social_id == null) {
      return res.json({
        status: 400,
        message: 'social type required ,social id required',
      });
    }

    //0 google 1 facebook 2 apple
    if (req.body.social_type == 0) {
      var insert_user_nfo_exists = await User.findOne({
        where: {
          username: req.body.username,
        },
      });
      if (insert_user_nfo_exists) {
        await User.update(
          {
            google_social_id: req.body.social_id,
            device_token: req.body.device_token,
          },
          {
            where: {
              username: req.body.username,
            },
          }
        );

        const loginResponse = await createLoginResponsedata(
          insert_user_nfo_exists
        );
        return res.send(
          _response.getSuccessResponse(
            _constants.messages.login,
            loginResponse,
            null
          )
        );
      } else {
        var insert_user_nfo = await new User();
        insert_user_nfo.google_social_id = req.body.social_id;
        insert_user_nfo.device_token = req.body.device_token;
        insert_user_nfo.username = req.body.username;
        insert_user_nfo.birthday = req.body.birthday;
        insert_user_nfo.name = req.body.name;
        insert_user_nfo.profileImage = req.body.profileImage;
        insert_user_nfo.genderId = req.body.genderId;
        insert_user_nfo.intrestedIn = req.body.intrestedIn;
        insert_user_nfo.zipCode = req.body.zipCode;
        insert_user_nfo.availableForPick = req.body.availableForPick;
        insert_user_nfo.aboutMe = req.body.aboutMe;
        insert_user_nfo.phoneNumberConfirmed = 1;
        insert_user_nfo.save();

        const loginResponse = await createLoginResponsedata(insert_user_nfo);
        return res.send(
          _response.getSuccessResponse(
            _constants.messages.registered,
            loginResponse,
            null
          )
        );
      }
    } else if (req.body.social_type == 1) {
      var insert_user_nfo_exists = await User.findOne({
        where: {
          username: req.body.username,
        },
      });
      if (insert_user_nfo_exists) {
        await User.update(
          {
            facebook_social_id: req.body.social_id,
            device_token: req.body.device_token,
          },
          {
            where: {
              username: req.body.username,
            },
          }
        );
        const loginResponse = await createLoginResponsedata(
          insert_user_nfo_exists
        );
        return res.send(
          _response.getSuccessResponse(
            _constants.messages.login,
            loginResponse,
            null
          )
        );
      } else {
        var insert_user_nfo = await new User();
        insert_user_nfo.facebook_social_id = req.body.social_id;
        insert_user_nfo.device_token = req.body.device_token;
        insert_user_nfo.username = req.body.username;
        insert_user_nfo.birthday = req.body.birthday;
        insert_user_nfo.name = req.body.name;
        insert_user_nfo.profileImage = req.body.profileImage;
        insert_user_nfo.genderId = req.body.genderId;
        insert_user_nfo.intrestedIn = req.body.intrestedIn;
        insert_user_nfo.zipCode = req.body.zipCode;
        insert_user_nfo.availableForPick = req.body.availableForPick;
        insert_user_nfo.aboutMe = req.body.aboutMe;
        insert_user_nfo.phoneNumberConfirmed = 1;
        insert_user_nfo.save();
        const loginResponse = await createLoginResponsedata(insert_user_nfo);
        return res.send(
          _response.getSuccessResponse(
            _constants.messages.registered,
            loginResponse,
            null
          )
        );
      }
    } else if (req.body.social_type == 2) {
      var insert_user_nfo_exists = await User.findOne({
        where: {
          username: req.body.username,
        },
      });
      if (insert_user_nfo_exists) {
        await User.update(
          {
            apple_social_id: req.body.social_id,
            device_token: req.body.device_token,
          },
          {
            where: {
              username: req.body.username,
            },
          }
        );

        const loginResponse = await createLoginResponsedata(
          insert_user_nfo_exists
        );
        return res.send(
          _response.getSuccessResponse(
            _constants.messages.login,
            loginResponse,
            null
          )
        );
      } else {
        var insert_user_nfo = await new User();
        insert_user_nfo.apple_social_id = req.body.social_id;
        insert_user_nfo.device_token = req.body.device_token;
        insert_user_nfo.username = req.body.username;
        insert_user_nfo.birthday = req.body.birthday;
        insert_user_nfo.name = req.body.name;
        insert_user_nfo.profileImage = req.body.profileImage;
        insert_user_nfo.genderId = req.body.genderId;
        insert_user_nfo.intrestedIn = req.body.intrestedIn;
        insert_user_nfo.zipCode = req.body.zipCode;
        insert_user_nfo.availableForPick = req.body.availableForPick;
        insert_user_nfo.aboutMe = req.body.aboutMe;
        insert_user_nfo.phoneNumberConfirmed = 1;

        insert_user_nfo.save();
        const loginResponse = await createLoginResponsedata(insert_user_nfo);
        return res.send(
          _response.getSuccessResponse(
            _constants.messages.registered,
            loginResponse,
            null
          )
        );
      }
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const blockuseruser = async (req, res) => {
  try {
    //block user
    $exist = await Blockuser.findOne({
      where: {
        user_blocked_by: req.params.user_blocked_by,
        blocked_user_id: req.params.blocked_user_id,
      },
    });

    if ($exist) {
      await Blockuser.destroy({
        where: {
          user_blocked_by: req.params.user_blocked_by,
          blocked_user_id: req.params.blocked_user_id,
        },
      });

      let block_list = {
        status: 0,
        user_blocked_by: req.params.user_blocked_by,
        blocked_user_id: req.params.blocked_user_id
      };

      broadcastMessage(block_list);

      return res.json({
        status: 200,
        message: 'Successfully unBlocked',
        success: true,
      });
    }
    else {
      if (req.params.user_blocked_by != req.params.blocked_user_id) {
        var insert = new Blockuser();
        insert.user_blocked_by = req.params.user_blocked_by;
        insert.blocked_user_id = req.params.blocked_user_id;
        insert.save();
        if (insert) {
          let block_list = {
            status: 1,
            user_blocked_by: insert.user_blocked_by,
            blocked_user_id: insert.blocked_user_id
          };
          broadcastMessage(block_list);
          return res.json({
            status: 200,
            message: 'Successfully blocked',
            success: true,
          });
        } else {
          return res.json({
            status: 400,
            message: 'please try again',
            success: false,
          });
        }
      } else {
        return res.json({
          status: 400,
          message: 'please try again',
          success: false,
        });
      }
    }

  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const reportuserlist = async (req, res) => {
  try {
    var userreport = await Userreport.findOne({
      where: {
        user_id: req.params.userId,
        report_to: req.params.report_to,
      },
    });
    if (userreport) {
      return res.json({
        status: 400,
        message: 'You are already report',
        success: false,
      });
    } else {
      var insert = await new Userreport();
      insert.user_id = req.params.userId;
      insert.report_to = req.params.report_to;
      insert.createdAt = moment.utc();
      insert.save();

      if (insert) {
        return res.json({
          status: 200,
          message: 'successfully report',
          success: true,
        });
      } else {
        return res.json({
          status: 400,
          message: 'please try again',
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const Reporttouser_by = async (req, res) => {
  try {
    var reportedby = await Userreport.findAll({
      where: {
        where: sequelize.where(
          sequelize.fn('date', sequelize.col('createdAt')),
          '=',
          moment().format('YYYY-MM-DD')
        ),
        delete_notification_status: 0,
      },
    });
    var populate = [];

    for (let i = 0; i < reportedby.length; i++) {
      var userreport = await User.findOne({
        where: {
          userId: reportedby[i].user_id,
        },
      });

      var report_to = await User.findOne({
        where: {
          userId: reportedby[i].report_to,
        },
      });

      populate.push({ userreport, report_to });
    }

    return res.json({
      status: 200,
      message: 'successfully report',
      data: populate,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const allReportedUser = async (req, res) => {
  try {
    var reportedby = await Userreport.findAll({
      where: {
        report_to: req.params.report_to,
      },
    });
    var populate = [];

    for (let i = 0; i < reportedby.length; i++) {
      var userreport = await User.findOne({
        where: {
          userId: reportedby[i].user_id,
        },
      });

      populate.push(userreport);
    }

    return res.json({
      status: 200,
      message: 'successfully report',
      data: populate,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const createLoginResponse = async (user) => {
  // console.log(user);
  const data = {
    user: {
      userId: user.userId,
      name: user.name,
      username: user.username,
      gender: user.genderId,
      profileImage: user.profileImage,
      city: user.city,
      age: user.age,
      email: user.email,
      country: user.country,
      isAdmin: user.isAdmin,
      zipCode: user.zipCode,
      favActivities: user.favActivities,
      aboutMe: user.aboutMe,
      phoneNumberConfirmed: Boolean(user.phoneNumberConfirmed),
      availableForPick: Boolean(user.availableForPick),
      birthday: user.birthday,
      intrestedIn: user.intrestedIn,
      latitude: user.latitude,
      longitude: user.longitude,
      level: user.level,
      badge_points: user.badge_points
    },
    token: jwt.sign({ userId: user.userId }, process.env.jwtKey, {
      expiresIn: '1d',
    }),
  };

  return data;
};

const createLoginResponsedata = async (user) => {
  console.log(user, 'fdsafdfdasdffdasfdsafdfklklfdsklkfdslkfdldsalklfdssdak');
  const data = {
    user: {
      userId: user.userId,
      name: user.name,
      username: user.username,
      gender: user.genderId,
      profileImage: user.profileImage,
      google_social_id: user.google_social_id,
      facebook_social_id: user.facebook_social_id,
      apple_social_id: user.apple_social_id,
      city: user.city,
      country: user.country,
      isAdmin: user.isAdmin,
      zipCode: user.zipCode,
      favActivities: user.favActivities,
      aboutMe: user.aboutMe,
      birthday: user.birthday,
      intrestedIn: user.intrestedIn,
      token: jwt.sign({ userId: user.id }, process.env.jwtKey, {
        expiresIn: '1d',
      }),
    },
  };

  return data;
};

// const deletUserNotification = async (req, res) => {
//   try {
//     // var currentliveactivities = await User.findAll({
//     //   where: {
//     //     where: sequelize.where(
//     //       sequelize.fn('date', sequelize.col('createdAt')),
//     //       '=',
//     //       moment().format('YYYY-MM-DD')
//     //    ),
//     //   },
//     // }).on('success', function (project) {
//     //   // Check if record exists in db
//     //   if (project) {
//     //     project.update({
//     //       delete_notification_status: 1
//     //     })
//     //     .success(function () {})
//     //   }
//     // });

//     const objectToUpdate = {
//       delete_notification_status: 1,
//     }

//     var currentliveactivities = User.findAll({
//       where: {
//         where: sequelize.where(
//           sequelize.fn('date', sequelize.col('createdAt')),
//           '=',
//           moment().format('YYYY-MM-DD')
//         ),
//       },
//     },{ isNewRecord: false }).then((result) => {
//       if (result) {

//         // Result is array because we have used findAll. We can use findOne as well if you want one row and update that.
//         for (let i = 0; i < result.length; i++) {
//           result[i].set(objectToUpdate);
//           result[i].save(); // This is a promise
//         }

//         User.findAll({
//           where: {
//             where: sequelize.where(
//               sequelize.fn('date', sequelize.col('createdAt')),
//               '=',
//               moment().format('YYYY-MM-DD')
//             ),
//             delete_notification_status: 0,
//           },
//         },{ isNewRecord: false }).then((reso)=>{
//           console.log(reso,"vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
//         })
//         return res.json({
//           message: 'update successfully',
//           status: 200,
//           success: true,
//           data: result
//         });
//       }
//     })

//     // if (currentliveactivities) {

//     //   return res.json({
//     //     message: 'update successfully',
//     //     status: 200,
//     //     success: true,

//     //   });
//     // }
//   } catch (error) {
//     console.log(error);
//     return res.send(_response.getFailResponse(error.message, null, 400));
//   }
// };

const deletUserNotification = async (req, res, next) => {
  try {
    var upate = await User.update(
      {
        delete_notification_status: 1,
      },
      {
        where: {
          where: sequelize.where(
            sequelize.fn('date', sequelize.col('createdAt')),
            '=',
            moment().format('YYYY-MM-DD')
          ),
        },
      }
    );
    if (upate) {
      return res.json({
        message: 'update successfully',
        status: 200,
        success: true,
        data: upate,
      });
    } else {
      return res.json({
        message: 'no data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const deletLiveActivityNotification = async (req, res, next) => {
  try {
    var upate = await LiveActivity.update(
      {
        delete_notification_status: 1,
      },
      {
        where: {
          where: sequelize.where(
            sequelize.fn('date', sequelize.col('createdAt')),
            '=',
            moment().format('YYYY-MM-DD')
          ),
        },
      }
    );
    if (upate) {
      return res.json({
        message: 'update successfully',
        status: 200,
        success: true,
        data: upate,
      });
    } else {
      return res.json({
        message: 'no data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const deletReportsNotification = async (req, res, next) => {
  try {
    var upate = await Userreport.update(
      {
        delete_notification_status: 1,
      },
      {
        where: {
          where: sequelize.where(
            sequelize.fn('date', sequelize.col('createdAt')),
            '=',
            moment().format('YYYY-MM-DD')
          ),
        },
      }
    );
    if (upate) {
      return res.json({
        message: 'update successfully',
        status: 200,
        success: true,
        data: upate,
      });
    } else {
      return res.json({
        message: 'no data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const addAdvertisement = async (req, res, next) => {
  try {
    const body = req.body;
    let { title, description, url } = req.body

    if (!title) {
      throw new Error('please provide a title.')
    } else if (!description) {
      throw new Error('please provide a description.');
    } else if (!url) {
      throw new Error('please provide a url.');
    } else if (!req.file) {
      throw new Error('please provide a image.')
    }

    const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    if (!urlRegex.test(url)) throw new Error('please provide a valid URL.')

    const advertiseMent = await Advertisement.build({
      title: body.title,
      description: body.description,
      image:
        req.file == undefined
          ? null
          : `${_constants.main.filePath}${req.file.filename}`,
      url: body.url,
      createdAt: moment.utc().add(24, 'hours'),
    });

    await advertiseMent.save();

    res.status(200).json({
      status: "success",
      message: "Advertisement create successfully",
      data: advertiseMent // Directly use updated mainArray
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

const getAllAdvertisements = async (req, res) => {
  try {
    console.log('GetAllAdvertisement');

    if (req.params.id) {
      var advertiseMent = await Advertisement.findOne({
        where: {
          id: req.params.id
        }
      })
      if (!advertiseMent) {
        throw new Error('Advertise not found.')
      }

    } else {
      var advertiseMent = await Advertisement.findAll({});
    }

    res.status(200).json({
      status: "success",
      message: "Advertisement get successfully",
      data: advertiseMent // Directly use updated mainArray
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

const updateAdvertisement = async (req, res, next) => {
  try {
    const { title, description, image, id, url } = req.body;

    if (!title) {
      throw new Error('please provide a title.')
    } else if (!description) {
      throw new Error('please provide a description.');
    } else if (!url) {
      throw new Error('please provide a url.');
    }

    const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    if (!urlRegex.test(url)) throw new Error('please provide a valid URL.')

    if (!id) {
      throw new Error('Please provide id.');
    }

    let updateData = {
      title: title,
      description: description,
      url
    };

    if (req.file) {
      updateData.image = _constants.main.filePath + req?.file?.filename;
    } else if (image) {
      updateData.image = image;
    };

    const advertiseMentUpdatedCount = await Advertisement.update(
      updateData,
      {
        where: { id },
      }
    );

    if (advertiseMentUpdatedCount === 0) {
      throw new Error('Advertisement not found');
    }

    const updatedAdvertisement = await Advertisement.findOne({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "Advertisement Updated successfully",
      data: updatedAdvertisement // Return the updated advertisement
    });

  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

const deleteAdvertisement = async (req, res, next) => {
  try {

    if (!req.query.id) {
      throw new Error('please provide id.')
    }
    const findAdvertisement = await Advertisement.findOne({
      where: { id: req.query.id }
    })

    if (!findAdvertisement) {
      throw new Error('advertiser not found.')
    }
    const deleteAdd = await Advertisement.destroy({
      where: { id: req.query.id },
    });

    res.status(200).json({
      status: "success",
      message: "Advertisement Delete successfully",
      data: deleteAdd // Directly use updated mainArray
    })

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

const flaglist = async (req, res) => {
  try {
    var flaglist = await Flage.findAll();
    var flagdata = [];
    for (var i = 0; i < flaglist.length; i++) {
      var user = await User.findOne({
        where: {
          userId: flaglist[i].user_id,
        },
      });
      var liveactivity = await LiveActivity.findOne({
        where: {
          id: flaglist[i].activity_id,
        },
      });
      var flag = {
        id: flaglist[i].id,
        user_name: user.name,
        activityname: liveactivity.activityName,
        activity_id: liveactivity.id,
        Comment: flaglist[i].message,
      };
      flagdata.push(flag);
    }
    if (flagdata) {
      return res.json({
        message: 'Flage data',
        status: 200,
        success: true,
        data: flagdata,
      });
    } else {
      return res.json({
        message: 'No data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.send(_response.getSuccessResponse(error.message, null, 400));
  }
};

const accept = async (req, res) => {
  try {
    if (req.params.activity_id == null) {
      return res.json({
        message: 'activity id required',
        status: 400,
        success: false,
      });
    }
    var deleteliveactivities = await LiveActivity.destroy({
      where: {
        id: req.params.activity_id,
      },
    });
    var flaglist = await Flage.destroy({
      where: {
        activity_id: req.params.activity_id,
      },
    });
    if (deleteliveactivities) {
      return res.json({
        message: 'accept',
        status: 200,
        success: true,
      });
    } else {
      return res.json({
        message: 'Please try again',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.send(_response.getSuccessResponse(error.message, null, 400));
  }
};

const reject = async (req, res) => {
  try {
    var flaglist = await Flage.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (flaglist) {
      return res.json({
        message: 'reject',
        status: 200,
        success: true,
      });
    } else {
      return res.json({
        message: 'Please try again',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.send(_response.getSuccessResponse(error.message, null, 400));
  }
};

const deletLiveActivities = async (req, res, next) => {
  try {
    var upate = await LiveActivity.destroy({
      where: {
        id: req.params.id,
      },
    });
    await LiveActivityImage.destroy({
      where: {
        activityId: req.params.id,
      },
    });
    if (upate) {
      return res.json({
        message: 'delete successfully',
        status: 200,
        success: true,
      });
    } else {
      return res.json({
        message: 'no data found',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(_response.getFailResponse(error.message, null, 400));
  }
};

const emailRegister = async (req, res, next) => {
  try {

    var email = req.body.email;
    var userId = req.body.userId
    if (!email) {
      throw new Error("email is required");
    } else if (!userId) {
      throw new Error("userId is required");
    }
    var userFind = await User.findOne({ where: { email: email } })

    if (userFind) {
      throw new Error("email is already in use");
    } else {
      var user = await User.update(
        {
          email: email
        },
        {
          where: { userId: userId }
        }
      )
    }

    var user = await User.findOne({ where: { userId: userId } })
    res.status(200).json({
      status: 'success',
      message: "email registration successfully.",
      data: user
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message
    })
  }
}
// UPDATE UPDATE UPDATE
const updateDeviceToken = async (req, res, next) => {
  try {
    var userId = req.body.userId
    console.log("userId", userId);
    if (!userId) {
      throw new Error("userId is required")
    } else if (!req.body.device_token) {
      throw new Error("deviceToken is required")
    }

    var userTokenUpdate = await User.update(
      {
        device_token: req.body.device_token
      },
      {
        where:
        {
          userId: req.body.userId,
        }
      }
    )
    if (!userTokenUpdate) {
      throw new Error("can't find user")
    }
    res.status(200).json({
      status: true,
      message: "device token updated successfully",
      data: userTokenUpdate
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    })
  }
}

module.exports = {
  login,
  register,
  uploadUserImage,
  forgetPassword,
  verifyPhoneNumber,
  updatePhoneNumberConfirmed,
  checkUsernameExists,
  updatePassword,
  updateProfile,
  updateAvailability,
  getImages,
  updateUserImage,
  Adminlogin,
  Dashboard,
  Userlist,
  adminprofile,
  changepassword,
  changemail,
  userfilter,
  alerts,
  CurrentActivitieslist,
  Currentuserlist,
  blockuser,
  social_login,
  blockuseruser,
  reportuserlist,
  Reporttouser_by,
  allReportedUser,
  deletUserNotification,
  deletLiveActivityNotification,
  deletReportsNotification,
  addAdvertisement,
  getAllAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  reject,
  accept,
  flaglist,
  deletLiveActivities,
  emailRegister,
  deleteFile,
  getImage,
  getVideo,
  getFeedUser,
  userFilters,
  updateDeviceToken,
  //reels
  getReels,
  likeActivityForPost,
  getAllReels,
  deleteReel,
  searchForReelsAndProfiles,
  getMultiplePosts,
  addBadgePoints,
  getStory,
  getAllStory,
  storySeen,
  chatReaction,
  removeReaction,
  interestedActivities,
  getInterestedUsers,
  logout
};

