import createHttpError from "http-errors";
import { deleteMessage, getMsg, getUsers, sendMsg } from "../services/msg.js"
import { getReceiverId, io } from "../lib/socket.io.js";

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