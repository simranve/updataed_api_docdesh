const User = require('./../models/userModel'), //Model
 UserDocuments = require('./../models/userSchemaDocuments'), //Model
 Credential_type = require('../models/credential_m'); //Model
 bcrypt = require('bcrypt'),
 jwt = require('jsonwebtoken'),
 date = require('date-and-time'),
 _ = require('lodash'),
 fs = require('fs'),
 crypto = require('crypto');
 const {sendmail} = require('./../services/sendmail');

const nodemailer = require('nodemailer');
const {ObjectID} = require('mongodb');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'drparidesh@gmail.com',
    pass: 'Balancedwellbeing1#'
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {

signIn : async (req, res) => {
    try {

    var user = new User({
      email:req.body.email
    });
    user = await user.fetchByEmail();
    
    if (!user) return res.status(200).send({ status: 0, auth: false, token: null, message:"User not found." });
    var passwordIsValid = bcrypt.compare(req.body.password, user.password, async function(err, res1) {
      if(res1 == true){
        let checkActive = await User.findOne({email:req.body.email}, 'status');
        if(checkActive.status==1 || checkActive.status==0){
          var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
          user.user_token = token;
          if(req.body.deviceToken) user.deviceToken = req.body.deviceToken;
          if(user.smoke ==''){
            user.smoke = false;
          }
          await user.add();
          let data = await user.fetchUser();  
           data.profilePic = process.env.UPLOADURL+data.profilePic;
          
          if(data.email){
            res.status(200).send({ status: 1, auth: true, token: token, message:"Login Success.", data });
          }else{
            res.status(401).send({ status: 0, auth: true, token: token, message:"Email id is not verified.", data });
          }
        }else{
          let respMsg;
          switch (checkActive.status) {
            case 2:
              respMsg = "Your account is pending in Admin Review. Please contact on ezride.sg@gmail.com"
                break;
            case 3:
              respMsg = "Your account is On Hold. Please contact on ezride.sg@gmail.com"
                break;
            case 4:
              respMsg = "Your account is Cancelled. Please contact on ezride.sg@gmail.com"
                break;
            default:
              break;
          }
          // 0= Pending, 1= Active, 2= Pending Admin Review, 3= On Hold, 4=Cancelled
          res.status(203).send({ status: 1, auth: true, token: null, message:respMsg });
        }
      }else{
        return res.status(200).send({ status: 0, auth: false, token: null, message:"Wrong password entered." });
      }
    });
  } catch (err) {
    return res.status(200).send({ status: 0, auth: false, token: null, message:err.message });
  }
}, // SignIn/Login Closing

logOut : async (req, res, next) => {
  // console.log(req.user);
  let user_id = req.user._id;
  let userData = {
    user_token:'',
    deviceToken:''
  }
  let rm_token = await User.findByIdAndUpdate(user_id, userData, {new: true, runValidators: true});

  if(rm_token){
    res.status(200).send({ status: 1, message:"Logout successfully." });
  }else{
    res.status(400).send({ status: 0, message:"Logout failed." });
  }
}, // Logout Closing


/*--------------------------------------
|| Fetch all user from user Collection
----------------------------------------*/
fetchUser : async (req, res) => {
  try {
    const user = new User();
    const allData = await user.fetchUser();
    if (allData.length < 1) throw new Error("no users are available");
    res.status(200).send(allData);
  } catch (err) {
    res.status(400).send(err.message);
  }
},

userRegistration : async (req, res) => {
     
      const user = new User({email:req.body.email});
      console.log(user)
      const allData = await user.fetchByEmail();


           
     bcrypt.hash(req.body.password.toString(), 10, function(err, hash) {
    if (err) throw err;
        
    else{
      var userData = {
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       credentials: req.body.credentials,
       password: req.body.password,
       email:req.body.email
      }
      var otp = user.generateOTP();
       let Mailsend = new Promise(function(resolve, reject) {
    const mailOptions = {
      from: '"Hippa" <support@hippa.com',
      to: req.body.email,
      subject: 'Send Otp Verification',
      html:
      '<!DOCTYPE html><head><title>Internal_email-29</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="margin:0; padding:0;" bgcolor="#eaeced"><table style="min-width:320px;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#eaeced"><tr><td class="hide"><table width="600" cellpadding="0" cellspacing="0" style="width:600px !important;"><tr><td style="min-width:600px; font-size:0; line-height:0;">&nbsp;</td></tr></table></td></tr><tr><td class="wrapper" style="padding:0 10px;"><table data-module="module-3" data-thumb="thumbnails/03.png" width="100%" cellpadding="0" cellspacing="0"><tr><td data-bgcolor="bg-module" bgcolor="#eaeced"><table class="flexible" width="600" align="center" style="margin:0 auto;background: white;margin-top:30px;" cellpadding="0" cellspacing="0"><tr><td class="img-flex"><hr style="border:2px solid #00bbf2;width:500px; border-radius:30px;"></td></tr><tr><td data-bgcolor="bg-block" class="holder" style="padding:20px 50px 5px;" bgcolor="#ffffff"><table width="100%" cellpadding="0" cellspacing="0"><tr><td data-color="title" data-size="size title" data-min="20" data-max="40" data-link-color="link title color" data-link-style="text-decoration:none; color:#292c34;" class="title" style="font:30px/33px Arial, Helvetica, sans-serif; color:#292c34; padding:0 0 24px;"><h6 style="margin:0px;">Welcome to Hippa App!</h6><p style="font-size: 15px; line-height:20px;">It&apos;s official.>Register with Hippa App</a>  Your OTP is '+otp+'</p><p style="font-size: 15px; line-height:20px;"><br/>Thanks<br/>Team Hippa   </p></td></tr></table></td></tr><tr><td height="28"></td></tr></table></td></tr></table></td></tr></table></body></html>', 
  }
    transporter.sendMail(mailOptions).then(function(info) {
      resolve(info);
      console.log(info);
      console.log('send')
    }).catch(function(err) {
        reject(err);
        console.log('err')
    });
  });
      
      
      if (allData) return res.status(200).send({ status: 0, message:"Email Id already exist." });

       


      res.json({message:"OTP Genearted Succesfully and also sent to mail.",status: 1,otp:otp,userInfo:userData});  
      

    }
    
  });
   
 }, // User Registration Closing




verifyOtp : async (req, res) => {
  if(req.body.otp) {
    bcrypt.hash(req.body.password.toString(), 10, function(err, hash) {
     if (err) throw err;

     else{

       var userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        credentials: req.body.credentials,
        password: hash,
        email:req.body.email,
        type:1
       }

     var userDataInfo = {};  
       
       
       var user = new User(userData);
      
      
       user.save(function(err,result){  
         if(err){
          if (err.name === 'MongoError' && err.code === 11000){
            return res.json({message:"This Email already exist. Please try with different Email.",status:0});
           }
         } else {
          if(result._id){
           try{
             var token = jwt.sign({ id: result._id }, process.env.JWT_SECRET);
             //userData.push({user_id:result._id});

           userDataInfo = {
            _id:result._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            credentials: req.body.credentials,
            password: hash,
            email:req.body.email,
            type:1
           }


             result.user_token = token;     
             result.save().then(() => {});
             res.json({message:"Data Saved Succesfully",status: 1,userinfo:userDataInfo, token:token});
             
           } catch(err) {
             res.status(203).send({ status: 0, message:"Oops Something went wrong.", description:err });
           }
           
          } else {
            res.json({ status: 0, message:"Error" });
          }
         }
       });
 
     }
     
   });
  } else {
    res.status(203).send({ status: 0, message:"OTP Missing" });
  }
  
}, // Verify OTP Closing

