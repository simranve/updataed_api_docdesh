const User = require('../models/userModel');
_ = require('lodash'),
fs = require('fs'),
helper =  require('../helper/helper');
Notifications = require('../models/notifications_m');

var apn = require('apn');

const {sendPushNotification,sendPushNotificationIOS,sendPushNotificationAndroid,sendMessageIOS,apnsNotification} = require('./../services/sendmail');
const {ObjectID} = require('mongodb');
const PushNotifications = require('node-pushnotifications');




// notification_type:1, Normal
//notification_type:2, inviteCalling  
//notification_type:3,rejectCalling
//notification_type:4,Chat notification





module.exports ={

    contactProvider : async (req, res) => {
        let contacts='';
        let providerstatus = await helper.providerStatus(req.body.provider_status);

         if(req.body.provider_status) {
         	
            contacts = await User.find({type:1,providerStatus:{$in:req.body.provider_status}}).sort( { createdAt: -1 } )
           
            let ContactData = [];
                contacts.forEach(ro=>{
                    ContactData.push({
                        _id:ro._id,
                        phoneNumber:ro.phoneNumber,
                        specialist:ro.specialist,
                        firstName:ro.firstName,
                        lastName:ro.lastName,
                        providerStatus:ro.providerStatus,
                        userStatus:ro.userStatus,
                        profilePic:process.env.UPLOADURL+ro.profilePic,
                        deviceToken:ro.deviceToken,
                        type:ro.type,
                        email:ro.email
                    });
                })
                if(contacts.length>0) {
                    res.json({status:1,message:"All "+providerstatus+" Contact Provider",payload:ContactData});
                } else {
                    res.json({status:0,message:"Contact Not found",payload:ContactData});
                }
         } else {
             res.json({status:0,message:"Missing parameters!!!"})
         }
          
    },
    contactStaff : async (req, res) => {
        let contacts='';
        let providerstatus = await helper.providerStatus(req.body.provider_status);
        
         if(req.body.provider_status) {
            contacts = await User.find({type:2,providerStatus:req.body.provider_status});
           
            let ContactData = [];
                contacts.forEach(ro=>{
                    ContactData.push({
                        _id:ro._id,
                        phoneNumber:ro.phoneNumber,
                        specialist:ro.specialist,
                        firstName:ro.firstName,
                        lastName:ro.lastName,
                        providerStatus:ro.providerStatus,
                        userStatus:ro.userStatus,
                        profilePic:process.env.UPLOADURL+ro.profilePic
                    });
                })
                if(contacts.length>0) {
                    res.json({status:1,message:"All "+providerstatus+" Contacts Staff office",payload:ContactData});
                } else {
                    res.json({status:0,message:"Contacts Not found",payload:ContactData});
                }
         } else {
             res.json({status:0,message:"Missing parameters!!!"})
         }
          
    },

    
    inviteCalling: async (req, res) =>{

            let datas = {
                firstName:req.user.firstName,
                lastName:req.user.lastName,
                deviceToken:req.user.deviceToken,
                profilePic: process.env.UPLOADURL+req.user.profilePic,
                user_id:req.user._id,
                notification_type:2,
                message:"hello message",
                title:"title",
                callee_id:req.body.callee_id
            }

             const callee_id=req.body.callee_id;
             let userInfo = await User.findOne({_id:callee_id});

             
        //    console.log(userInfo);
           const alert_message='';
           var title='title';
           var fcm_token=[userInfo.deviceToken];

           
           //var fcm_token=userInfo.deviceToken;
            if(userInfo.deviceType=='android') {
                  sendPushNotificationAndroid(fcm_token, title, datas).then(function(result){
                   res.json({success:true,userInfo:userInfo})
               })
               .catch(function(err){
                   res.json({success:false})
               })
             } else if(userInfo.deviceType=='ios') {
              //fcm_token = '48a72aef95f31b134c5cc852ae03cad3ac1b107300c31099310e9801e8d873c6';
                  module.exports.apnsNotificationVoip(userInfo.iosVoipToken).then(function(result){
                   res.json({success:true,userInfo:userInfo,noticationInfo:result})
               })
               .catch(function(err){
                   res.json({success:false})
               })
             }
           

           

       
       },


    sendMessage: async (req, res) =>{
        
        if(req.body.user_id && req.body.title) {

              let datas = {
                user_id:req.body.user_id,
                message:req.body.message,
                title:req.body.title,
                notification_type:4
            }
           
           
           let badgeCnt = await module.exports.allBadge(req.user._id);

             const callee_id=req.body.user_id;
             let userInfo = await User.findOne({_id:callee_id});

         
           const alert_message='';
           var title=req.body.title;
           var fcm_token=[userInfo.deviceToken];

            let dataTosend = {
              title:req.body.title,
              content:req.body.message,
              sender_id:req.user._id,
              receiver_id:req.body.user_id,
              notification_type:4
            }

            
                
              let notification = new Notifications(dataTosend);
              
              let saved = await notification.save();    
              
            // console.log(userInfo+"simran");
            if(userInfo.deviceType=='android') {
                  sendPushNotificationAndroid(fcm_token, title, datas).then(function(result){
                   res.json({success:true,userInfo:userInfo})
               })
               .catch(function(err){
                   res.json({success:false})
               })
             } else if(userInfo.deviceType=='ios') {
                  sendMessageIOS(fcm_token, title, datas, badgeCnt).then(function(result){
                   res.json({success:true,userInfo:userInfo})
               })
               .catch(function(err){
                   res.json({success:false})
               })
             }


            } else {
            res.json({message:'Missing parameters !! title and token'})
            }


        },

       
      rejectCalling :  async (req, res) =>{

       let datas = {
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            deviceToken:req.user.deviceToken,
            profilePic: process.env.UPLOADURL+req.user.profilePic,
            user_id:req.user._id,
            notification_type:3,
            callee_id:req.body.callee_id,
            message:"hello message",
        }

         const callee_id=req.body.callee_id;
         let userInfo = await User.findOne({_id:callee_id});
       
       const alert_message=req.body.alert_message;
       var title=req.body.title;
    //    console.log(userInfo)
      //var fcm_token=userInfo.deviceToken;
       var fcm_token=[userInfo.deviceToken];


         if(userInfo.deviceType=='android') {
             sendPushNotificationAndroid(fcm_token, title, datas).then(function(result){
                   res.json({success:true})
               })
               .catch(function(err){
                   res.json({success:false})
               })
         } else if(userInfo.deviceType=='ios') {
               sendPushNotificationIOS(fcm_token, title, datas).then(function(result){
                   res.json({success:true})
               })
               .catch(function(err){
                   res.json({success:false})
               })
         }
       

     
      },

      allBadge: async(user_id) =>{
      
           //let user_id = user_id;
         let cntMessage =  await Notifications.aggregate( [ 
          
            { $match:  { "status":0,"notification_type":4,"receiver_id":user_id  } } ,
            { $group: { _id: "$sender_id", count: { $sum: 1 } } }
           
            ] )


          let condition1 = await Notifications.find({"notificationsUserids": {$in: [user_id]}});
           
           let cnt =  cntMessage.length + condition1.length;
             
             return cnt;
         
      },


      messageBadge: async (req, res) =>{

         let user_id = req.user._id;
         let cntMessage =  await Notifications.aggregate( [ 
          
            { $match:  { "status":0,"notification_type":4,"receiver_id":user_id  } } ,
            { $group: { _id: "$sender_id", count: { $sum: 1 } } }
           
            ] )


          let condition1 = await Notifications.find({"notificationsUserids": {$in: [user_id]}});
           
           let cnt =  cntMessage.length + condition1.length;
          

         res.json({status:1, message:"Massage and Notifications Badge Count.", Messagecnt : cntMessage.length, 
          Notification:condition1.length,allBadge:cnt})


      },

      clearBadge: async (req, res) =>{

         let user_id = req.user._id;
         let type = req.body.notification_type;
         let cntNotification;
         let massage;

          let status = {
                status:1
            }
        
          var receiver_id ={
            receiver_id:user_id,
            notification_type:req.body.notification_type
          }

                if(type==4) {
                  cntNotification = await Notifications.updateMany(receiver_id, {$set:status});
                  massage = 'cleared Massage Badge Count.'
                } else if(type==1) {

                   let condition1 = {"notificationsUserids": {$in: [user_id]}};
                             massage = 'cleared Notifications Badge Count.'
                  cntNotification = await Notifications.updateMany(condition1, {
                                $pull: {notificationsUserids  :user_id }
                  });

                }
           
          
         

         res.json({status:1, message:massage})


      },


      apnsNotificationVoip: async(deviceToken) =>{
        
        
        const settings = {
          gcm: {
              id: null,
              phonegap: false, // phonegap compatibility mode, see below (defaults to false)
            
          },
          apn: {
              token: {
                  key: 'test.p8', // optionally: fs.readFileSync('./certs/key.p8')
                  keyId: 'ATJ42A59WP',
                  teamId: 'C6879MJLU7',
              },
              production: false // true for APN production environment, false for APN sandbox environment,
             
          },
          adm: {
              client_id: null,
              client_secret: null,
              
          },
          wns: {
              client_id: null,
              client_secret: null,
              notificationMethod: 'sendTileSquareBlock',
              
          },
          web: {
              vapidDetails: {
                  subject: '< \'mailto\' Address or URL >',
                  publicKey: '< URL Safe Base64 Encoded Public Key >',
                  privateKey: '< URL Safe Base64 Encoded Private Key >',
              },
              gcmAPIKey: 'gcmkey',
              TTL: 2419200,
              contentEncoding: 'aes128gcm',
              headers: {}
          },
          isAlwaysUseFCM: false, // true all messages will be sent through node-gcm (which actually uses FCM)
        };
        const push = new PushNotifications(settings);
        
        
        //const registrationIds = 'INSERT_YOUR_DEVICE_ID';
         
        // Multiple destinations
        const registrationIds = [];
        registrationIds.push(deviceToken);
        //registrationIds.push('5889d4617c4959225ee700d6935af019d1f5923ba5fe04c7422f2bb7cc1d2d19');
        
             
        const data = {
          title: 'New push notification', // REQUIRED for Android
          topic: 'com.app.doctordesh.voip', // REQUIRED for iOS (apn and gcm)
          /* The topic of the notification. When using token-based authentication, specify the bundle ID of the app.
           * When using certificate-based authentication, the topic is usually your app's bundle ID.
           * More details can be found under https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns
           */
          body: 'Powered by AppFeel',
          custom: {
              sender: 'AppFeel',
          },
          priority: 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
          collapseKey: '', // gcm for android, used as collapseId in apn
          contentAvailable: true, // gcm, apn. node-apn will translate true to 1 as required by apn.
          delayWhileIdle: true, // gcm for android
          restrictedPackageName: '', // gcm for android
          dryRun: false, // gcm for android
          icon: '', // gcm for android
          tag: '', // gcm for android
          color: '', // gcm for android
          clickAction: '', // gcm for android. In ios, category will be used if not supplied
          locKey: '', // gcm, apn
          locArgs: '', // gcm, apn
          titleLocKey: '', // gcm, apn
          titleLocArgs: '', // gcm, apn
          retries: 1, // gcm, apn
          encoding: '', // apn
          badge: 2, // gcm for ios, apn
          sound: 'ping.aiff', // gcm, apn
          alert: { // apn, will take precedence over title and body
              title: 'title',
              body: 'body'
              // details: https://github.com/node-apn/node-apn/blob/master/doc/notification.markdown#convenience-setters
          },
          notification_type:2,
          /*
           * A string is also accepted as a payload for alert
           * Your notification won't appear on ios if alert is empty object
           * If alert is an empty string the regular 'title' and 'body' will show in Notification
           */
          // alert: '',
          launchImage: '', // apn and gcm for ios
          action: '', // apn and gcm for ios
          category: '', // apn and gcm for ios
          // mdm: '', // apn and gcm for ios. Use this to send Mobile Device Management commands.
          // https://developer.apple.com/library/content/documentation/Miscellaneous/Reference/MobileDeviceManagementProtocolRef/3-MDM_Protocol/MDM_Protocol.html
          urlArgs: '', // apn and gcm for ios
          truncateAtWordEnd: true, // apn and gcm for ios
          mutableContent: 0, // apn
          threadId: '', // apn
          // if both expiry and timeToLive are given, expiry will take precedence
          expiry: Math.floor(Date.now() / 1000) + 28 * 86400, // seconds
          timeToLive: 28 * 86400,
          headers: [], // wns
          launch: '', // wns
          duration: '', // wns
          consolidationKey: 'my notification', // ADM
      };
       
      // You can use it in node callback style
      var ret = push.send(registrationIds, data, (err, result) => {
          if (err) {
              console.log(err);
              //res.json({message:err})
          } else {
            //   console.log(result);
              //res.json({message:result})
          }

          
      });

      return ret;
       
      


    
  }

       
    
    }

    