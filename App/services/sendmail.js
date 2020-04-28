const nodemailer = require('nodemailer');

var FCM = require('fcm-node');
var serverKey = 'AAAALgE4Pu4:APA91bG7aGM3xFLqIetlsc-BOwx_vF91X8PA5rv4wgu0IFfVecr1CnxQaevFyX6tiPQ0usQmqJKQSpcnBOMuTUoujl-uV5a9gNetTlHa9rtNzFFLmknh6lC-ZyNL2xC9BJQ-NNABluED'; //put your server key here
var fcm = new FCM(serverKey);

var apn = require('apn');

module.exports = {
    sendmail : (subject, to, from= '"Hippa " <info@hippa.com>', html, text, files) => {
            return new Promise(function(resolve, reject) {
            nodemailer.
            createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    service: 'gmail',
                    // port: 587,
                    port: 25,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_USER, // generated ethereal user
                        pass: process.env.EMAIL_PASSWORD // generated ethereal password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                    
                });
                console.log(process.env.EMAIL_USER);
                let mailOptions = {from,to,subject,html};
                // send mail with defined transport object
               transporter.sendMail(mailOptions, (error, info) => {
                    if (error)  {
                        reject(error);
                    }
                    
                    resolve(info);
                });
              });
            });
    },

     


sendPushNotification: async(deviceTokens, title, notificationData) => {       
        try{
              if(notificationData.message) {
                var message = notificationData.message;
              } else {
                var message = notificationData.message;
              }
        
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids: deviceTokens,
                "content-available" : true,
                priority : "high",
                "badge" : 1,
                sound:"",
                
                notification: {
                    title: title, 
                    body: message 
                },

                data: notificationData 
                // data: {  //you can send only notification or only data(or include both)
                //     notificationData
                // }
            };
            
           await fcm.send(message, function(err, response){
                if (err) {
                    console.log(err);
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
        catch(err){
            console.log("Something went wrong ", err.message);
        }
    },

    
    sendPushNotificationIOS: async(deviceTokens, title, notificationData) => {       
        try{
              if(notificationData.message) {
                var message = notificationData.message;
              } else {
                var message = notificationData.message;
              }
        
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids: deviceTokens,
                "content_available" : true,
                priority : "high",
                
               
                
                notification: {
                    "badge" : 1,
                    // title : title,
                    // body : message,
                    type:"video"
                },

                data: notificationData 
                // data: {  //you can send only notification or only data(or include both)
                //     notificationData
                // }
            };
            
           await fcm.send(message, function(err, response){
                if (err) {
                    console.log(err);
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
        catch(err){
            console.log("Something went wrong ", err.message);
        }
    },

    sendMessageIOS: async(deviceTokens, title, notificationData, badge) => {       
        try{  
              if(notificationData.message) {
                var message = notificationData.message;
              } else {
                var message = notificationData.message;
              }
              var badge = 1;
               var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids: deviceTokens,
                // "content_available" : true,
                priority : "high",
                //sound:"default",
                
                notification: {
                    "badge" : badge,
                    title : title,
                    body : message,
                    sound:"default",
                },

                 
                data: notificationData 

                // data: {  //you can send only notification or only data(or include both)
                //     notificationData
                // }
            };

            

             
            console.log(badge)
            
           await fcm.send(message, function(err, response){
                if (err) {
                    console.log(err);
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
        catch(err){
            console.log("Something went wrong ", err.message);
        }
    },


    sendPushNotificationAndroid: async(deviceTokens, title, notificationData) => {       
        try{
          
              if(notificationData.message) {
                var message = notificationData.message;
              } else {
                var message = notificationData.message;
              }
        
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids: deviceTokens,
                "content-available" : true,
                priority : "high",
                "badge" : 1,
                sound:"",
                
                // notification: {
                //     title: title, 
                //     body: message 
                // },

                data: notificationData 
                // data: {  //you can send only notification or only data(or include both)
                //     notificationData
                // }
            };
            
           await fcm.send(message, function(err, response){
                if (err) {
                    console.log(err);
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
        catch(err){
            console.log("Something went wrong ", err.message);
        }
    },


    apnsNotification: async(deviceTokens, title, notificationData) =>{
        //let deviceToken = deviceTokens;
    
          try {
               //deviceToken = deviceToken;
            let deviceToken = "5889d4617c4959225ee700d6935af019d1f5923ba5fe04c7422f2bb7cc1d2d19";
              var options = {
                cert: "voIPCertificates.pem",
                key:  "voIPCertificates.pem",
                production: false
              };
              let apnProvider = new apn.Provider(options);
              var note = new apn.Notification();
        
              note.badge = 1;
              note.sound = "ping.aiff";
              note.title = "title";
              note.body = "invite calling.";

              note.notification= {
                title: "title", 
                body:  note.body 
            }

               note.data = notificationData;
              
               note.payload = notificationData;
                          
              note.topic = "com.app.doctordesh";
              apnProvider.send(note, deviceToken).then( (result, err) => {
               
                
                if(err) {
                console.log(err);
                  JSON.stringify(err); 
                } else {
                console.log(result)
                JSON.stringify(result);  
                }
                
                
                
                // see documentation for an explanation of result
              });
        
              return true;
            } catch (error) {
              return false;
            }
    
  },

  




  

}
