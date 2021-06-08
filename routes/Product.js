var express = require("express");
var router = express.Router(); 
var passport = require("passport");
var Product = require("../models/product");
var User = require("../models/user");




router.get("/", (req, res) => {
    res.render("product" , {currentUser : req.user});
});

router.get("/:id/update" ,isAdmin , (req,res) => {
    Product.findById(req.params.id , (err,found) => {
        if(err){
            res.redirect("back");
            console.log(err);
        } else{
            res.render("admin",{product : found, currentUser : req.user});
        }
    });
});

router.put("/:id", (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body.product, {new: true}, (err, update) => {
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.redirect("/product/"+req.params.id);
        }
    });
});

router.delete("/:id", (req, res) => {
    Product.findByIdAndUpdate(req.params.id, (err) => {
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.redirect("/home");
        }
    });
});


router.get("/:id", (req, res)=> {
    Product.findById(req.params.id, (err, found)=>{
        if(err){
            console.log("Error");
            res.redirect("/home");
        } else{
            res.render("product", {product : found , currentUser : req.user});
        }
    })
});



function isAdmin(req, res, next){
    if(req.user.isAdmin)
        return next();
    
        res.redirect("back");
}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports = router;