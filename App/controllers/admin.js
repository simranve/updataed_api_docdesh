const patientRefferel = require('./../models/patientRefferel_m');

const User = require('../models/userModel');

const educationVideo = require('./../models/educationVideo_m');

const Servey = require('./../models/survey_m');

const Notifications = require('../models/notifications_m');

const Pages = require('./../models/pages_m');

const pateintRefferelDose = require('./../models/pateintRefferelDose_m')

const patientConstent = require('./../models/patientConstent_m');
// const pdfTemplate = require('./../Document/index')
const storeTimings = require('./../models/storeTimings');
const patientDocument = require('./../models/patientDocument');

const answersSubmition = require('./../models/answersSubmition')
var ObjectId = require('mongodb').ObjectID;
// const pdf = require('html-pdf')
const puppeteer = require('puppeteer');
const fs = require('fs');



var youtubeThumbnail = require('youtube-thumbnail');

const {sendPushNotification, sendPushNotificationIOS,sendPushNotificationAndroid,sendMessageIOS} = require('./../services/sendmail');

module.exports = {
   

    adminSignIn : async (req, res) => {
        try {
    
        var user = new User({
          email:req.body.email,
          type:3
        });
        
        user = await user.AdminfetchByEmail();
        
        if (!user) return res.status(200).send({ status: 0, auth: false, token: null, message:"User not found." });
        var passwordIsValid = bcrypt.compare(req.body.password, user.password, async function(err, res1) {
          if(res1 == true){
            let checkActive = await User.findOne({email:req.body.email,type:3}, 'status');
            if(checkActive.status==1 || checkActive.status==0){
              var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
              user.user_token = token;
              if(req.body.deviceToken) user.deviceToken = req.body.deviceToken;
              if(user.smoke ==''){
                user.smoke = false;
              }
              await user.add();
              let data = await user.fetchUser(); 
              if(data.profilePic) {
                data.profilePic = process.env.UPLOADURL+data.profilePic;
              } else {
                data.profilePic = ''; 
              }
              
              if(data.email){
                res.status(200).send({ status: 1, auth: true, token: token, message:"Login Success.", data });
              }else{
                res.status(401).send({ status: 0, auth: true, token: token, message:"Email id is not verified.", data });
              }
            }else{
              let respMsg;
              switch (checkActive.status) {
                case 2:
                  respMsg = "Your account is pending in Admin Review."
                    break;
                case 3:
                  respMsg = "Your account is On Hold."
                    break;
                case 4:
                  respMsg = "Your account is Cancelled."
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

  userProfile : async (req, res) => {
    try {
      let userId = req.params.id;
      console.log(userId)
       
      let user = new User({_id:userId});
      let userData = await user.fetchUser();
        
      // if(userData.profilePic){
      //   userData.profilePic = process.env.UPLOADURL+userData.profilePic
      // } else {
      //   userData.profilePic = ''
      // }
      
      //  console.log(userData)


      res.json({status:1, message:'User Profile Data.',payload:userData});
    } catch (error) {
      res.json({status:0, message:'User data not found', payload:error.message});
    }

  }, // User Profile Closing
  
    // Start Patient methods
    refferelRegistration :  async (req, res) =>{
        
        if(req.body.patient_name && req.body.facility_name) {
            let refferelDetails = {
                patient_name:req.body.patient_name,
                facility_name:req.body.facility_name,
                room_number:req.body.room_number,
                reason:req.body.reason,
                user_id:req.body.user_id
            }
            var refferel = new patientRefferel(refferelDetails);
    
            refferel.save(function(err, result){
                if(err){
                    res.json({status:0,message:'Oops Something went wrong', err});
                } else {
                    res.json({status:1,message:'Patient Added Succesfully'})
                }
            })
        } else {
             res.json({status:0,message:'Missing parameters!!!'})
        }
        
    },

    getRefferelPatient :  async (req, res) =>{
      
    	let providers = await patientRefferel.aggregate([
        { $lookup:
           {
             from: 'users',
             localField: 'refferelId',
             foreignField: '_id',
             as: 'userdetails'
           }
         }
        ]).match({patient_name:{$ne:''}})
          .project({
        fieldExists:{$cond:[{$eq:["$patient_image", null]}, false, true]},
        profilePic:{
        $concat: [process.env.UPLOADURL,'',"$patient_image"]
        },
            senderphoneNumber:"$userdetails.phoneNumber",
            senderfirstName:"$userdetails.firstName",
            senderlastName:"$userdetails.lastName",
            patient_name:"$patient_name",
            patient_image:"$patient_image",
            facility_name:"$facility_name",
            email:"$email",
            room_number:"$room_number",
            reason:"$reason",	
            type:"$type",
            _id:"$_id",
            user_id:"$user_id",
            createdAt:"$createdAt",
            refferal_type:"$refferal_type"
        }).sort({createdAt:-1})

      	
        

        if(providers) {
            res.json({status:1,message:'Result Found',payload:providers});
        } else {
            res.json({status:0,message:'Result Not Found',payload:providers});
        }
        
        //let pateint = await patientRefferel.find({}).sort({createdAt:-1});
             
         
           

      

        // if(pateint) {
        	
        //     res.json({status:1,message:'Result Found',payload:pateint});
        // } else {
        //     res.json({status:0,message:'Result Not Found',payload:pateint});
        // }
    },

    getPatientDose : async (req, res) =>{
      let Dose = await pateintRefferelDose.aggregate([
        { $lookup:
           {
             from: 'users',
             localField: 'refferelId',
             foreignField: '_id',
             as: 'userdetails'
           }
         }
        ]).match({patient_name:{$ne:''}})
        .project({
          fieldExists:{$cond:[{$eq:["$patient_image", null]}, false, true]},
          profilePic:{
          $concat: [process.env.UPLOADURL,'',"$patient_image"]
          },
              senderphoneNumber:"$userdetails.phoneNumber",
              senderfirstName:"$userdetails.firstName",
              senderlastName:"$userdetails.lastName",
              patient_name:"$patient_name",
              patient_dob:"$patient_dob",
              patient_location:"$patient_location",
              name_of_medicine:"$name_of_medicine",
              dose_of_medicine:"$dose_of_medicine",
              pharmacy_name:"$pharmacy_name",	
              pharmacy_fax_no:"$pharmacy_fax_no",
              prn_text:"$prn_text",
              pharmacy_phone_number:"$pharmacy_phone_number",
              yourfaxNumber:"$yourfaxNumber",
              createdAt:"$createdAt"
          }).sort({createdAt:-1});
        if(Dose) {
            res.json({status:1,message:'Result Found',payload:Dose});
        } else {
            res.json({status:0,message:'Result Not Found',payload:Dose});
        }
    },


     patientDose :  async (req, res) =>{
        
        if(req.body.patient_name && req.body.patient_dob) {
            
            let refferelDetails = {
                patient_name:req.body.patient_name,
                patient_dob:req.body.patient_dob,
                patient_location:req.body.patient_location,
                name_of_medicine:req.body.name_of_medicine,
                dose_of_medicine:req.body.dose_of_medicine,
                frequency_dose:req.body.frequency_dose,
                pharmacy_name:req.body.pharmacy_name,
                pharmacy_fax_no:req.body.pharmacy_fax_no,
                prn_text:req.body.prn_text,
                user_id:req.body.user_id,
                yourfaxNumber:req.body.yourfaxNumber,
                pharmacy_phone_number:req.body.pharmacy_phone_number,
                refferelId:req.body.user_id
            }

            var refferelDose = new pateintRefferelDose(refferelDetails);
    
            refferelDose.save(function(err, result){
                if(err){
                    res.json({status:0,message:'Oops Something went wrong', err});
                } else {
                    res.json({status:1,message:'Patient Dose Added Succesfully',payload:result})
                }
            })
        } else {
             res.json({status:0,message:'Missing parameters!!!'})
        }
        
    },

    patientDoseUpdate : async (req, res) =>{
        
        if(req.body.patient_name && req.body.patient_dob && req.params.id) {
            
            let refferelDetails = {
                patient_name:req.body.patient_name,
                patient_dob:req.body.patient_dob,
                patient_location:req.body.patient_location,
                name_of_medicine:req.body.name_of_medicine,
                dose_of_medicine:req.body.dose_of_medicine,
                frequency_dose:req.body.frequency_dose,
                pharmacy_name:req.body.pharmacy_name,
                pharmacy_fax_no:req.body.pharmacy_fax_no,
                prn_text:req.body.prn_text,
                yourfaxNumber:req.body.yourfaxNumber,
                pharmacy_phone_number:req.body.pharmacy_phone_number,
            }

            let doseId = {
              _id:req.params.id
            }
                  
            let ret = await pateintRefferelDose.update(doseId, {$set:refferelDetails});
              if(ret) {
                    res.json({status:1, message:'Patient Dose Updated Succesfully',payload:ret});
              } else {
                res.json({status:0, message: 'Oops Something went wrong.'})
              }
    
            
        } else {
             res.json({status:0,message:'Missing parameters!!!'})
        }
        
    },

      patientDoseDelete:  async (req, res) =>{
      if(req.params.id) {
          let obj = {
              _id:req.params.id
          }
        pateintRefferelDose.remove(obj, function(err,result){
            if(err){
                console.log(err)
            } else {
                res.json({status:1, message:'Deleted Successfully', payload:result});
            }
        })
      } else {
        res.json({status:0, message:'Missing Parameters!!!'})
      }
    },

  // pateint delete
    patientDelete:  async (req, res) =>{
      if(req.params.id) {
          let obj = {
              _id:req.params.id
          }
          patientRefferel.remove(obj, function(err,result){
            if(err){
                console.log(err)
            } else {
                res.json({status:1, message:'Deleted Successfully', payload:result});
            }
        })
      } else {
        res.json({status:0, message:'Missing Parameters!!!'})
      }
    },

    // Start Contact Providers Methods

    contactAdd: async (req, res)=>{

        if(req.body.email) {
         
            bcrypt.hash(req.body.password.toString(), 10, function(err, hash) {
              if (err) throw err;
          
              else{
              
                
                if(req.file){
                   var fileName = req.file.filename;
                 }


              
                let contactDetails = {
                  firstName:req.body.firstName,
                  lastName:req.body.lastName,
                  phoneNumber:req.body.phoneNumber,
                  email:req.body.email,
                  about:req.body.about,
                  password:hash,
                  type:1,
                  providerStatus:req.body.providerStatus,
                  userStatus:1,
                  specialist:req.body.specialist,
                  profilePic:fileName
                }
              
            
                let user = new User(contactDetails);
                    
            
                user.save(function(err,result){  
                  if(err){
                   if (err.name === 'MongoError' && err.code === 11000){
                     return res.json({message:"This Email already exist. Please try with different Email.",status:0});
                    }
                  } else {
                   if(result._id){
                    try{
                      var token = jwt.sign({ id: result._id }, process.env.JWT_SECRET);
                      result.user_token = token;
                         
                     
                      result.profilePic = process.env.UPLOADURL+result.profilePic;  
                      res.json({status:1,message:'Contact Provider Added Successfully.',payload:result})
                      
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
            res.json({status:0,message:'Missing Parameters.'})
          }
       },


        // Start Contact Providers Methods

        contactUpdate_user: async (req, res)=>{
      
                var contactDetails = {
                  firstName:req.body.firstName,
                  lastName:req.body.lastName,
                  phoneNumber:req.body.phoneNumber,
                  email:req.body.email,
                  // about:req.body.about,
                  // type:1,
                  providerStatus:req.body.providerStatus,
                  userStatus:1,
                  specialist:req.body.specialist
                }

                if(req.file){
         	       contactDetails.profilePic = req.file.filename;
             }


  
              
    
			 User.findByIdAndUpdate(req.params.id, contactDetails, {new: true}, function(err, response) {
			    if(err){
			      return res.send({
			        status: 400,
			        message: "Provider Not Updated successfully",
			        data: err
			      });   
			    }
			      return res.send({
			        status: 1,
			        message: "Provider Updated successfully",
			        data: response
			      });
			  })
          
              
          
          
       },contactUpdate: async (req, res)=>{
      
        var contactDetails = {
          firstName:req.body.firstName,
          lastName:req.body.lastName,
          phoneNumber:req.body.phoneNumber,
          email:req.body.email,
          about:req.body.about,
          type:1,
          providerStatus:req.body.providerStatus,
          userStatus:1,
          specialist:req.body.specialist
        }

        if(req.file){
          contactDetails.profilePic = req.file.filename;
     }



      

User.findByIdAndUpdate(req.params.id, contactDetails, {new: true}, function(err, response) {
  if(err){
    return res.send({
      status: 400,
      message: "Provider Not Updated successfully",
      data: err
    });   
  }
    return res.send({
      status: 1,
      message: "Provider Updated successfully",
      data: response
    });
})
  
      
  
  
},
       users_list : async (req, res) =>{

        let providers = await User.aggregate()
        // .match({type:{$ne:1, $ne:3}})
        .match({ type: { $nin: [1,3] } })
          .project({
        fieldExists:{$cond:[{$eq:["$profilePic", null]}, false, true]},
        abouFiels:{$cond:[{$eq:["$about", null]}, false, true]},
        profilePic:{
        $concat: [process.env.UPLOADURL,'',"$profilePic"]
        },
            firstName:"$firstName",
            lastName:"$lastName",
            email:"$email",
            deviceToken:"$deviceToken",
            profilePicName:"$profilePic",
            specialist:"$specialist",
            password:"$password",
            phoneNumber:"$phoneNumber",	
            type:"$type",
            specialist:"$specialist",
            about:"$about",
            credentials:"$credentials",
            userStatus:"$userStatus",
            providerStatus:"$providerStatus",
            createdAt:"$createdAt",
        }).sort({createdAt:-1})
        if(providers) {
            res.json({status:1,message:'Result Found',payload:providers});
        } else {
            res.json({status:0,message:'Result Not Found',payload:providers});
        }
    },
  //   get_timings : async (req, res) =>{

  //     let providers = await openingTime.find({}).populate('doc_id').populate('day_id')
  //     .exec();

  //     // let providers = await openingTime.find({}).populate({ path: 'day_id', select: 'days' })..populate('doc_id')
  //     // .exec();

  //     //res.json({status:1,message:'Result Found',payload:providers});

  //     let ContactData = [];
  //     // let ContactData;
  //     providers.forEach(ro => {
  //       if(ro.day_id.days ==='Monday') {
  //         ContactData.push({
  //           doc_id:ro.doc_id._id,
  //           firstName:ro.doc_id.firstName,
  //           lastName:ro.doc_id.lastName,
  //           sundayTiming: "",
  //           Mondaytiming: ro.openingTime+" "+ro.closingTime,
  //           Tuesdaytiming: "",
  //           Wednesdaytiming: "",
  //           Thursdaytiming: "",
  //           Fridaytiming: "",
  //           SaturdayTiming:""
  //         })
  //       }
        
  //       else if(ro.day_id.days ==='Sunday'){
  //         ContactData.push({
  //           doc_id:ro.doc_id._id,
  //           firstName:ro.doc_id.firstName,
  //           lastName:ro.doc_id.lastName,
  //           sundayTiming: ro.openingTime+" "+ro.closingTime,
  //           Mondaytiming: "",
  //           Tuesdaytiming: "",
  //           Wednesdaytiming: "",
  //           Thursdaytiming: "",
  //           Fridaytiming: "",
  //           SaturdayTiming:""
  //         })
  //       }
  //       else if(ro.day_id.days ==='Tuesday'){
  //         ContactData.push({
  //           doc_id:ro.doc_id._id,
  //           firstName:ro.doc_id.firstName,
  //           lastName:ro.doc_id.lastName,
  //           sundayTiming: "",
  //           Mondaytiming: "",
  //           Tuesdaytiming: ro.openingTime+" "+ro.closingTime,
  //           Wednesdaytiming: "",
  //           Thursdaytiming: "",
  //           Fridaytiming: "",
  //           SaturdayTiming:""
  //         })
  //       }
  //       else if(ro.day_id.days ==='Wednesday'){
  //         ContactData.push({
  //           doc_id:ro.doc_id._id,
  //           firstName:ro.doc_id.firstName,
  //           lastName:ro.doc_id.lastName,
  //           sundayTiming: "",
  //           Mondaytiming: "",
  //           Tuesdaytiming: "",
  //           Wednesdaytiming: ro.openingTime+" "+ro.closingTime,
  //           Thursdaytiming: "",
  //           Fridaytiming: "",
  //           SaturdayTiming:""
  //         })
  //       }
  //       else if(ro.day_id.days ==='Thursday'){
  //         ContactData.push({
  //           doc_id:ro.doc_id._id,
  //           firstName:ro.doc_id.firstName,
  //           lastName:ro.doc_id.lastName,
  //           sundayTiming: "",
  //           Mondaytiming: "",
  //           Tuesdaytiming: "",
  //           Wednesdaytiming: "",
  //           Thursdaytiming: ro.openingTime+" "+ro.closingTime,
  //           Fridaytiming: "",
  //           SaturdayTiming:""
  //         })
  //       }
  //       else if(ro.day_id.days ==='Friday'){
  //         ContactData.push({
  //           doc_id:ro.doc_id._id,
  //           firstName:ro.doc_id.firstName,
  //           lastName:ro.doc_id.lastName,
  //           sundayTiming: "",
  //           Mondaytiming: "",
  //           Tuesdaytiming: "",
  //           Wednesdaytiming: "",
  //           Thursdaytiming: "",
  //           Fridaytiming: ro.openingTime+" "+ro.closingTime,
  //           SaturdayTiming:""
  //         })
  //       }else if(ro.day_id.days ==='Saturday'){
  //         ContactData.push({
  //           doc_id:ro.doc_id._id,
  //           firstName:ro.doc_id.firstName,
  //           lastName:ro.doc_id.lastName,
  //           sundayTiming: "",
  //           Mondaytiming: "",
  //           Tuesdaytiming: "",
  //           Wednesdaytiming: "",
  //           Thursdaytiming: "",
  //           Fridaytiming: "",
  //           SaturdayTiming:ro.openingTime+" "+ro.closingTime
  //         })
  //       }
  //     });
      
  //     // ContactData.forEach(ro=>{
  //     //   let newArray = ro;


  //     // })

      



  //     if(ContactData) {
  //       res.json({status:1,message:'Result Found',payload:ContactData});
  //   } else {
  //       res.json({status:0,message:'Result Not Found',payload:ContactData});
  //   }
  //   //   contacts.forEach(ro=>{
  //   //     ContactData.push({
  //   //         _id:ro._id,
  //   //         phoneNumber:ro.phoneNumber,
  //   //         specialist:ro.specialist,
  //   //         firstName:ro.firstName,
  //   //         lastName:ro.lastName,
  //   //         providerStatus:ro.providerStatus,
  //   //         userStatus:ro.userStatus,
  //   //         profilePic:process.env.UPLOADURL+ro.profilePic
  //   //     });
  //   // })
    
  // },
  get_timings : async (req, res) =>{

    let providers = await storeTimings.find({}).populate('doc_id')
    // .populate('doc_id').populate('day_id')
    // .exec();

    if(providers) {
      res.json({status:1,message:'Result Found',payload:providers});
  } else {
      res.json({status:0,message:'Result Not Found',payload:providers});
  }
  
},
get_other_provders : async (req, res) =>{

  let providers = await storeTimings.find({})
  // .populate('doc_id').populate('day_id')
  // .exec();
let provider_id_array = [];
providers.forEach(element => {
  // provider_id_array[] = element
  // provider_id_array.push(element)
  provider_id_array.push(element.doc_id)

});
  let user_data = await User.find({
    $and: [{type:1}, { _id: { $nin: provider_id_array } }]})
    // _id: { $nin: provider_id_array } } )
  if(user_data) {
    res.json({status:1,message:'Result Found',payload:user_data});
} else {
    res.json({status:0,message:'Result Not Found',payload:user_data});
}

},
    contactProviders : async (req, res) =>{

        let providers = await User.aggregate().match({type:1})
          .project({
        fieldExists:{$cond:[{$eq:["$profilePic", null]}, false, true]},
        abouFiels:{$cond:[{$eq:["$about", null]}, false, true]},
        profilePic:{
        $concat: [process.env.UPLOADURL,'',"$profilePic"]
        },
            firstName:"$firstName",
            lastName:"$lastName",
            email:"$email",
            deviceToken:"$deviceToken",
            profilePicName:"$profilePic",
            specialist:"$specialist",
            password:"$password",
            phoneNumber:"$phoneNumber",	
            type:"$type",
            specialist:"$specialist",
            about:"$about",
            credentials:"$credentials",
            userStatus:"$userStatus",
            providerStatus:"$providerStatus",
            createdAt:"$createdAt",
        }).sort({createdAt:-1})
        if(providers) {
            res.json({status:1,message:'Result Found',payload:providers});
        } else {
            res.json({status:0,message:'Result Not Found',payload:providers});
        }
    },

    
    contactDelete:  async (req, res) =>{
    if(req.params.id) {
        let obj = {
            _id:req.params.id
        }
      User.remove(obj, function(err,result){
          if(err){
              console.log(err)
          } else {
              res.json({status:1, message:'Deleted Successfully', payload:result});
          }
      })
    } else {
      res.json({status:0, message:'Missing Parameters!!!'})
    }
  },
   

  // Start Videos Methods
  getVideos : async (req, res) =>{
     
        let getVideos = await educationVideo.find({video_type: 1}).sort({_id:-1});
         if(getVideos) {
             res.json({status:1, message:'All Education Videos', payload:getVideos});
         } else {
             res.json({status:0, message:'Results not found.'})
         }
   },
   getVideos_for_general : async (req, res) =>{
     
    let getVideos = await educationVideo.find({video_type: 2}).sort({_id:-1});
     if(getVideos) {
         res.json({status:1, message:'All Education Videos', payload:getVideos});
     } else {
         res.json({status:0, message:'Results not found.'})
     }
},
get_all_videos_psych_medical: async (req, res) =>{
     
  let getVideos = await Servey.find({servey_type: 4}).sort({_id:-1});
   if(getVideos) {
       res.json({status:1, message:'All Education Videos', payload:getVideos});
   } else {
       res.json({status:0, message:'Results not found.'})
   }
},
get_all_videos_psych_disorder: async (req, res) =>{
     
  let getVideos = await Servey.find({servey_type: 5}).sort({_id:-1});
   if(getVideos) {
       res.json({status:1, message:'All Education Videos', payload:getVideos});
   } else {
       res.json({status:0, message:'Results not found.'})
   }
},
   delteVideo : async (req, res) =>{
     if(req.params.id) {
         
        educationVideo.remove({_id:req.params.id}, function(err, result){
            if(err){
                res.json({status:0, message:'Not Deleted Video.',err});
            } else {
                res.json({status:1, message:'Deleted Video.',payload:result});
            }
        })
       
     } else {
        res.json({status:0, message:'Missing Parameters.'})
     }
    
},

   videoSave: async (req, res) =>{

    let video_url = req.body.video_url;

    if(video_url) {
        
      var thumbnail = youtubeThumbnail(video_url);
      
      let video_details = {
        video_type:req.body.video_type,
       user_id:req.body.user_id,
       video_title : req.body.video_title,
       video_description: req.body.video_description,
       video_id : req.body.video_id,
       video_url : video_url,
       video_thumbnail:thumbnail.high.url
      }

     var videos = new educationVideo(video_details)
     videos.save(function(err, result){
         if(err){
           res.json({status:0, message: 'Oops Something went wrong.', err})
         } else {
           res.json({status:1, message:'Video Added Succesfully',payload:result});
         }
     })
    } else {
      res.json({status:0, message:'Missing Parameters!!!'});
    }
   },


    videoUpdate: async (req, res) =>{

    let video_url = req.body.video_url;

    if(video_url && req.params.id) {
        
      var thumbnail = youtubeThumbnail(video_url);
      
      let video_details = {
       user_id:req.body.user_id,
       video_title: req.body.video_title,
       video_description: req.body.video_description,
       video_id: req.body.video_id,
       video_url: video_url,
       video_thumbnail:thumbnail.high.url
      }

      console.log(video_details)

      let vidId = {
          _id:req.params.id
      }



    let ret = await educationVideo.update(vidId, {$set:video_details});
    if(ret) {
          res.json({status:1, message:'Video Updated Succesfully.',payload:ret});
    } else {
      res.json({status:0, message: 'Oops Something went wrong.'})
    }
        
     
    } else {
      res.json({status:0, message:'Missing Parameters!!!'});
    }
   },

   // Start Servey Methods

   surveyRegistration : async (req, res) =>{
  
    var sendRe = {
        servey_title:req.body.servey_title,
        servey_link:req.body.servey_link,
        servey_type:req.body.servey_type
    }  
      
        if(req.body.servey_title && req.body.servey_link) {
           
            let ser = new Servey(sendRe)

            ser.save(function(err,result){
               if(err){
                   res.json({status:0, message:'Oops Something went wrong.',err})
               }

               res.json({status:1, message:'Survey Saved Successfully',payload:result})
            })
        } else {
            res.json({status:0, message:'Missing Parameters!!!'})
        }
   },

   surveyUpdate : async (req, res) =>{
       let servey_id = {
        _id:req.params.id
       }
    var updateObj = {
        servey_title:req.body.servey_title,
        servey_link:req.body.servey_link
    }  
        

        if(req.body.servey_title && req.body.servey_link) {
            Servey.update(servey_id, updateObj, function(err, result){
                if(err){
                   res.json({status:0, message:'Survey is not Updated.', err})
                }  else {
                    res.json({status:1, message:'Survey Updated Successfully.', payload:result})
                }
                
            })
        } else {
            res.json({status:0, message:'Missing Parameters!!!'})
        }
   },

   getServey : async (req, res) =>{
  
    let getServeys = await Servey.find({servey_type:1}).sort({createdAt:-1});
    
         if(getServeys) {
             res.json({status:1, message:'All Survey List', payload:getServeys});
         } else {
             res.json({status:0, message:'Results not found.'})
         }
   },
   getServey_staff : async (req, res) =>{
  
    let getServeys = await Servey.find({servey_type:3}).sort({createdAt:-1});
    
         if(getServeys) {
             res.json({status:1, message:'All Survey List', payload:getServeys});
         } else {
             res.json({status:0, message:'Results not found.'})
         }
   },
   getServey_provider : async (req, res) =>{
  
    let getServeys = await Servey.find({servey_type:6}).sort({createdAt:-1});
    
         if(getServeys) {
             res.json({status:1, message:'All Survey List', payload:getServeys});
         } else {
             res.json({status:0, message:'Results not found.'})
         }
   },
   getMeditations : async (req, res) =>{
  
    let getServeys = await Servey.find({servey_type:2}).sort({createdAt:-1});
    
         if(getServeys) {
             res.json({status:1, message:'All Survey List', payload:getServeys});
         } else {
             res.json({status:0, message:'Results not found.'})
         }
   },
   deleteServey:  async (req, res) =>{
          if(req.params.id) {
              let obj = {
                  _id:req.params.id
              }
            Servey.remove(obj, function(err,result){
                if(err){
                    console.log(err)
                } else {
                    res.json({status:1, message:'Deleted Successfully', payload:result});
                }
            })
           
          } else {
            res.json({status:0, message:'Missing Parameters!!!'})
          }
   },
  

   // Start Notifications Methods 


   
   notificationSave: async (req, res) =>{
        let datatoSend = {
            title:req.body.title,
            content:req.body.content,
            notify_image:req.file.filename
        }

        let notification = new Notifications(datatoSend);

        notification.save(function(err, result){
            if(err){
                res.json({status:0, message:'Oops Something went wrong.'});
            }
            if(req.file.filename) {
             result.notify_image =process.env.UPLOADURL+result.notify_image
            }
            
            res.json({status:1, message:'Notification Sent Succesfully.',payload:result})
        })
   },

    sendMessageToAll: async (req, res) =>{

        if(req.body.title && req.body.content) {
              
        //await Notifications.remove();
          let users = await User.find({deviceToken:{$ne:''}},{deviceToken:1,deviceType:1,_id:1}).sort({createdAt:-1});

            
         let datatoSend = {
            title:req.body.title,
            content:req.body.content,
            notification_type:1
        }

        let notification = new Notifications(datatoSend);

       let badgeCnt = await module.exports.allBadge();

        var arrDeveiceTokenAndroid = [];
            var arrDeveiceTokenIos = [];

        let result = await notification.save();

      
        users.map(ro=>{
                      
                      if(ro.deviceType=='android' && ro.deviceToken.length>20 ) {
                           arrDeveiceTokenAndroid.push(ro.deviceToken)
                        } else if(ro.deviceType=='ios' && ro.deviceToken.length>20) {
                           arrDeveiceTokenIos.push(ro.deviceToken)
                        }    
              })
       

     if(result._id){
      users.map(async ro=>{
                    
                    let cntNotification = await Notifications.findByIdAndUpdate(result._id,
                    {$push: {notificationsUserids:ro._id}},
                );

            })
     }

        

                     let data = {
                        message:req.body.content,
                        title:req.body.title,
                        notification_type:1
                    }

                    const alert_message=req.body.content;
                    var title=req.body.title;
                    const uniqueArrayAndroid = Array.from(new Set(arrDeveiceTokenAndroid));
                    const uniqueArrayIos = Array.from(new Set(arrDeveiceTokenIos));
                    var fcm_tokenAndroid=uniqueArrayAndroid;
                    var fcm_tokenIos=uniqueArrayIos;

                  
                  
          				 const someResult = sendMessageIOS(fcm_tokenIos, title, data, badgeCnt);
          				 const anotherResult = sendPushNotificationAndroid(fcm_tokenAndroid, title, data); 
                   const finalResult = [await someResult, await anotherResult];


                   res.json({status:1,success:true,message:'Notification Sent'})   
           

            } else {
            res.json({message:'Missing parameters !! title and token'})
            }


        },

    sendMessageTo: async (req, res) =>{
        if(req.body.title && req.body.content) {
              
            let arrDeveiceToken = [req.body.token];
              
              let data = {
                content:req.body.content,
                title:req.body.title,
                notification_type:1
            }

                    const alert_message=req.body.content;
                    var title=req.body.title;
                    var fcm_token=arrDeveiceToken;
                   
                     
                    sendPushNotification(fcm_token, title, data).then(function(result){
                        //res.json({success:true})
                        //console.log('success')
                    })
                    .catch(function(err){
                        //res.json({success:false})
                        //console.log('failure')
                    })
                   
           

            } else {
            res.json({message:'Missing parameters !! title and token'})
            }


        },

    getNotification: async (req, res) =>{
        let result = await Notifications.find({notification_type:1}).sort({createdAt:-1});

        if(result.length>0) {
            res.json({status:1,message:'Notification Lists.',payload:result});
        } else {
            res.json({status:0,message:'Notification Not found.',payload:result});
        }
    },

    // Start Pages Methods 

    addPages : async (req, res) =>{
        let data = req.body;
        let updateData = new Object();
       
        if(data){
            if(req.body.about) updateData.about = req.body.about;
            if(req.body.terms_condition) updateData.terms_condition = req.body.terms_condition;
            if(req.body.calling_instruction) updateData.calling_instruction = req.body.calling_instruction;
            if(req.body.contact_mainOffice) updateData.contact_mainOffice = req.body.contact_mainOffice;

                    Pages.update({}, updateData,function(err,result){
                        if(err){
                            res.json({status:0,message:'Not Added page',payload:result})
                        } else {
                            res.json({status:1,message:'Added pages.',payload:result})
                        }
                    })
            

        } else {
            res.json({status:0, message:'Need any Params Like about or terms_conditions or calling Instructions.'})
        }
    },

    getPages : async (req, res) =>{
        let result = await Pages.findOne({}).sort({createdAt:-1});
        if(result) {
            res.json({status:1,message:'Get Pages.',payload:result});
        } else {
            res.json({status:0,message:'Not found.',payload:result});
        }
    },

    allBadge: async() =>{
      
           let cnt =  await Notifications.aggregate( [ 
          
            { $match:  { "status":0  } } ,
            { $group: { _id: "$receiver_id", count: { $sum: 1 } } }
           
            ] )
             
             return cnt.length;
         
      },

      duplicateEmail : async (req, res) =>{
         if(req.body.email) {

             let result = await User.find({email:req.body.email});

              if(result.length>0) {
                  res.json({status:1,message:'Email id is Not Available.',payload:result});
              } else {
                  res.json({status:0,message:'Email is Available.',payload:result});
              }
         }
        
    },

    // fetch_pdf:
    changeUserSatus : async (req, res) =>{
      console.log(req.body)
      let usertype;
      if(req.body.type === 0){
        usertype =2  
      }
      else{
        usertype =0
      }
      // req.body.type = (req.body.type == 0) ? 2 : 0
      
      console.log(req.body)

      let ret = await User.findByIdAndUpdate(req.body.userId, {type:usertype});
      res.json({status:1, message:'Updated Succesfully.',payload:usertype})
      if(ret) {
            res.json({status:1, message:'Updated Succesfully.',payload:ret});
      } else {
        res.json({status:0, message: 'Oops Something went wrong.'})
      }
         

     
     
 },
 changeUserSatusToProvider : async (req, res) =>{
  console.log(req.body)
  let usertype;
  // if(req.body.type === 0){
  //   usertype =2  
  // }
  // else{
  //   usertype =0
  // }
  // req.body.type = (req.body.type == 0) ? 2 : 0
  
  console.log(req.body)

  let ret = await User.findByIdAndUpdate(req.body.userId, {type:1});
  res.json({status:1, message:'Updated Succesfully.',payload:1})
  if(ret) {
        res.json({status:1, message:'Updated Succesfully.',payload:1});
  } else {
    res.json({status:0, message: 'Oops Something went wrong.'})
  }
     

 
 
},
 get_patientConstent : async (req, res) =>{
  let Constent = await patientConstent.aggregate([
    { $lookup:
       {
         from: 'users',
         localField: 'user_id',
         foreignField: '_id',
         as: 'userdetails'
       }
     }
    ]).match({patient_name:{$ne:''}})
    .project({
      fieldExists:{$cond:[{$eq:["$patient_image", null]}, false, true]},
      profilePic:{
      $concat: [process.env.UPLOADURL,'',"$patient_image"]
      },
          // userName:"$userdetails.user_id",
          userfirstName:"$userdetails.firstName",
          userlastName:"$userdetails.lastName",
          ccmConstent:"$ccmConstent",
          bhiService:"$bhiService",
          patientName:"$patientName",
          facilityName:"$facilityName",
          roomNo:"$roomNo",
          patientSignature:"$patientSignature",	
          verbalConstent:"$verbalConstent",
          careGiven:"$careGiven",
          careNavigator:"$careNavigator",
          // yourfaxNumber:"$yourfaxNumber",
          createdAt:"$createdAt"
      }).sort({createdAt:-1});
    if(Constent) {
        res.json({status:1,message:'Result Found',payload:Constent});
    } else {
        res.json({status:0,message:'Result Not Found',payload:Constent});
    }
 
 
},
// create_pdf: async (req, res) =>{
//   pdf.create(pdfTemplate(req.body),{}).toFile('result.pdf',(err) => {
//     if(err){
//       res.json({status:0,message:'Result Not Found',payload:Promise.reject()});

//     }
//     res.json({status:1,message:'Result Found',payload:Promise.resolve()});

//   });
// },
// fetch_pdf:async (req,res) =>{
//   res.sendFile(`${__dirname}/result.pdf`)
// }
  deleteTiming: async (req, res) =>{
    if(req.params.id) {
        let obj = {
            _id:req.params.id
        }
        storeTimings.remove(obj, function(err,result){
            if(err){
                console.log(err)
            } else {
                res.json({status:1, message:'Deleted Successfully', payload:result});
            }
        })
      } else {
        res.json({status:0, message:'Missing Parameters!!!'})
      }
  },
  fetch_answer_submition: async (req, res) =>{
    
        let answers = answersSubmition.find({}).sort({createdAt:-1});//.populate('category_id')
        console.log("first")
        if(answers) {
          console.log("second")
          console.log(answers)
          // let ContactData =[]
          // answers.forEach(ro => {
          //   console.log(ro)
          //     ContactData.push({
          //             doc_id:ro.doc_id._id,
          //             // firstName:ro.firstName,
          //             // lastName:ro.doc_id.lastName,
          //             patientName: ro.patientName,
          //             marks: ro.marks,
          //             remark: ro.remark,
                      
          //           })
          // })
          // // ContactData = answers
          // console.log(answers)
          
          res.json({status:1,message:'Result Found',payload:answers});
      } else {
          res.json({status:0,message:'Result Not Found',payload:answers});
      }
  },  
  fetch_pdf: async (req,res)=>{
    console.log(req.body)
    try{
      console.log("first")
      // const browser = await puppeteer.launch();
      const browser = await puppeteer.launch({headless: false,args: ['--no-sandbox']});
      const page = await browser.newPage();
      console.log("second")

      // await page.setContent('<h1>Hello</h1>')
      await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Balanced Wellbeing LLC CCM/BHI Consent </title>
          <style>
             @media (min-width: 1501px) and (max-width: 400px){
              #wrapper{
                  padding:20px;
                  max-width:800px;
                  margin:0 auto;
              }
             body,  p{
                  line-height: 25px;
                  font-size:16px;
                  font-family: Arial, Helvetica, sans-serif;
              }
              p{
                  margin-top:0;
              }
              .my-2{
                  margin-top:2rem;
                  margin-bottom:2rem;
              }
              input{
                  border:0;
                  box-shadow:none;
                  appearance: none;
                  -webkit-appearance: none;
                  border-bottom:2px solid #000;
                  background:#fff;
              }
              .box-block{
                  border:2px solid #2e528f;
                  padding:15px 10px;
                  margin-bottom:30px;
              }
              .box-block input{
                  border:0;
                  box-shadow:none;
                  appearance: none;
                  -webkit-appearance: none;
                  border-bottom:2px solid #000;
                  background:#fff;
              }
              .d-flex{
                  display:flex;
                  align-items:center;
              }
              .patient-detail label{
                  white-space: nowrap;
              }
              .patient-detail input{
                  margin-left:10px;
                  margin-right: 10px;
                  width:100%;
              }
             }
             #wrapper{
                  padding:20px;
                  max-width:800px;
                  margin:0 auto;
              }
             body,  p{
                  line-height: 25px;
                  font-size:16px;
                  font-family: Arial, Helvetica, sans-serif;
              }
              p{
                  margin-top:0;
              }
              .my-2{
                  margin-top:2rem;
                  margin-bottom:2rem;
              }
              input{
                  border:0;
                  box-shadow:none;
                  appearance: none;
                  -webkit-appearance: none;
                  border-bottom:2px solid #000;
                  background:#fff;
              }
              .box-block{
                  border:2px solid #2e528f;
                  padding:15px 10px;
                  margin-bottom:30px;
              }
              .box-block input{
                  border:0;
                  box-shadow:none;
                  appearance: none;
                  -webkit-appearance: none;
                  border-bottom:2px solid #000;
                  background:#fff;
              }
              .d-flex{
                  display:flex;
                  align-items:center;
              }
              .patient-detail label{
                  white-space: nowrap;
              }
              .patient-detail input{
                  margin-left:10px;
                  margin-right: 10px;
                  width:100%;
              }
      
          </style>
      </head>
      <body>
          <div id="wrapper">
              <div class="page-title"  style="text-align: center;">
                  <img src="http://34.215.131.33/hippaApi/logo.2af5dd73.png" height="50" alt=""/>
                  <h2 style="text-align: center; margin-top:10px;">Balanced Wellbeing LLC CCM/BHI Consent </h2>
              </div>
              <div class="box-block">
                  <p><strong>Chronic Care Management (CCM)</strong> is defined as the non-face-to-face services provided to Medicare beneficiaries who have multiple (two or more), significant chronic conditions. In addition to office visits and other face-to- face encounters (billed separately), these services include communication with the patient and other treating health professionals for care coordination (both electronically and by phone), medication management, and being accessible 24 hours a day to patients and any care providers (physicians or other clinical staff). The creation and revision of electronic care plans is also a key component of <strong>CCM</strong> and can be provided to the Medicare Beneficiary. 
                   </p>
                   <p>
                    <strong>`+((req.body.ccmConstent ===1)?`I consent to CCM services`:`I do NOT consent to CCM Services.`)+`</strong> and understand that my care plan will either be given to me or mailed to my home address on file. 
                   </p>
              </div>
              <div class="box-block">
                  <p><strong>Behavioral Health Integration (BHI)</strong> services include an initial assessment by the care team, consulting with relevant specialists which would include conferring with a psychiatric consultant as well as the administration of applicable validated rating scales, systematic assessments and monitoring. <strong>BHI</strong> also includes care planning between you and the care team. A BHI Care Plan will be created and provided to you accordingly. </p>
                   <p>
                     <strong>`+((req.body.ccmConstent ===1)?` I consent to BHI services`:`I do NOT consent to BHI services`)+`</strong> and understand that my care plan will either be given to me or mailed to my home address on file.</p>
              </div>
              <div class="patient-detail">
                  <div class="patient-name d-flex" style="width:60%">
                      <label><strong>Patient Name:</strong></label>
                      <input type="text" value="`+req.body.userfirstName+` `+req.body.userlastName +`"/> 
                  </div>
                  <div class="facility-room d-flex">
                      <div class="facility d-flex" style="width:60%">
                          <label><strong>Facility Name:</strong></label>
                          <input type="text" value="`+req.body.bed+`"/> 
                      </div>
                      <div class="room d-flex" style="width:40%">
                          <label><strong>Room#:</strong></label>
                          <input type="text" value="`+req.body.roomNo+`"/> 
                      </div>
                  </div>
                  <p class="my-2">I agree to have Balanced Wellbeing LLC as my psychiatric and psychotherapy provider for evaluations and follow ups on me as needed. I understand that a Part B copayment may apply and that I may stop Balanced Wellbeing LLC and <strong>CCM or BHI</strong> Services by either providing verbal or written notice at any time. I understand that I would remain on the program until the end of the calendar month in which notice was provided by me. </p>
                  <div class="patient-rep-sign d-flex">
                      <label><strong>Patient or Representative’s Signature: </strong></label>
                        
                      <img src="`+req.body.patientSignature +`" alt="Smiley face" height="42" width="42">
                  </div>
                  <div class="patient-rep-sign d-flex">
                      <label><strong>Verbal Consent Given By: </strong></label>
                      <input type="text" value="`+req.body.verbalConstent +`"/> 
                  </div>
                  <div class="nav-date d-flex">
                      <div class="care d-flex" style="width:70%">
                          <label><strong>Care Navigator: </strong></label>
                          <input type="text" value="`+req.body.careNavigator +`"/> 
                      </div>
                      <div class="date d-flex" style="width:30%">
                          <label><strong>Date: </strong></label>
                          <input type="text" value="`+req.body.careNavigator +`"/> 
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>`)

      await page.emulateMediaFeatures('screen')
      await page.pdf({
        path:'mypdf.pdf',
        format:'A4',
        printBackground:true
      })
      console.log("done")
      res.json({status:1, message:'Successfully', payload:result});
      

      await browser.close()
      process.exit()

    }catch(e){
      console.log(e)
    }

  },
  
  add_storeTiming: async (req, res)=>{
    console.log(req.body)
    if(req.body.doc_id) {
      let adding_storeTimings = {
              doc_id:req.body.doc_id,
              sundayTimingStartTiming:req.body.sundayTimingStartTiming,
              sundayTimingEndTiming:req.body.sundayTimingEndTiming,
              mondayTimingStartTiming:req.body.mondayTimingStartTiming,
              mondayTimingEndTiming:req.body.mondayTimingEndTiming,
              tuesdayTimingStartTiming:req.body.tuesdayTimingStartTiming,
              tuesdayTimingEndTiming:req.body.tuesdayTimingEndTiming,
              wednesdayTimingStartTiming:req.body.wednesdayTimingStartTiming,
              wednesdayTimingEndTiming:req.body.wednesdayTimingEndTiming,
              thursdayTimingStartTiming:req.body.thursdayTimingStartTiming,
              thursdayTimingEndTiming:req.body.thursdayTimingEndTiming,
              fridayTimingStartTiming:req.body.fridayTimingStartTiming,
              fridayTimingEndTiming:req.body.fridayTimingEndTiming,
              saturdayTimingStartTiming:req.body.saturdayTimingStartTiming,
              saturdaydayTimingEndTiming:req.body.saturdaydayTimingEndTiming,

              //   careGiven:req.body.careGiven,
              //   careNavigator:req.body.careNavigator,

      }



      
      // let checkdoc_id = await openingTime.find({doc_id:req.body.doc_id});
      // if (checkdoc_id.length>0) return res.status(200).send({ status: 0, message:"Provider Id already exist." });
      //      bcrypt.hash(req.body.password.toString(), 10, function(err, hash) {
      // if (err) throw err;

      // else{
                var add = new storeTimings(adding_storeTimings);
        
            add.save(function(err,result){  
              if(err){
               if (err.name === 'MongoError' && err.code === 11000){
                 return res.json({message:"This Email already exist. Please try with different Email.",status:0});
                }
              } else {
               if(result._id){
                try{
                  // var token = jwt.sign({ id: result._id }, process.env.JWT_SECRET);
                  // result.user_token = token;
                     
                 
                  // result.profilePic = process.env.UPLOADURL+result.profilePic;  
                  res.json({status:1,message:'Provider Timing Added Successfully.',payload:result})
                  
                } catch(err) {
                  res.status(203).send({ status: 0, message:"Oops Something went wrong.", description:err });
                }
                
               } else {
                 res.json({ status: 0, message:"Error" });
               }
              }
            });
      
          }
          
        // });
      // }
       else {
        res.json({status:0,message:'Missing Parameters.'})
      }
   },
   update_timing: async (req, res) =>{

    // let video_url = req.body.video_url;
    console.log(req.body)
    if(req.params.id) {
        
      // var thumbnail = youtubeThumbnail(video_url);
      
      let details = {
        doc_id:req.body.doc_id,
        sundayTimingStartTiming:req.body.sundayTimingStartTiming,
        sundayTimingEndTiming:req.body.sundayTimingEndTiming,
        mondayTimingStartTiming:req.body.mondayTimingStartTiming,
        mondayTimingEndTiming:req.body.mondayTimingEndTiming,
        tuesdayTimingStartTiming:req.body.tuesdayTimingStartTiming,
        tuesdayTimingEndTiming:req.body.tuesdayTimingEndTiming,
        wednesdayTimingStartTiming:req.body.wednesdayTimingStartTiming,
        wednesdayTimingEndTiming:req.body.wednesdayTimingEndTiming,
        thursdayTimingStartTiming:req.body.thursdayTimingStartTiming,
        thursdayTimingEndTiming:req.body.thursdayTimingEndTiming,
        fridayTimingStartTiming:req.body.fridayTimingStartTiming,
        fridayTimingEndTiming:req.body.fridayTimingEndTiming,
        saturdayTimingStartTiming:req.body.saturdayTimingStartTiming,
        saturdaydayTimingEndTiming:req.body.saturdaydayTimingEndTiming,
      }

      console.log(details)

      let vidId = {
          _id:req.params.id
      }



    let ret = await storeTimings.update(vidId, {$set:details});
    if(ret) {
          res.json({status:1, message:'Video Updated Succesfully.',payload:ret});
    } else {
      res.json({status:0, message: 'Oops Something went wrong.'})
    }
        
     
    } else {
      res.json({status:0, message:'Missing Parameters!!!'});
    }
   },

   
   getPatientDocument:async (req, res) =>{
    let result = await patientDocument.find({}).sort({createdAt:-1});
    if(result) {
        res.json({status:1,message:'Get Document.',payload:result});
    } else {
        res.json({status:0,message:'Not found.',payload:result});
    }
   }
}