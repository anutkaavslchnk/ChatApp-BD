import { getMsg, getUsers, sendMsg } from "../services/msg.js"

export const getUsersController=(req,res)=>{
getUsers(req,res);

}

export const getMsgController=(req,res)=>{
 getMsg(req,res);
}

export const sendMsgController=(req,res)=>{
    return sendMsg(req,res);
}