const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactProviderSchema = new Schema({
    account_id:{
        type:String
    },
    userNameP: {
        type:String,
    },
    firstNameP: {
        type:String,
    }

    },
    {
        timestamps: true
    }
);



const contactProvider = mongoose.model('contactProvider', contactProviderSchema);
module.exports = contactProvider;