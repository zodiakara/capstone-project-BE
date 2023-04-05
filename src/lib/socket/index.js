/*socket io basically has two methods:
one for emitting messages:
socket.emit("hello", "world")
one for listening messages:
socket.on("hello", something => {console.log(something)})
basically it's an event listener

emit to everybody: broadcast
make clients join some room : i.e. a whatsapp group

one needs to emit and second one needs to listen

two versions of socket io! 
FE: npm i socket.io-client
BE: npm i socket.io

first front end:
import {io} from 'socket.io-client'

const socket = io("BE_URL", {transports:["websocket"]})
if you don't specify the transport - websocket - socket.io will try to connect to the server 
by using POLLING (old server connection technique, now socket uses web sockets)

 */

let onlineUsers = [];
import {
  verifyAccessToken,
  verifyRefreshAndCreateNewTokens,
} from "../auth/jwt-tools.js";
import Message from "../../api/messages/model.js";
import User from "../../api/users/model.js";

const saveMessage = (text, user, receiver) =>
  new Promise((resolve, reject) => {
    const message = new Message({
      sender: user._id,
      receiver: receiver._id,
      content: {
        text,
      },
    });
    const returnData = {
      sender: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
      messageId: message._id,
      content: {
        text,
      },
      timestamp: new Date().getTime(),
    };
    message.save(returnData);
  });

export const socketHandler = (socket) => {
  const clientId = socket.id;
  console.log("Client connected: " + clientId);

  // socket.on("auth", ({ accessToken, refreshToken }) => {
  //   if (!accessToken || !refreshToken) {
  //     socket.emit("messageError", "You are not authorized to send messages");
  //     return;
  //   }

  //   //verify access token
  //   verifyAccessToken(accessToken)
  //     .then((user) => {
  //       //Access token is valid
  //       onlineUsers.push({ id: user._id, socketId: clientId });
  //       console.log(onlineUsers);
  //     })
  //     .catch((err) => {
  //       //verify refresh token
  //       verifyRefreshAndCreateNewTokens(refreshToken)
  //         .then(
  //           ({
  //             accessToken: newAccessToken,
  //             refreshToken: newRefreshToken,
  //             user,
  //           }) => {
  //             //refresh token is valid
  //             console.log("Refresh token is valid");
  //             //todo send new tokens to client
  //             socket.emit("newTokens", {
  //               accessToken: newAccessToken,
  //               refreshToken: newRefreshToken,
  //             });

  //             onlineUsers.push({
  //               id: user._id,
  //               socketId: clientId,
  //             });
  //             socket.emit("welcome", "You have been authorized");
  //           }
  //         )
  //         .catch((err) => {
  //           socket.emit(
  //             "messageError",
  //             "You are not authorized to send messages"
  //           );
  //         });
  //     });
  // });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + clientId);
  });

  //on error
  socket.on("error", (err) => {
    console.log("received error from client:", clientId);
    console.log(err);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  //chat handler
  socket.on("sendMessage", (data, room) => {
    const { content, receiver, sender } = data;
    console.log("data", data);
    console.log(onlineUsers);

    //get sender information
    if (!sender || !receiver)
      return socket.emit("messageError", "Something went wrong, no user id!!");

    User.findById(sender._id)
      .then(async (user) => {
        //get receiver
        const receiver2 = await User.findById(receiver._id);
        if (!receiver2) {
          return socket.emit("messageError", "Something went wrong");
        }
        const messageToSend = {
          content,
          receiver,
          sender: user,
        };
        socket.to(room).emit("newMessage", messageToSend);
        console.log("ROOM", room);
        // delete receiver2.password;
        // delete receiver2.refreshToken;
        // delete receiver2.accessToken;
        // delete user.password;
        // delete user.refreshToken;
        // delete user.accessToken;
        // saveMessage(content, user, receiver2)
        //   .then((message) => {
        //     //send message to receiver
        //     const receiverSocketId = onlineUsers.find(
        //       (user) => user.id === receiver2._id
        //     ).socketId;
        //     delete message.sender;
        //     delete message.receiver;

        // })
        // .catch((err) => {
        //   socket.emit("messageError", "Something went wrong");
        // });
      })
      .catch((err) => {
        console.log(err);
        socket.emit("messageError", "Something went wrong");
      });
  });
};
