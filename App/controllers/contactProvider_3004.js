const User = require('../models/userModel');
_ = require('lodash'),
fs = require('fs'),
helper =  require('../helper/helper');



module.exports ={

    contactProvider : async (req, res) => {
        let contacts='';
        let providerstatus = await helper.providerStatus(req.body.provider_status);
        
         if(req.body.provider_status) {
            contacts = await User.find({type:0,providerStatus:req.body.provider_status});
           
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
                    res.json({status:1,message:"All "+providerstatus+" Contacts Provider",payload:ContactData});
                } else {
                    res.json({status:0,message:"Contacts Not found",payload:ContactData});
                }
         } else {
             res.json({status:0,message:"Missing parameters!!!"})
         }
          
    },

    
}