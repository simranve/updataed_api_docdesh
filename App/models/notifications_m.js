const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
   title:{
       type:String,
       trim:true,
       required:true,
   },
   content:{
       type:String,
       required:true
   },
   notify_image:{
       type:String,
       default:''
   },
   sender_id:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
   receiver_id:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
  notification_type:{
        type:Number,
        default:''    // notification_type:1, Normal ,notification_type:2, inviteCalling  notification_type:3,rejectCalling notification_type:4,Chat notification
    },
  notificationsUserids: [{
    type:String,
    default:''
  }],
  status:{
      type:Number,
      enum:[0,1],
      default:0
  },
},
{
    timestamps:true
}
)

const Notifications = mongoose.model('Notifications', notificationsSchema);

module.exports = Notifications