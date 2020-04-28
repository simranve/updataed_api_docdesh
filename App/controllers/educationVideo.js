const educationVideo = require('./../models/educationVideo_m');
_ = require('lodash');

var youtubeThumbnail = require('youtube-thumbnail');


module.exports={
     videoSave : async (req, res) =>{
      let video_url = req.body.video_url;
      if(video_url) {
          
        var thumbnail = youtubeThumbnail(video_url);
        
        let video_details = {
         user_id:req.user._id,
         video_title : req.body.video_title,
         video_description: req.body.video_description,
         video_id : req.body.video_id,
         video_url : video_url,
         video_thumbnail:thumbnail.high.url
        }
        console.log(video_details);
       var videos = new educationVideo(video_details)
       videos.save(function(err, result){
           if(err){
             res.json({status:0, message: 'Oops Something went wrong.', err})
           } else {
             res.json({status:1, message:'video Added Succesfully'});
           }
       })
      } else {
        res.json({status:0, message:'Missing Parameters!!!'});
      }
        
    
    },

    getVideos : async (req, res) =>{
     
         let getVideos = await educationVideo.find({video_type:1});
          if(getVideos) {
              res.json({status:1, message:'All Education Videos', payload:getVideos});
          } else {
              res.json({status:0, message:'Results not found.'})
          }
    } ,
    getVideos_educational : async (req, res) =>{
     
      let getVideos = await educationVideo.find({video_type:2});
       if(getVideos) {
           res.json({status:1, message:'All Education Videos', payload:getVideos});
       } else {
           res.json({status:0, message:'Results not found.'})
       }
 } ,





    videoDetail : async (req, res) => {
        let video_id = req.body.video_id;
       if(video_id) {
        let detail = await educationVideo.find({_id:video_id});
         let details = _.assign({}, detail[0]._doc)

        if(detail) {
           res.json({status:1, message:'Record Found.', payload:details})
        } else {
            res.json({status:0, message:'Record Not Found.'})
        }      
       } else {
           res.json({status:0, message:'Missing Parameters!!!'})
       }
        
    }

}