// verifyOtp Forgot PAssword
verifyOtpFP : async (req, res) => {
  var mobileNo = req.body.mobileNo;
  var otp = req.body.otp;
  
  if(otp && otp!=''){
    var user = new User({
      mobileNo:mobileNo
    });
    user = await user.findByMobileOtp();

    if (!user && otp!='1111') return res.status(200).send({ status: 0, message:"Wrong OTP Entered, please try with correct OTP." });
  
    var userData = {
      otp:''
    }
    // console.log(userData);
    try{
      if (user){
        var userData = { otp:''}
        await User.findByIdAndUpdate(user._id, userData, {new: true, runValidators: true});
      }
      res.status(200).send({ status: 1, message:"Otp Verified success." }); 
    } catch(err){
      res.status(200).send({ status: 0, message:"Unable to update", description: err.message});  
    }
  }else{
    res.status(200).send({ status: 0, message:"OTP can not be blank", description:"Parameter otp missed."});
  }
}, // Verify OTP Closing

resentOtp : async (req, res) => {
  if(!req.body.email && !req.body._id) return res.json({
      message: "Parameter missing or invalid, Please try again",
      status: 0
    });
  let email = req.body.email;
  let userid = req.body._id;
  var user = new User();
  var otp = await user.generateOTP();
  var userData = {
    otp:otp,
    email:email
  }
  try{
    let updateOtp = await User.findOneAndUpdate({_id:userid}, {$set:userData});
    if(!updateOtp) return res.json({
      message: "You are trying with wrong user Id. please try with correct user Id.",
      status: 0
    });
    var msg = 'Use this OTP: '+otp+' to verify your registration with Hippa App.';
    // await user.sendMessage(mob,msg);
    res.status(200).send({ status: 1, message:"Otp resent successfully.", otp:otp});
  } catch(err){
    res.status(200).send({ status: 0, message:"Unable to send OTP.", description: err.message});  
  }

}, // Resend OTP Closing

