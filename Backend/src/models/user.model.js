const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        unique : [true, "OOPS! username already exists"],
        required : true,
    },

    email : {
        type : String,
        unique : [true, "Account already exists with this email address "],
        required : true,
    },
    password: {
        type : String,
        required : true
    }
})

const userModel = mongoose.model("users", userSchema)
// this method tells => in which collection user data is stored => which is 'users' and schema will be userSchema.. 
module.exports = userModel;