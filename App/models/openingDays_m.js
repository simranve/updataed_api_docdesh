const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const openingDaysSchema = new Schema({
          // doc_id:{
          //           type:Schema.Types.ObjectId,
          //           ref:'User'
          // },
          days:{
                    type:String,
                    default:''
          }},
          {
            timestamps: true
          });


const openingDays = mongoose.model('openingDays', openingDaysSchema);

module.exports = openingDays