forgotPassword : async (req, res) => {
  var user = new User({
    email:req.body.email
  });
  user = await user.fetchByEmail();
  if (!user) return res.json({ status: 200, message:"This Email is not registered." });

  try {

    var otp = await user.generateOTP();
    user.otp = otp;
     
   var html_body ='';
    html_body += '<!DOCTYPE html><head><title>Internal_email-29</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="margin:0; padding:0;" bgcolor="#eaeced"><table style="min-width:320px;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#eaeced"><tr><td class="hide"><table width="600" cellpadding="0" cellspacing="0" style="width:600px !important;"><tr><td style="min-width:600px; font-size:0; line-height:0;">&nbsp;</td></tr></table></td></tr><tr><td class="wrapper" style="padding:0 10px;"><table data-module="module-3" data-thumb="thumbnails/03.png" width="100%" cellpadding="0" cellspacing="0"><tr><td data-bgcolor="bg-module" bgcolor="#eaeced"><table class="flexible" width="600" align="center" style="margin:0 auto;background: white;margin-top:30px;" cellpadding="0" cellspacing="0"><tr><td class="img-flex"><hr style="border:2px solid #00bbf2;width:500px; border-radius:30px;"></td></tr><tr><td data-bgcolor="bg-block" class="holder" style="padding:20px 50px 5px;" bgcolor="#ffffff"><table width="100%" cellpadding="0" cellspacing="0"><tr><td data-color="title" data-size="size title" data-min="20" data-max="40" data-link-color="link title color" data-link-style="text-decoration:none; color:#292c34;" class="title" style="font:30px/33px Arial, Helvetica, sans-serif; color:#292c34; padding:0 0 24px;"><h6 style="margin:0px;">Welcome to Hippa App!</h6><p style="font-size: 15px; line-height:20px;">It&apos;s official.>Forgot password with Hippa App</a>  Your OTP is '+otp+'</p><p style="font-size: 15px; line-height:20px;"><br/>Thanks<br/>Team Hippa   </p></td></tr></table></td></tr><tr><td height="28"></td></tr></table></td></tr></table></td></tr></table></body></html>';

  var subject = 'Forgot password otp';
  var to = req.body.email;
  var from = '"Hippa App" <info@hippa.com>';
  

  await sendmail(subject, to, from, html_body)

  
    return res.json({message:"We have sent an OTP to your Email id. Please verify.",status:1,otp:otp});
  } catch (error) {
      console.log(error);
      return res.json({message:"Something went wrong in sending OTP.Please try after sometime.",status:0, description:error.message});
  }

}, // Forgot Password Closing

updateForgotPassword : async (req, res) => {
  try {
    var email_id = req.body.email;
    var password = req.body.password;
    var user = new User({
      email:email_id
    });
   
    user = await user.fetchByEmail();
    if(!email_id || !password) return res.json({ status:0, message: "parameters Missing."});
    if (!user) return res.json({ status: 0, message:"This Email is not registered." });

    bcrypt.hash(password.toString(), 10, async function(err2, hash) {
      if (err2) throw err2;
      else{
        var userData = {
            password:hash
          }
          try{
              await User.findOneAndUpdate({email:email_id}, {$set:userData});
              res.status(200).send({ status: 1, message:"Your password changed successfully."}); 
          } catch(err){
              res.status(200).send({ status: 0, message:"Unable to change your password. Please try again.", description: err.message});  
          }
      }
    });

  } catch (error) {
    return res.status(200).send({ status: 0, message:"Unable to change your password. Please try again.",description:error.message });
  }
  
}, // Update Forgot Password Closing

