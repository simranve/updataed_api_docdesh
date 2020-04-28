const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const pateintRefferelDoseSchema = new Schema({
    
   patient_name:{
      type:String,
      default:'',
      trim: true,
  },
  refferelId:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  patient_dob:{
      type:String,
      default:'',
      trim: true,
  },
  patient_location:{
    type:String,
    default:'',
    trim: true,
  },
   name_of_medicine:{
        type:String,
        default:'',
        trim: true,
    },
   dose_of_medicine:{
        type:String,
        default:'',
        trim: true,
    },
   pharmacy_name:{
      type:String,
      default:'',
      trim: true,
   },
   frequency_dose:{
    type:String,
    trim:true,
    default:'',
   },
   pharmacy_fax_no:{
    type:String,
    trim:true,
    default:'',
   },
   prn_text:{
    type:String,
    trim:true,
    default:'',
   },
   yourfaxNumber:{
    type:String,
    trim:true,
    default:'',
   },
   pharmacy_phone_number:{
    type:String,
    trim:true,
    default:'',
   },




  
},
{
    timestamps: true
}
);

const pateintRefferelDose = mongoose.model('pateintRefferelDose', pateintRefferelDoseSchema);

module.exports = pateintRefferelDose;


