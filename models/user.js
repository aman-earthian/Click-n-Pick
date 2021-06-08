var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    firstname : String,
    lastname : String,
    isAdmin : Boolean,
    password : String,
    username : String,
    mobile : String,
    profile : String,
    address : String,
    cart : [{
            id : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product"
            },
            quantity : Number
        }],
    order : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);