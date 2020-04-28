const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const patientRefferelSchema = new Schema({
    user_id:{
      type:String,
      required:true
    },
    refferelId:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    refferal_type:{
      type:Number,
      default:1,
    },
    patient_image:{
      type:String,
      default:''
    },
   patient_name:{
      type:String,
      default:'',
  },
  facility_name:{
      type:String,
      default:'',
  },
  room_number : {
      type:String,
      default:'',
  },
  reason:{
      type:String,
      default:'',
  }
},
{
    timestamps: true
}
);

const patientRefferel = mongoose.model('patientRefferel', patientRefferelSchema);

module.exports = patientRefferel;


