import { signUpUser } from "../services/auth.js";

export const signUpController = async (req, res, next) => {
    try {
      const { fullName, email, password, profileAvatar } = req.body;
      const userData = await signUpUser({ fullName, email, password, profileAvatar });
  
      res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  };
  

export const loginController=(req,res)=>{
    res.send("login");
}

export const logoutController=(req,res)=>{
    res.send("logout");
}