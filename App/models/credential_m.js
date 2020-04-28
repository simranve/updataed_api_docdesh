const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
  emptyError
} = require('./../helper/errorHandler');


const credentialSchema = new Schema({
  
  credential_type: {
    type: String,
    required: true
  },
  
  },
  {
    timestamps: true
  }
  );




 const Credential = mongoose.model('Credential', credentialSchema);
  module.exports = Credential;