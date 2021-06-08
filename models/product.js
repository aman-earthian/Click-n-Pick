var mongoose = require('mongoose');
// var passportLocalMongoose = require('passport-local-mongoose');

var productSchema = new mongoose.Schema({
    category :  String,
    name     :  String,
    title    :  String,
    image    :  String,
    detail1  :  String,
    detail2  :  String,
    detail3  :  String,
    detail4  :  String,
    detail5  :  String,
    price :    Number,
    quantity : Number,
    created : {type: Date, default: Date.now}
});

// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Product" , productSchema);