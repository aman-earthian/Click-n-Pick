var express = require("express");
var router = express.Router(); 
var passport = require("passport");
var Product = require("../models/product");
var User = require("../models/user");


router.get("/:id", isLoggedIn, function(req, res){
    
    var user = req.user.cart;
    var found = 0;
    var identity;
    console.log(user);

    user.forEach((product) => {
        if((product.id).equals(req.params.id)){
            found = 1;
            identity = product._id;
        }
    });
    if(found){
        res.redirect("/cart/inc/" + identity);
    } else{
        var product = req.params.id;
        var user = req.user;
        var item = {
            id : product,
            quantity : 1
        }

        user.cart.push(item);
        user.save().then(idea=> {

            res.redirect('/');
        });
        res.redirect("/product/"+req.params.id);
    } 
});


router.get("/remove/:id", (req, res)=> {
    var user = req.user;
    product = req.params.id;
    
    user.cart.pull(product);
    user.save()
    res.redirect("back");
});



router.get("/", isLoggedIn, (req, res) => {

    var user = req.user;

    User.findById(req.user.id).populate("cart.id").exec((err, user) => {
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            // console.log(user);
            res.render("cart", {currentUser : user});
        }
    });
});

router.put("/inc/:id", (req, res)=>{
    var product = req.params.id;

    User.findOneAndUpdate( {'_id' : req.user._id, 'cart._id' : product},
        { $inc : { 'cart.$.quantity' : 1}}, 
        (err)=>{
            if(err)
                console.log(err);
            else
                res.redirect("back");
        }
    );
});


router.put("/dec/:id", (req, res)=>{
    var product = req.params.id;
    var label = req.user.cart;


    User.findOneAndUpdate( {'_id' : req.user._id, 'cart._id' : product},
        { $inc : { 'cart.$.quantity' : -1}}, 
        (err)=>{
            if(err)
                console.log(err);
            else
                res.redirect("back");
        }
    );
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;


