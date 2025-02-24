import User from "../db/models/user.js"
import bcrypt from "bcrypt";

import { generateToken } from "../db/utils.js";
import createHttpError from "http-errors";


export const signUpUser = async (payload) => {
    const userExists = await User.findOne({ email: payload.email });
    if (userExists) throw createHttpError(409, 'Email in use');
  
    if (payload.password.length < 6) throw createHttpError(400, 'Password too short');
  
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
  
    const newUser = new User({
      fullName: payload.fullName,
      email: payload.email,
      password: encryptedPassword,
      profileAvatar: payload.profileAvatar || '', 
    });
  
    await newUser.save();
  if (!newUser) throw createHttpError(500, 'User not created');

    const token = generateToken(newUser._id);
  
    return {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profileAvatar: newUser.profileAvatar,
    };
  };


export const loginUser=async(payload)=>{
    
}

export const logOutUser=async(payload)=>{
    
}