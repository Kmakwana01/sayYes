const express = require('express');
const router = express.Router();

const { authorizeUser } = require('../utils/authorize');
const _fileUploader = require('../utils/fileUploader');

const {
  login,
  register,
  uploadUserImage,
  updateAvailability,
  checkUsernameExists,
  updateUserImage,
  forgetPassword,
  updatePassword,
  updateProfile,
  getImages,
  verifyPhoneNumber,
  updatePhoneNumberConfirmed,
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
  flaginsert,
  flaglist,
  accept,
  reject,
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
  // search functionality
  searchForReelsAndProfiles,
  getMultiplePosts,
  addBadgePoints,
  //story functionality
  getStory,
  getAllStory,
  storySeen,
  // chat reactions
  chatReaction,
  removeReaction,
  // interestedIn,
  interestedActivities,
  getInterestedUsers,
  logout

} = require('../controller/auth.controller');

const { addQuestion, getQuestion, updateQuestion, deleteQuestion, addAnswer, getQuestionsWithAnswer, deleteAnswer } = require('../controller/icebreakerController');
const { addActivity, getActivities, selectActivity, getSelectedActivities, getMatchUsers, preferredTimeUpdate } = require('../controller/preferredActivityController');

router.post(
  '/register',
  _fileUploader.single('image'),
  register,
);

router.post('/login', login);
//social login
router.post('/social_login', social_login);
router.post('/Adminlogin', Adminlogin);

router.post('/checkUsernameExists', checkUsernameExists);

router.post('/verifyPhoneNumber', authorizeUser, verifyPhoneNumber);

router.post(
  '/updatePhoneNumberConfirmed',
  authorizeUser,
  updatePhoneNumberConfirmed
);

router.post(
  '/updateProfile',
  authorizeUser,
  _fileUploader.single('image'),
  updateProfile
);

router.post(
  '/uploadImage',
  authorizeUser,
  _fileUploader.any(),
  uploadUserImage
);

router.post(
  '/updateImage',
  authorizeUser,
  _fileUploader.single('image'),
  updateUserImage
);

router.get('/getImages/:userId', authorizeUser, getImages);

router.post('/forgetPassword', forgetPassword);

router.post('/updatePassword', updatePassword);

router.post('/setAvailability/:userId', authorizeUser, updateAvailability);
router.post('/Adminlogin', Adminlogin);
router.get('/Dashboard', authorizeUser, Dashboard);
router.get('/Userlist', authorizeUser, Userlist);
router.get('/adminprofile/:adminid', authorizeUser, adminprofile);
router.post('/changepassword', authorizeUser, changepassword);
router.post('/changemail', authorizeUser, changemail);
router.post('/userfilter', authorizeUser, userfilter);
router.get('/alerts', authorizeUser, alerts);
router.get('/CurrentActivitieslist', authorizeUser, CurrentActivitieslist);
router.get('/Currentuserlist', authorizeUser, Currentuserlist);
router.get('/blockuser/:userId/:status', authorizeUser, blockuser);
//mobile

router.get(
  '/blockuseruser/:user_blocked_by/:blocked_user_id',
  authorizeUser,
  blockuseruser
);
router.get('/reportuserlist/:userId/:report_to', authorizeUser, reportuserlist);
router.get('/Reporttouser_by', authorizeUser, Reporttouser_by);
router.get('/all_reported_users/:report_to', authorizeUser, allReportedUser);
router.get('/delete_notification_status', authorizeUser, deletUserNotification);
router.get(
  '/deletLiveActivityNotification',
  authorizeUser,
  deletLiveActivityNotification
);
router.get(
  '/deletReportsNotification',
  authorizeUser,
  deletReportsNotification
);

router.post(
  '/addAdvertisement',
  authorizeUser,
  _fileUploader.single('image'),
  addAdvertisement
);
router.get('/getAllAdvertisements', authorizeUser, getAllAdvertisements);
router.get('/getSingleAdvertisement/:id', authorizeUser, getAllAdvertisements);

router.put(
  '/updateAdvertisement',
  authorizeUser,
  _fileUploader.single('image'),
  updateAdvertisement
);
router.delete('/deleteAdvertisement', authorizeUser, deleteAdvertisement);
router.get('/flaglist', authorizeUser, flaglist);
//remove data from activities
router.get('/accept/:activity_id', authorizeUser, accept);
//remove data from flag table
router.get('/reject/:id', authorizeUser, reject);
router.post('/emailRegister', emailRegister);
router.post('/deleteFile', authorizeUser, deleteFile);
router.get('/getImage', authorizeUser, getImage);
router.get('/getVideo', authorizeUser, getVideo);
router.get('/getFeedUser', authorizeUser, getFeedUser);
router.post('/userFilters', authorizeUser, userFilters)
router.post('/updateDeviceToken', updateDeviceToken)

// reel routs
router.get('/getReels', authorizeUser, getReels);
router.post('/getAllReels', authorizeUser, getAllReels);
router.post('/reelLikes', authorizeUser, likeActivityForPost)
router.delete('/deleteReel', authorizeUser, deleteReel);
//reel search
router.get('/search', authorizeUser, searchForReelsAndProfiles)
router.post('/getMultiplePosts', authorizeUser, getMultiplePosts)

// story 
router.get('/getStory/:id',authorizeUser, getStory)
router.post('/getAllStory', authorizeUser, getAllStory)
router.get('/storySeen', authorizeUser, storySeen)

//badge system
router.post('/addBadgePoints', authorizeUser, addBadgePoints);
// message reaction
router.post('/chatReaction', authorizeUser, chatReaction);
router.post('/removeReaction', authorizeUser, removeReaction);

// interested profile
router.post('/interestedActivities', authorizeUser, interestedActivities);
router.get('/getInterestedUsers', authorizeUser, getInterestedUsers);

// icebreaker questions
router.post('/addQuestion', authorizeUser, addQuestion);
router.get('/getQuestion', authorizeUser, getQuestion);
router.put('/updateQuestion', authorizeUser, updateQuestion);
router.delete('/deleteQuestion', authorizeUser, deleteQuestion);

// icebreaker answer
router.post('/addAnswer', authorizeUser, addAnswer);
router.get('/getQuestionsWithAnswer', authorizeUser, getQuestionsWithAnswer);
router.delete('/deleteAnswer', authorizeUser, deleteAnswer);

// preferred Activities
router.post('/addActivity', authorizeUser, addActivity);
router.get('/getActivities', authorizeUser, getActivities);
router.post('/selectActivity', authorizeUser, selectActivity);
router.get('/getSelectedActivities', authorizeUser, getSelectedActivities);
router.get('/getMatchUsers', authorizeUser, getMatchUsers);
router.post('/preferredTimeUpdate', authorizeUser , preferredTimeUpdate);

// logout
router.post('/logout', authorizeUser , logout);




module.exports = router;
