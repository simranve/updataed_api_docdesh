const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientDocumentSchema = new Schema({
    provider_id:{
          type:Schema.Types.ObjectId,
          ref:'User'
    },
    patient_name: {
        type:String,
    },
    pdf_docs: {
        type:String,
    },
    dob: {
          type:Date,
      }
    },
    {
        timestamps: true
    }
);



const patientDocument = mongoose.model('patientDocument', patientDocumentSchema);
module.exports = patientDocument;