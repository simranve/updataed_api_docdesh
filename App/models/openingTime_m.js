const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const openingTimeSchema = new Schema({
          doc_id:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
          },
          day_id:{
                    type:Schema.Types.ObjectId,
                    ref:'openingDays'
          },
          openingTime:{
                    type: String,
                    default: ''
          },
          closingTime:{
                    type: String,
                    default: ''
          }
         },
          {
            timestamps: true
          });


const openingTime = mongoose.model('openingTime', openingTimeSchema);

module.exports = openingTime