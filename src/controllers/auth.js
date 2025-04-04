
import { ONE_DAY } from "../constants/constans.js";
import { loginUser, logOutUser, refreshUsersSession, signUpUser, updateProfile } from "../services/auth.js";

export const signUpController = async (req, res) => {


      const userData = await signUpUser(req.body);
  
      res.json(userData);

  };
  

  export const loginController = async (req, res) => {
const {session,user}=await loginUser(req.body);
res.cookie('refreshToken', session.refreshToken,{
  httpOnly:true,
  expires: new Date(Date.now()+ONE_DAY),
});
res.cookie('sessionId', session._id,{
  httpOnly:true,
  expires: new Date(Date.now()+ONE_DAY),
});

res.json({
  user,
  accessToken:session.accessToken,
})
  };
  
  

  export const logoutController=async(req,res)=>{
    const { sessionId } = req.cookies;
    if (!sessionId) {
        return res.status(400).json({
          status: 400,
          message: "Session ID is missing in cookies",
        });
      }
if(sessionId){
    await logOutUser(sessionId);
}
res.clearCookie('sessionId');
res.clearCookie('refreshToken');
res.status(204).send();
};
  

const setupSession=(res,session)=>{
  res.cookie('refreshToken', session.refreshToken,{
    httpOnly:true,
    expires: new Date(Date.now()+ONE_DAY),
  });
  res.cookie('sessionId', session._id,{
    httpOnly:true,
    expires: new Date(Date.now()+ONE_DAY),
  });
}

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const updateProfileController=async(req,res,next)=>{
  await updateProfile(req, res,next);
   

}



export const checkController=(req,res)=>{
try {
  res.status(200).json(req.user);
} catch (error) {
  console.log(error.message);
  res.status(500).json({message:"Internal server error"});
  
}
   

}


