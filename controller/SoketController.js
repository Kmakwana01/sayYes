const chat = require('../models/chat');
const Notification = require('../models/notification_list');
const Room = require('../models/room');
const User = require('../models/user');
var FCM = require('fcm-node');
const moment = require('moment');
const { sendToSingleUser, sendToAll } = require('../utils/sendNotification');

module.exports = {
  socket_message: async (data, chat_list) => {
    console.log("Data : " + JSON.stringify(data));
    try {
      var exists = await Room.findOne({
        where: {
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
        },
      });

      if (exists != null) {
        console.log("2");
        if (exists.id == null) {
          console.log("3");
          var creat_room = await Room.build({
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            createdAt: moment.utc(),
          });
          creat_room.save();
          console.log('sdfsdf', creat_room.id);
          var message_save = await chat.build({
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            room_id: creat_room.id,
            message: data.message,
            type: 'text',
            isRead: false,
            createdAt: moment.utc(),
          });
          message_save.save();

          var receiver = await User.findOne({
            where: {
              userId: data.receiver_id,
            },
          });
          var sender = await User.findOne({
            where: {
              userId: data.sender_id,
            },
          });

          var savenotification = await Notification.build({
            message: `you receive a new message form ${sender.name}`,
            user_id: data.receiver_id,
            isRead: false,
            type: "message",
            created_at: moment.utc(),
          });
          await savenotification.save();

        } else {

          var message_save = await chat.build({
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            room_id: exists.id,
            type: "text",
            message: data.message,
            isRead: false,
            createdAt: moment.utc(),
          });
          message_save.save();
        }
      } else {
        var existscheck = await Room.findOne({
          where: {
            receiver_id: data.sender_id,
            sender_id: data.receiver_id,
          },
        });
        if (existscheck != null) {
          if (existscheck.id == null) {
            var creat_room = await Room.build({
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              createdAt: moment.utc(),
            });
            creat_room.save();
            console.log('sdfsdf', creat_room.id);
            var message_save = await chat.build({
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              room_id: creat_room.id,
              type: "text",
              message: data.message,
              isRead: false,
              createdAt: moment.utc(),
            });
            message_save.save();
            var receiver = await User.findOne({
              where: {
                userId: data.receiver_id,
              },
            });
            var sender = await User.findOne({
              where: {
                userId: data.sender_id,
              },
            });

            var savenotification = await Notification.build({
              message: `you receive a new message form ${sender.name}`,
              user_id: data.receiver_id,
              isRead: false,
              type: "message",
              created_at: moment.utc(),
            });
            await savenotification.save();
          } else {
            var message_save = await chat.build({
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              room_id: existscheck.id,
              type: "text",
              message: data.message,
              isRead: false,
              createdAt: moment.utc(),
            });
            message_save.save();
          }
        } else {
          var creat_room = await Room.build({
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            createdAt: moment.utc(),
          });
          await creat_room.save();
          var message_save = await chat.build({
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            room_id: creat_room.id,
            type: "text",
            message: data.message,
            isRead: false,
            createdAt: moment.utc(),
          });
          message_save.save();
        }
      }

      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ " + message_save);

      if (message_save) {

        var receiver = await User.findOne({
          where: {
            userId: data.receiver_id,
          },
        });
        var sender = await User.findOne({
          where: {
            userId: data.sender_id,
          },
        });

        var data = new Date(message_save.dataValues.createdAt)
          .toISOString()
          .replace(/T/, ' ') // replace T with a space
          .replace(/\..+/, '');
        let chat_list = {
          sender_name: sender.name,
          sender_id: sender.userId,
          receiver_id: receiver.userId,
          receiver_name: receiver.name,
          message: data.message,
          createdAt: data,
          id: message_save.dataValues.id,
          room_id: message_save.room_id,
        };

        // const serverKey =
        //   'AAAAFTN1ifI:APA91bEdVo8JxbG2_bNDIJWor8VAdaiNfXVAOqMECt2K9SCEIK2ySvUiWGL60FeQX5s27XEfoRcVyXOjq_vHOTibJlk_X14MwAqr47SqUXD9xMlLGassGbGJsr7T6htL-_fQmaJyczya';
        // var fcm = new FCM(serverKey);
        // var notification = {
        //   title: 'Notification',
        //   type: 0,
        //   body: `you received a new message form ${sender.name}`,
        // };

        // console.log("token : " + receiver.device_token);

        // var message = {
        //   //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        //   to: receiver.device_token,
        //   // to: 'eONrCWi7FUZ2oLzZa2Dz1d:APA91bEo2Jk_lUP6jdp6z7IgidaY5wI3X2xeYNZV_bUyXqnXSi_PGR7CwJCQzcBaWxrfbO9ATrhdJB7B0Pd6itdFA-HrL8WUerjTcMa-oeRdDTtctvC56WDA3iTbcn093lTF3SWyAf3J',

        //   notification: {
        //     title: 'Notification',
        //     type: 0,
        //     body: `you received a new message form ${sender.name}`,
        //   },

        //   data: notification,
        // };

        // console.log("fcm : " + fcm);
        // console.log("message : " + message);

        // fcm.send(message, function (err, response) {
        //   if (err) {
        //     console.log('Something has gone wrong!' + err);
        //     console.log('Respponse:! ' + response);
        //   } else {
        //     console.log(message);
        //     // showToast("Successfully sent with response");
        //     console.log('Successfully sent with response: ', response);
        //   }
        // });

        // const serverKey = 'AAAAU2XdtVU:APA91bHeWPRUyqjgrjnSDgqNM5AcJ-_k3XvrT3xhPpAoqvyTcoKnaKP7BMUQs6SzhYwTtnvODMGiLZPKMTQlwrPgi4LS5TSownpgOjfRUKD6-RvEs-iMQYCIgnz3LAi9EAchmqan-zND';

        // var fcm = new FCM(serverKey);

        var notification = {
          title: 'Notification',
          body: `you received a new message form ${sender.name}`,
        };

        if (receiver.device_token && sender.name) {
          const message = {
            data: notification,
            token: receiver.device_token,
            notification: {
              title: 'Notification',
              body: `you received a new message form ${sender.name}`,
            },
          };
          await sendToSingleUser(message);
        }
        return chat_list;
      }
    } catch (e) {
      console.log(e);
    }
  },
};
