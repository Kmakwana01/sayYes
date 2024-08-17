require('dotenv').config();
console.log(process.env.baseUrl);

const main = {
  apiPrefix: '',
  filePath: process.env.baseUrl + 'files/',
  filePathWithAudio: process.env.baseUrl + 'files/audio/',
  saltRound: 10,
  adminName : 'Admin'
};

const messages = {
  //generic
  success: 'Success',
  notFound: 'Record not found',
  updated: 'Record updated',
  deleted: 'Record deleted',
  retrived: 'Record retrived',
  exception: 'Exception occured',

  //auth
  login: 'Login successfully',
  registered: 'Registered successfully',
  incorrectCreds: 'Incorrect credentials',
  uniquePhone: 'Phone Number already registered',
  uniqueUsername: 'Username already registered',
  unAuthorize: 'You are not authorize',
  fileUploaded: 'File uploaded successfully',
  fileUpdated: 'File updated successfully',
  codeSent: 'Code has been sent successfully to your phone number',
  codeNotSent: 'Error in sending code',
  passwordUpdated: 'Passowrd updated successfully',
  profileUpadated: 'Profile updated successfully',
  phoneNumberConfirmed: 'Phone number confirmed successfully',

  //activity
  requestSent: 'Request sent successfully',
  requestAlreadyThere: 'You cannot sent request more than once',
  accepted: 'Request responded successfully',

  //reels
  invalidFileType : 'Invalid file type. Only video files are allowed.',
  fileSize : 'Maximum file size is 30MB.'
  
};

module.exports = { main, messages };
