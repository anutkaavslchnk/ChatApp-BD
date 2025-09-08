import User from "../db/models/user.js";
import { SessionsCollection } from "../db/models/session.js";
import { randomBytes } from "crypto";
import { AN_HOUR, ONE_DAY } from "../constants/constans.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.CLIENT_ID);

export const googleAuthController = async (req, res) => {
  const { credential } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name: fullName, picture: profileAvatar } = payload;

  // find or create user
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      fullName,
      profileAvatar,
      password: null,
    });
  }

  // clear old session
  await SessionsCollection.deleteOne({ userId: user._id });

  // create new session
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + AN_HOUR),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  // set cookies same as loginController
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    sameSite: "None",
    secure: true,
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    sameSite: "None",
    secure: true,
  });

  res.json({
    user,
    accessToken: session.accessToken,
  });
};

export const googleSignUpController = async (req, res) => {
  const { credential } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name: fullName, picture: profileAvatar } = payload;

  // find or create user
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      fullName,
      profileAvatar,
    });
  }

  // clear old session
  await SessionsCollection.deleteOne({ userId: user._id });

  // create new session
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + AN_HOUR),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  // set cookies same as loginController
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    sameSite: "None",
    secure: true,
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    sameSite: "None",
    secure: true,
  });

  res.json({
    user,
    accessToken: session.accessToken,
  });
};
