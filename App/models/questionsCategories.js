const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
 
  category_name:{
    type:String,
    default:'',
},

},
{
 timestamp:true
}

);

const questionsCategories = mongoose.model('questionsCategories',videoSchema);
module.exports = questionsCategories;