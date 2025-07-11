import createHttpError from "http-errors";
import { deleteMessage, getMsg, getUsers, sendMsg, updateMessage } from "../services/msg.js"
import { getReceiverId, io } from "../lib/socket.io.js";
import Conv from "../db/models/conversation.js";
import Msg from "../db/models/message.js";

export const getUsersController=(req,res)=>{
getUsers(req,res);

}

export const getMsgController=(req,res)=>{
 getMsg(req,res);
}

export const sendMsgController=(req,res)=>{
    return sendMsg(req,res);
}

export const deleteMessageController=async(req,res,next)=>{
    const {idMsg}=req.params;
    const senderId=req.user?._id;
    
    try {
        const msg=await deleteMessage(idMsg,senderId);
        if(!msg){

            return next(createHttpError(404,'Message not found'));
            
        }

        const receiverId = msg.receiverId?.toString();

           if (receiverId) {
      const receiverSocketId = getReceiverId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('deleteMessage', { messageId: idMsg });
      }
    }
        res.status(204).send();
    } catch (error) {
        next(error);
        
    }
}
export const getConversationSummariesList = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conv.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    const summaries = conversations.map(conv => {
      const otherUserId = conv.senderId.toString() === userId
        ? conv.receiverId
        : conv.senderId;

      return {
        userId: otherUserId,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount
      };
    });

    res.status(200).json(summaries);
  } catch (error) {
    next(error);
  }
};




export const updateMessageController = async (req, res, next) => {
  const { idMsg } = req.params;
  const { txt } = req.body;
  const senderId = req.user?._id;

  try {
    const updatedMsg = await updateMessage(idMsg, { txt });

    if (!updatedMsg) {
      return next(createHttpError(404, 'Message not found'));
    }

    const receiverId = updatedMsg.receiverId?.toString();

 
    const payload = {
      messageId: idMsg,
      newText: txt,
    };

    const senderSocketId = getReceiverId(senderId);
    const receiverSocketId = getReceiverId(receiverId);

    if (senderSocketId) {
      io.to(senderSocketId).emit('messageUpdated', payload);
    }

    if (receiverSocketId && receiverSocketId !== senderSocketId) {
      io.to(receiverSocketId).emit('messageUpdated', payload);
    }

    console.log("➡️ Incoming update:", {
      idMsg,
      body: req.body,
    });
    res.status(200).json(updatedMsg);
  } catch (error) {
    next(error);
  }
};
