var express  = require("express");
var router   = express.Router(); 
var passport = require("passport");
var Product  = require("../models/product");
var flash    = require('connect-flash');
var User     = require("../models/user");

router.get('/flash', (req, res) => {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash('sucess', 'Successfully Logged In');
    res.redirect('/');
  });
   


router.get("/", (req, res) => {
    res.redirect("/home");
});



router.get('/home', (req, res) => {
    Product.find({}, (err, products) => {
        if(err){
            console.log("Error 404")
        }
        else{
            res.render("index", {products:products, currentUser : req.user});
        }
    })
})

router.post('/home', isLoggedIn, (req, res) => {
    Product.create(req.body.product, (err, newProduct)=>{
        if(err){
            res.redirect("back");
        }
        else{
            newProduct.save();
            res.redirect('/home');
        }
    });
    
});


router.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile" , {currentUser : req.user});
});

router.get("/orders", isLoggedIn,(req, res) => {
    products = req.user.order;
    res.render("order", {products: products, currentUser : req.user});
});


router.get("/catalogue", (req, res) => {
    res.render("catalogue" , {currentUser : req.user});
});

router.get("/catalogue/:id", (req, res)=> {
    Product.find({category : req.params.id}, (err, found)=>{
        if(err){
            console.log("Error");
            res.redirect("/home")
        } else{
            res.render("catalogue", {products : found , currentUser : req.user})
        }
    })
});


router.get("/buy/cart", isLoggedIn, (req, res) => {

});


router.get("/buy/:id", isLoggedIn, (req, res)=>{
    var product = req.params.id;
    var user = req.user;
    var item = {
        id : product,
        quantity : 1
    }

    user.cart.push(item);
    user.save();
    Product.findById(req.params.id, (err, found)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.render("buy", {product : found , currentUser : req.user});
        }
    });
});


router.get("/payment", isLoggedIn, (req, res)=> {
    res.render("payment", {currentUser : req.user})
});

router.get('/method',isLoggedIn, (req, res)=>{
    res.render("payment", {currentUser : req.user});
})
router.post('/method/:id', (req,res)=>{
    User.findById(req.params.id).populate("cart").exec((err,founduser)=>{
        if(req.body.payment=="COD"){
            req.flash("success", "Your order has been Successfully placed...");
            res.render("invoice",{method:req.body.payment,currentUser: founduser});}
        else{
            res.redirect("/online");
        }
        founduser.cart.forEach((product)=>{
            founduser.order.push(product);
            founduser.save();
        })
    })
})
router.get('/online',(req, res)=>{
    res.render('online', {currentUser : req.user});
})
router.post('/online/:id',(req,res)=>{
    User.findById(req.params.id).populate("cart").exec((err,founduser)=>{
        if(err){
            res.redirect("back");
        }    
        else{
            req.flash("success", "Your order has been Successfully placed...");
            res.render("invoice",{method:"ONLINE",currentUser: founduser});
        }
    })
})

// router.post("/method", isLoggedIn, (req, res)=> {
//     // console.log(req.body.COD);
//     // if(req.value == 'COD')
//         res.render("invoice", {currentUser : req.user, method : "COD"});
//         var user = req.user;
        
//     // else{
//         // res.render("online", {currentUser : req.user, method : "COD"});
//     // }
// })



// ==========================
// AUTH
// ==========================


router.get("/register" , (req , res) =>{   
    res.render("register", {currentUser : req.user});
});

router.post("/register" , (req , res) => {
    var newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname, mobile: req.body.mobile, address: req.body.address, username: req.body.email, profile: '', isAdmin : false});
    
    User.register(newUser , req.body.password , (err , user) => {
        if(err){
            console.log(err);
            return res.render("register", {currentUser : req.user});
        }else{
            res.redirect("/login");
        }
           
    });
});

router.get("/login" , (req , res) => {
    res.render("login", {currentUser : req.user});
});

router.post("/login" , passport.authenticate("local" , {
    successRedirect: "/home",
    failureRedirect: "/login"
}) , (req , res)=>{
    req.flash('success');
});

router.get("/logout" , function(req , res){
    req.logout();
    res.redirect("/home");
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;