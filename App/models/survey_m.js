
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let serveySchema = new Schema({
  servey_title:{
      type: String,
      required: true,
  },
  servey_link:{
      type: String,
      required: true,
  },
  servey_type:{
    type: Number,
    required: true,//1- for evaluation app 2-for meditations 3-staff evaluation survey 4-for psyc medical 5-for psyc disorder 6- provider evaluation survey
}
},
{
    timestamps:true
}
)

const Servey = mongoose.model('Servey', serveySchema);
module.exports = Servey