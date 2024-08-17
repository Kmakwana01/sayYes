const express = require('express');
const bodyParser = require('body-parser');
const camelCase = require('camelcase-keys');
const cors = require('cors');
const _constants = require('./utils/constants');
//=======================================
const authRoute = require('./routes/auth.route');
const commonRoute = require('./routes/common.route');
const fileRoute = require('./routes/files.route');
const activityRoute = require('./routes/activity.route');
const db = require('./database/database');
var socketIo;
//=================
//Configuration
//=================

const server = express();

server.use((req, res, next) => {
  console.log(`\x1b[33m${req.method} ${req.url}\x1b[0m`); // Yellow color
  // console.log('\x1b[33mRequest headers:\x1b[0m', req.headers); // Yellow color
  // console.log('\x1b[33mRequest body:\x1b[0m', req.body); // Yellow color
  next();
});

  // // Middleware to log responses
  // server.use((req, res, next) => {
  //   const oldSend = res.send;
  //   res.send = function (data) {
  //     console.log('Response sent:', data);
  //     oldSend.apply(res, arguments);
  //   };
  //   next();
  // });


server.use(
  cors({
    origin: '*',
  })
);
//server.use(cors());

server.use(express.static('public'));

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    limit: '150mb',
    extended: false,
  })
);

camelCase({ 'foo-bar': true });
camelCase([{ 'foo-bar': true }, { 'bar-foo': false }]);
camelCase(
  { 'foo-bar': true, nested: { unicorn_rainbow: true } },
  { deep: true }
);

server.engine('html', require('ejs').renderFile);
server.set('view engine', 'html');
server.use(express.static(`${__dirname}/views`));
server.use('/video', express.static(`${__dirname}/assets/images/`));
server.use('/:fileName', express.static(`${__dirname}/assets/images/`));
//===================
//Routes
//===================

server.use(`${_constants.main.apiPrefix}/auth`, authRoute);
server.use(`${_constants.main.apiPrefix}/common`, commonRoute);
server.use(`${_constants.main.apiPrefix}/activity`, activityRoute);
server.use(`${_constants.main.apiPrefix}/files`, fileRoute);
server.use('/', (req, res, next) => {
  res.render('index');
});

server.setSocketIo = function setSocketIo(socketIo) {
  this.socketIo = socketIo;
  activityRoute.setSocketIo(socketIo);
}

module.exports = { server }

