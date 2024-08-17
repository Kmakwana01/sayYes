const http = require('http');
const {server} = require('./server');
require('dotenv').config();

server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://admin.sayyesadmin.com');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

const httpServer = http.createServer(server);
console.log("server is started =================================");


const io = require('socket.io')(httpServer);
io.on('connection', (socket) => {
  console.log("connected user success=========================" );
  socket.on('new_message', async (data) => {
    /* … */
    // console.log("data", data);
    var data_of_chat = await require('./controller/SoketController').socket_message(data);

    console.log("data_of_chat",data_of_chat);
    
    io.emit('receive_message', data_of_chat);

  });
  
  socket.on('disconnect', () => {
    console.log('disconnected from user');
    /* … */
  });
});

server.setSocketIo(io)

// exports.broadcastMessage = async function (data_of_chat) {
//   if (io != null) {
//     console.log("send message : " + data_of_chat);
//     io.emit('receive_message', data_of_chat);
//   }
// };

httpServer.listen(process.env.port, () => {
  console.log(`Server is listening at => http://localhost:${process.env.port}`);
});

