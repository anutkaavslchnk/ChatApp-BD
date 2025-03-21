import createHttpError from "http-errors";
import { SessionsCollection } from "../db/models/session.js";
import User from "../db/models/user.js";


export const protectRoute = async (req, res, next) => {
 

  const sessionId = req.cookies?.sessionId; 

    if (!sessionId) {
      return next(createHttpError(401, "Unauthorized - No session ID"));
    }

    const session = await SessionsCollection.findById(sessionId);
    if (!session) {
      return next(createHttpError(401, "Unauthorized - Invalid Session"));
    }

    const user = await User.findById(session.userId).select("-password");
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    req.user = user;
    next(); 


};
