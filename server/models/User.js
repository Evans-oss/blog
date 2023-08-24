const mongoose = require('mongoose');

// creating a schema 
const Schema = mongoose.Schema;
const UserSchema= new Schema ({
    username: {
        type: String,
        required: true,
        unique :true
    },
    password:{
        type: String,
        required: true,
        unique :true
    }

});
module.exports = mongoose.model('User', UserSchema); 