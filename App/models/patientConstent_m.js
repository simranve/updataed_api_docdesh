const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const patientConstentSchema = new Schema({
    user_id:{
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    ccmConstent:{
      type:Number,
    //   ref:'User'
    default:0

    },
    bhiService:{
      type:Number,
      default:0,
    },
    patientName:{
      type:String,
      default:''
    },
   facilityName:{
      type:String,
      default:'',
  },
  roomNo:{
      type:String,
      default:'',
  },
  patientSignature : {
      type:String,
      default:'',
  },
  verbalConstent:{
      type:String,
      default:'',
  },
  // careGiven:{
  //   type:String,
  //   default:'',
// }
careNavigator:{
    type:String,
    default:'',
}
},
{
    timestamps: true
}
);

const patientConstent = mongoose.model('patientConstent', patientConstentSchema);

module.exports = patientConstent;
