const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const psychometricQuestionsSchema = new Schema({
          category_id:{
                    type:Schema.Types.ObjectId,
                    ref:'questionsCategories'
          },
          optionA:{
                    type:String,
                    ref:''
          },
          optionA_marks:{
            type:Number,
            ref:''
          },
          optionB:{
                    type:String,
                    ref:''
          },
          optionB_marks:{
            type:Number,
            ref:''
          },
          optionC:{
                  type:String,
                  ref:''
          },
          optionC_marks:{
            type:Number,
            ref:''
          },
          optionD:{
                  type:String,
                  ref:''
          },
          optionD_marks:{
            type:Number,
            ref:''
          },
          optionE:{
            type:String,
            ref:''
          },
          optionE_marks:{
            type:Number,
            ref:''
          },
          questions:{
                    type: String,
                    default: ''
          },
         },
          {
            timestamps: true
          });


const psychometricQuestions = mongoose.model('psychometricQuestions', psychometricQuestionsSchema);

module.exports = psychometricQuestions