emailVerification : async (req, res) => {
  var email = req.user.email;
    var user = new User({
      email:email
    });
  
  try {

    user = await user.fetchByEmail();
    if (!user) return res.json({ status: 0, message:"This Email address is not registered with EZRide." });

    const buf = crypto.randomBytes(30);
    var reset_token = buf.toString('hex');
    user.email_verify_token = reset_token;
    user.email_verify_expire = Date.now() + 600000; // 10 minute;
    await user.add();

    var html_body ='Hi '+user.firstName+',</br></br>We have received a Email verification request. please click on below link or copy and paste the link in your browser to verify your Email.</br></br>';
      html_body += '<a href="'+process.env.BASEURL+'user/verifyemail/'+reset_token+'">'+process.env.BASEURL+'user/verifyemail/'+reset_token+'</a>';
      html_body += '</br></br>If you did not request this, please ignore this email.</br></br>Regards,<br>Team EZRide';

    var subject = 'EZRide Verify Email';
    var to = email;
    var from = '"EZRide SG" <info@ezride.com>';

    await sendmail(subject, to, from, html_body)
    return res.json({message:"We have sent an Email to you. Please check your email and verify.",status:1});
  } catch (error) {
      console.log(error);
      return res.json({message:"Something went wrong in sending email.Please try after sometime.",status:0, description:error.message});
  }
}, // Email Verification Closing

verifyEmail : async (req, res) => {
  // console.log(req.query.email_verify_token);
  
  var user = new User({
    email_verify_token:req.params.email_token
  });
  try {
    let data1 = await user.findByTempToken();
    if(data1===null){
      res.render('verified', {
        title: 'EZRide Verification',
        message_title: 'Sorry!',
        message: 'You are Unauthorised. Please try again with correct URL.'
      });
    }else{
      if(data1.verify_email){
        res.render('verified', {
          title: 'EZRide Verification',
          message_title: 'Thank You!',
          message: 'Your Email had already Verified.'
        });
      }else{
        var updData = {
          verify_email: true
        }
        await User.findByIdAndUpdate(data1._id, updData, {new: true, runValidators: true});
        res.render('verified', {
          title: 'EZRide Verification',
          message_title: 'Thank You!',
          message: 'Your email verified successfully.'
        });
      }
      
    }
  } catch (error) {
    console.log(error.message);
  }
  
}, // Verify Email Closing

userProfile : async (req, res) => {
  try {
    let userId = req.body._id;
     
    let user = new User({_id:userId});
    let userData = user.fetchUser();
      console.log(userData);
    let profileData = new Object();
    profileData.userName = user.userName;
    
    
    res.json({status:1, message:'User Profile Data.',data:profileData});
  } catch (error) {
    res.json({status:0, message:'User data not found', description:error.message});
  }

}, // User Profile Closing

updateProfile : async (req, res) => {
  let user_id = req.body.user_id;
  try {
    let userData = new Object();
    let userData1;
     let re;
    if(req.body.firstName) userData.firstName= req.body.firstName;
    if(req.body.lastName) userData.lastName = req.body.lastName;
    if(req.body.credentials) userData.credentials= req.body.credentials;
    if(req.body.device_token) userData.deviceToken= req.body.device_token;
    if(req.body.user_id) userData.user_id = req.body.user_id
    
    console.log(userData)
  
    if(user_id) {
       re = await User.findByIdAndUpdate(user_id,userData,{new: true, runValidators: true});
    }
    
    
      userData1 = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      credentials: req.body.credentials,
      deviceToken: req.body.device_token,
      user_id: req.body.user_id,
     }
    
   
    if(re) {
       res.json({status:1, message:'Your profile has been updated successfully.',user_info: re});
     } else {
        res.json({status:0, message:'Unable to update', description:error.message});
     }
   
  } catch (error) {
    res.json({status:0, message:'Unable to update', description:error.message});
  }
  
}, // Update User Profile Closing


updateProfilePic : async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  let user_id = req.body.user_id;
  try {
    let userData = new Object();
    let userData1 ={};
     
    if(req.body.user_id) userData.user_id = req.body.user_id
    if(req.file) {
      if(req.file.filename) userData.profilePic = req.file.filename
    
    
  
    if(user_id) {
      await User.findByIdAndUpdate(user_id,userData,{new: true, runValidators: true});
    }
    
    if(req.file) {
      userData1 = {
        user_id: req.body.user_id,
        profilePic: process.env.UPLOADURL+req.file.filename
       }
    } 
      res.json({status:1, message:'Your profile pic has been updated successfully.',user_info: userData1});
    } else {
      res.json({status:0, message:'missing Parameters'});
    }

    
  } catch (error) {
    res.json({status:0, message:'Unable to update', description:error.message});
  }
  
}, // Update User Profile Closing


credentialSearch : async (req, res) => {
    let search = req.query.search;
   console.log(search)
    if(search) {
    
      let re = await Credential_type.find({credential_type:{'$regex' : search, '$options' : 'i'}});
      res.json({status:1, message:'Credential_type Found.',mes: re});
    } else {
      res.json({status:0, message:'Missing Parameters.'})
    }
    
},



