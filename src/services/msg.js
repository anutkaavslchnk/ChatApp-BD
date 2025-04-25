import Msg from "../db/models/message.js";
import User from "../db/models/user.js";
import { getReceiverId, io } from "../lib/socket.io.js";
import cloudinary from "../utils/imageCloud.js";

export const getUsers=async(req,res)=>{

      const loggedInUser=req.user._id;
      const filter=await User.find({_id:{$ne:loggedInUser}}).select("-password");
      res.status(200).json(filter);




}
    
    export const getMsg=async(req,res)=>{
    const {id:userChatId}=req.params;
    const myId=req.user._id;

    const msgs=await Msg.find({
        $or:[
            {senderId:myId,
            receiverId:userChatId},
            {senderId:userChatId,
                receiverId:myId
            }
        ]
    })
    res.status(200).json(msgs);
    }



    export const sendMsg = async (req, res) => {
        try {
            const { txt, image } = req.body;
            const { id: receiverId } = req.params;
            const senderId = req.user._id;
            let imgUrl = null;
    
            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imgUrl = uploadResponse.secure_url;
            }
    
            const newMessage = new Msg({
                senderId,
                receiverId,
                txt,
                image: imgUrl,
            });
    
            await newMessage.save();
    
            const receiverSocketId=getReceiverId(receiverId);
            if(receiverSocketId){
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

            res.status(201).json(newMessage);
        } catch (error) {
            console.error("Error in sendMsg:", error);  
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    };
    

    export const updateStatusOfDelivered=async(req,res,next)=>{
try {
    const {idMsg}=req.params;
    const userId=req.user._id;
    const msg=await Msg.findById(idMsg);
    if(!msg){
        return res.status(404).json({message:'Message not found'});
    }
    if(msg.receiverId.toString()!==userId.toString()){
       return  res.status(403).json({ message: "Not authorized to update delivery status" });

    }
    msg.isDelivered=true;
    await msg.save();
    res.status(200).json(msg);
} catch (error) {
    next(error);
}
    }

    export const updateStatusOfRead=async(req,res,next)=>{
        try {
            const {idMsg}=req.params;
            const userId=req.user._id;
            const msg=await Msg.findById(idMsg);
            if(!msg){
                return res.status(404).json({message:"Message not found"})
            }
            if(msg.receiverId.toString()!=userId.toString()){
                return res.status(403).json({message: "Not authorized to update read status"})
            }
            msg.isRead=true;
            await msg.save();
            res.status(200).json(msg);
        } catch (error) {
            next(error)
        }
    }