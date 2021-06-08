const passport       = require("passport");
const LocalStrategy  = require("passport-local");
const methodOverride = require("method-override");
const session        = require("express-session");
const cookieParser   = require("cookie-parser");
const express        = require("express");
const User           = require("./models/user");
const Product        = require("./models/product");
const mongoose       = require("mongoose");


const { mongoURI } = require("./config/keys");

var app = express();


//REQUIRING ROUTES    
const    productRoutes    = require("./routes/Product");
const    cartRoutes       = require("./routes/Cart");
const    indexRoutes      = require("./routes/Index");


app.set("view engine" , "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:false}));
app.use( express.static('views'));

app.use( function( req, res, next ) {
        
    if ( req.query._method == 'PUT' ) {
        req.method = 'PUT';
        req.url = req.path;
    } else if ( req.query._method == 'DELETE' ) {
        req.method = 'DELETE';
        req.url = req.path;
    }       
    next(); 
});


app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));

app.use(function(req, res, next) {
    next();
});


app.use(require("express-session")({
    secret: "nothing",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MongoDB up and runnning");
})



app.use("/", indexRoutes);
app.use("/product", productRoutes );
app.use("/cart", cartRoutes);


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

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is started........");
});


app.get("/admin", function(req, res){
    res.render("admin", {currentUser : req.user});
});


app.get("/editprofile/:id",(req,res)=>{
    res.render("editprofile",{key:req.params.id, currentUser: req.user});
});

app.put("/edit/:key/:id",(req, res, next)=>{
    User.findByIdAndUpdate(req.params.id, req.body.user , (err, updateprofile)=>{
        if(err){
            console.log(err)
        }
        else{
            if(req.params.key=="profile")
            res.redirect('/profile');
            else if(req.params.key=="place")
            res.redirect('/placeorder/'+req.params.id);
            else
            res.redirect('/buynow/'+req.params.key+'/'+req.params.id);
        }
    })
});
