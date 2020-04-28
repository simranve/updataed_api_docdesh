const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User'
  },
  video_type:{
    type:Number,
    default:1,// 1-educational 2-general
},
  video_title:{
      type:String,
      default:'',
  },
  video_description:{
      type:String,
      default:'',
  },
  video_id:{
      type:String,
      default:''
  },
  video_url:{
      type:String,
      required:true,
  },
  video_thumbnail:{
    type:String,
    default:''
  },
  status:{
      type:Number,
      default:1
  }
},
{
 timestamp:true
}

);

const educationVideo = mongoose.model('educationVideo',videoSchema);
module.exports = educationVideo;