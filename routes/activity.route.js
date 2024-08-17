const express = require('express');
const router = express.Router();
const path = require('path');

const { authorizeUser } = require('../utils/authorize');
const _fileUploader = require('../utils/fileUploader');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const mimeType = file.mimetype;
    let uploadPath;

    console.log(mimeType)


    if (mimeType.startsWith('audio/')) {
      uploadPath = 'public/audio';
    } else {
      uploadPath = 'assets/images'; // Example for other file types
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using a combination of timestamp and UUID
    const fileExtension = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + fileExtension;

    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

var socketIo;

var {
  getAllUsers,
  sendFriendRequestToUser,
  getUserFriendRequests,
  sendActivityRequest,
  getLiveActvities,
  responseFriendRequest,
  responseActivityRequest,
  getMyFriends,
  registerLiveActivity,
  getUserActivityRequests,
  getMyOfferedActivityRequests,
  getMyOfferedFriendRequests,
  getMyActivities,
  responseconfirm,
  creatchat,
  getmessage,
  getroom,
  getnotification_list,
  sendFriendRequestToUsercustom,
  deletechat,
  RequestDelete,
  flaginsert,
  flaglist,
  accept,
  reject,
  block_user_list,
  userdetail,
  Likeliveactivitise_data,
  deleteimage,
  getUsers,
  userLikes,
  notificationIsReadUpdate,
  deleteRoom,
  activitySetSocketIo,
} = require('../controller/activity.controller');
const { deletLiveActivities } = require('../controller/auth.controller');

router.post('/getAllUsers', authorizeUser, getAllUsers);

//Friend Request
router.post('/sendFriendRequestToUser', authorizeUser, sendFriendRequestToUser);
router.post('/sendFriendRequestToUsercustom', sendFriendRequestToUsercustom);

router.get(
  '/getUserFriendRequests/:userId',
  authorizeUser,
  getUserFriendRequests
);

router.get(
  '/getMyOfferedFriendRequests/:userId',

  getMyOfferedFriendRequests
);

router.post('/responseFriendRequest', responseFriendRequest);
router.post('/responseconfirm', responseconfirm);

router.get('/getMyFriends/:userId', authorizeUser, getMyFriends);

//Friend Request

//Activity Reuqests

router.post('/sendActivityRequest', authorizeUser, sendActivityRequest);

router.get(
  '/getUserActivityRequests/:userId',
  authorizeUser,
  getUserActivityRequests
);

router.get(
  '/getMyOfferedActivityRequests/:userId',
  authorizeUser,
  getMyOfferedActivityRequests
);

router.post('/responseActivityRequest', authorizeUser, responseActivityRequest);

router.get('/getMyActivities/:userId', authorizeUser, getMyActivities);
//Activity Reuqests

router.post(
  '/registerLiveActivity',
  _fileUploader.array('image', 3),
  registerLiveActivity
);

router.get('/getLiveActivities', getLiveActvities);

router.post('/creatchat', upload.any(), creatchat);
router.post('/getmessage', getmessage);
router.get('/getroom/:sender_id', getroom);
router.get('/getnotification_list/:user_id', getnotification_list);
router.get('/deletechat/:userId_delete/:message_id', deletechat);
router.get('/RequestDelete/:id', RequestDelete);
router.post('/flaginsert', flaginsert);
router.get('/block_user_list/:user_id', block_user_list);
router.post('/Likeliveactivitise_data', Likeliveactivitise_data);
router.get('/deletLiveActivities/:id', deletLiveActivities);
router.get('/user_detail/:id', userdetail);
router.get('/deleteimage', deleteimage);
router.post('/getUsers', getUsers);
router.post('/userLikes', userLikes)



router.post('/updateNotifications/:user_id', notificationIsReadUpdate);
router.delete('/deleteRoom/:roomId', deleteRoom)

router.setSocketIo = function setSocketIo(socketIo) {
  this.socketIo = socketIo;
  activitySetSocketIo(socketIo);
}

module.exports = router;
