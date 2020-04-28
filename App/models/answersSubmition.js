const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answersSubmitionSchema = new Schema({
          doc_id:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
          },
          category_id:{
                    type:Schema.Types.ObjectId,
                    ref:'questionsCategories'
          },
          patientName:{
                    type: String,
                    default: ''
          },
          marks:{
                    type: Number,
                    default: ''
          },
          dob:{
                    type: Date,
                    default: ''
          },
         },
          {
            timestamps: true
          });


const answersSubmition = mongoose.model('answersSubmition', answersSubmitionSchema);

module.exports = answersSubmition