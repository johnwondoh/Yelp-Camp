var express         = require("express"), 
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require('mongoose'),
    Campground      = require("./models/campgrounds"), 
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash");
    
// Requiring route files
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");

// console.log(process.env.DATABASEURL); --- viewing the environment variable DATABASEURL for debugging purposes
/***** locally hosted database ******/
// using environment - specified in the console by --- export DATABASEURL=mongodb://localhost/yelp_camp 
mongoose.connect(process.env.DATABASEURL);
// previous local connection
// mongoose.connect('mongodb://localhost/yelp_camp');
/****** database hosted on MLAB ******/
// mongoose.connect(' ');

/****** Alternative Connection ******/
// var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp'
// mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public")); 
// seedDB();  /stop using seed database (seedDB) for the mean time -- probably finished serving its purpose

// using method override for updates and deletes
app.use(methodOverride("_method"));
// using connect-flash for flash messages
app.use(flash());

/********PASSPORT Configuration*********/
app.use(require("express-session")({
    secret: "Regina is the precious",
    resave: false,
    saveUninitialized : false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// specifying a middle to send current user to all routes so that 
// login, logout, and sign up buttons can be displayed based on the 
// login status of the user, i.e., if they are logged in or not
app.use(function(req, res, next){
    // adding users to all ejs (html) templates
    res.locals.currentUser = req.user;
    //Adding flash messages to all ejs (html) templates
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// specifying routes to be used 
// The added parameter, e.g., /campground, when used here indicates that it can 
// be removed from the refacted file, and only added here. That is, instead of writing
// get('/campgrounds'), we'll write get('/')
app.use("/", indexRoutes); // "/" added just for consistency
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('The YelpCamp Server Has Started....');
});