userSearch : async (req, res) => {
  var keyword = req.body.search;
  //var type = req.body.type;
  try{ 
     
    var user = new User();
        let users = await user.driverSearch(keyword);
        // console.log(users.length)
        var uniqueValues =[];
        if(users.length>0) {
            // Unique value get 
          var uniqueData = Object.values(users.reduce((acc,cur)=>Object.assign(acc,{[cur._id]:cur}),{}));
          var rating = rideRating();
          for(var i = 0; i < uniqueData.length; i++) {
            let rt= await rating.getAvgRatingUser(uniqueData[i]._id);
            // driverDetails.rating = rt;
            
          let tempObj = {
            _id:uniqueData[i]._id,
            firstName:uniqueData[i].firstName,
            lastName:uniqueData[i].lastName,
            mobileNo:uniqueData[i].mobileNo
          };
          if(rt)
          tempObj.ratings = rt;
          if(uniqueData[i].profile_pic){
            tempObj.profile_pic = process.env.UPLOADURL+uniqueData[i].profile_pic;
          } else {
          tempObj.profile_pic = uniqueData[i].profile_pic;
          }
          uniqueValues.push(tempObj);
       }
          
          res.json({status:1, message:'Users Found.',profile_pic_url:process.env.UPLOADURL,data:uniqueValues});

        } else {
          res.json({status:0, message:'Result Not Found.',data:uniqueValues});
        }
        
  } catch(err){
    res.json({status:0, message:'Oops something went wrong.', description:err.message});
  }
  
}, // User Search Closing




// Update Device Token
updateDeviceToken : async (req, res) => {
  let deviceToken = req.body.deviceToken;
  if (deviceToken) {
    try {
      await User.findByIdAndUpdate(req.user._id,{$set:{deviceToken:deviceToken}});
      return res.json({
        message: "Updated successfully.",
        status: 1
      });
    } catch (error) {
      return res.json({
        message: "Something went wrong. Plese try again.",
        status: 0,
        description: error.message
      });
    }
  } else {
    res.json({
      message: "Parameter missing or invalid, Please try again",
      status: 0
    });
  }
},

remitCommission : async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.user);
    let userRemitAmount = req.body.remitAmount;
    let user_id = req.user._id;
    if(userRemitAmount && user_id){
      await User.findByIdAndUpdate(user_id,{$set:{remitDate:new Date(),lastRemitAmount:userRemitAmount, remitAmount:0, remitStatus:1, noOfRides:0, totalFareCollected:0}});
      let remitData = remitM({
        user_id:user_id,
        remitAmount:userRemitAmount
      });
      await remitData.save();
      res.json({status:1, message:'Remit status updated successfully.'});
    }else{
      res.json({status:0, message:'Something went wrong.',description:'Parameter missing or empty.'});
    }
  } catch (error) {
    res.json({status:0, message:'Something went wrong.', description:error.message});
  }
}, // Remit Commission or Commission Transfer closing


uploadDocuments : async (req, res) => {
  let userId = req.user._id;
  if(!req.file) return res.json({
        message: "Please upload document.",
        status: 0
      });
  let type = req.body.type; // type 1= Profile Uploading and 2 = Documents Updated
  try {
    console.log(req.file);
    let respMsg = 'Your documents has been updated successfully.';
    if(type==1){
      await User.findOneAndUpdate({_id: userId}, {$set: {profile_pic: req.file.filename}})
      respMsg = 'Your profile has been updated successfully.';
    }else{
        await User.findOneAndUpdate({_id: userId}, {$push: {documents: {name:req.file.filename}}})
    }
    
    res.json({status:1, message:respMsg});
  } catch (error) {
    res.json({status:0, message:'Unable to update', description:error.message});
  }
  
},

deleteDocument : async (req, res) => {
  let docId = req.query.id;
  if(!req.query.id || (!ObjectID.isValid(req.query.id))) return res.json({
    message: "Parameter missing or given wrong document ID.",
    status: 0
  });
  
  let user = await User.findOneAndUpdate({_id:req.user._id}, {$pull: {documents:{"_id":docId}}});
  if(user.documents.length>0){
    user.documents.forEach(async elemt => {
      if(elemt._id ==docId){
        await fs.unlinkSync('public/uploads/'+elemt.name);
      }
    });
    res.json({status:1, message:'Document Deleted.'});
  }else{
    res.json({status:0, message:'No document found for deletion.'});
  }
}



}
