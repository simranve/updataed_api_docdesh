const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const {
  emptyError
} = require('./../helper/errorHandler');

/**
 * User Schema
 * ---
 * It holds all users model Structure
 */
const usersSchema = new Schema({
  firstName: {
    type: String,
    trim:true,
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    //required: true,
    //trim: true,
    //default:'',
    index:true,
    //unique: [false, 'This Email already existed. Please try with different Email.']
    sparse:true
  },
  phoneNumber:{
    type:String,
    default:'',
  },
  specialist:{
     type:String,
     default:''
  }, 
   about:{
    type:String,
    default:''
  }, 
  credentials: {
    type: String
  },
  profilePic: {
    type: String
  },
  password: {
    type: String
  },
  type:{
    type:Number, // type=0, users, 1 = contactProvider 
  },
  providerStatus:{
    type:String, // contact Provider providerStatus 1=Contact, 2 = Message, 3= Video call
  },
  userStatus:{
    type:Number   // 1 = Active
  },
  otp:{
    type: String,
    default:''
  },
  deviceToken:{
    type: String,
    default: ''
  },
  iosVoipToken:{
    type: String,
    default: ''      // Ios Voip Token used for Calling on killed state application
  },
  deviceType:{
    type: String,
    default: ''   //android/ios
  },
  user_token:{
    type: String,
    default: ''
  },
  verifyEmail:{
    type: Boolean,
    default: false
  },
  status:{
    type: Number, 
    default: 0
  }
},
{
  timestamps: true
});


usersSchema.statics.findByToken = async function(token){
  // console.log(token);
  var decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET);
   
   return await User.findOne({
    '_id':decoded.id,
    'user_token':token}).select("-user_token -tokens -password -otp -email_verify_token -__v").lean();
  }catch(e){
    throw new Error(e.message);
  }
}

usersSchema.methods.fetchByEmail = async function(){
  let user = this;
  return await User.findOne({email: user.email});
}

usersSchema.methods.AdminfetchByEmail = async function(){
  let user = this;
 
  return await User.findOne({email: user.email,type:3});
}

usersSchema.methods.fetchByMobileNo = async function(){
  let user = this;
  return await User.findOne({mobileNo: user.mobileNo});
}

usersSchema.methods.findByIdOtp = async function(){
  let user = this;
  return await User.findOne({_id: user._id,otp:user.otp});
}

usersSchema.methods.findByEmailOtp = async function(){
  let user = this;
  return await User.findOne({email: user.email,otp:user.otp});
}

usersSchema.methods.findByMobileOtp = async function(){
  let user = this;
  return await User.findOne({mobileNo: user.mobileNo,otp:user.otp});
}

usersSchema.methods.findByTempToken = async function(){ // Find by Email Verify Token
  let user = this;
  return await User.findOne({email_verify_token: user.email_verify_token});
}

usersSchema.methods.add = async function(){
  let user = this;
  return await user.save();
}

usersSchema.methods.fetchUser = async function() {
  let user = this;
  return User.findById(user._id, '-user_token -tokens -password -rePassword -otp -email_verify_token -__v').lean();
}



usersSchema.methods.generateOTP = function(){
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 4; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
}

//------------------------------------------------------------------------------
const User = mongoose.model('User', usersSchema);
module.exports = User;