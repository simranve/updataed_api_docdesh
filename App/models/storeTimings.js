const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeTimingsSchema = new Schema({
          doc_id:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
          },
          sundayTimingStartTiming:{
                    type:String,
                    default: ''
          },
          sundayTimingEndTiming:{
                    type: String,
                    default: ''
          },
          mondayTimingStartTiming:{
                    type: String,
                    default: ''
          },
          mondayTimingEndTiming:{
                    type: String,
                    default: ''
          },
          tuesdayTimingStartTiming:{
                    type: String,
                    default: ''
          },
          tuesdayTimingEndTiming:{
                    type: String,
                    default: ''
          },
          wednesdayTimingStartTiming:{
                    type: String,
                    default: ''
          },
          wednesdayTimingEndTiming:{
                    type: String,
                    default: ''
          },
          thursdayTimingStartTiming:{
                    type: String,
                    default: ''
          },
          thursdayTimingEndTiming:{
                    type: String,
                    default: ''
          },
          fridayTimingStartTiming:{
                    type: String,
                    default: ''
          },
          fridayTimingEndTiming:{
                    type: String,
                    default: ''
          },
          saturdayTimingStartTiming:{
                    type: String,
                    default: ''
          },
          saturdaydayTimingEndTiming:{
                    type: String,
                    default: ''
          },
         },
          {
            timestamps: true
          });


const storeTimings = mongoose.model('storeTimings', storeTimingsSchema);

module.exports = storeTimings