import User from "../db/models/user.js"
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';
import createHttpError from "http-errors";
import { SessionsCollection } from "../db/models/session.js";
import { AN_HOUR, ONE_DAY } from "../constants/constans.js";


export const signUpUser = async (payload) => {
    const userExists = await User.findOne({ email: payload.email });
    if (userExists) throw createHttpError(409, 'Email in use');
  
    if (payload.password.length < 6) throw createHttpError(400, 'Password too short');
  
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({
    ...payload,
    password: encryptedPassword,
  })
  };


export const loginUser=async(payload)=>{
const user=await User.findOne({email:payload.email});
if(!user) throw createHttpError(404, 'User not found');
const isEqual=await bcrypt.compare(payload.password, user.password);
if(!isEqual) throw createHttpError(401, 'Unauthorized');

await SessionsCollection.deleteOne({userId:user._id});

const accessToken=randomBytes(30).toString('base64');
const refreshToken=randomBytes(30).toString('base64');
return await SessionsCollection.create({
  userId:user._id,
  accessToken,
  refreshToken,
  accessTokenValidUntil: new Date(Date.now()+AN_HOUR),
  refreshTokenValidUntil: new Date(Date.now()+ONE_DAY),
})
}

export const logOutUser=async(sessionId)=>{
  await SessionsCollection.deleteOne({_id:sessionId});

}


const createSession=async()=>{
  const accessToken=randomBytes(30).toString('base64');
const refreshToken=randomBytes(30).toString('base64');
return await SessionsCollection.create({
  accessToken,
  refreshToken,
  accessTokenValidUntil: new Date(Date.now()+AN_HOUR),
  refreshTokenValidUntil: new Date(Date.now()+ONE_DAY),
});

};

export const refreshUsersSession=async({sessionId, refreshToken})=>{
  const session=await SessionsCollection.findOne({
    _id:sessionId,
    refreshToken,
  });

  if(!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired=new Data() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) throw createHttpError(401, 'Session expired');

  const newSession=createSession();
  await SessionsCollection.deleteOne({_id:sessionId, refreshToken});
  return await SessionsCollection.create({

    userId:session.userId,
    ...newSession,
  });
}