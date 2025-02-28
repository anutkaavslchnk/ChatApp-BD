import mongoose, { Schema } from 'mongoose';

const userSchema =new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    profileAvatar:{
        type:String,
        default:""
    },

},
{timestamps:true});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  };
const User=mongoose.model("User",userSchema);
export default User;