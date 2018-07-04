var express = require("express");
var router  = express.Router();
// we use router instead of app here, and export it
var Campground  = require("../models/campgrounds");
// adding middleware for checking loggin and authorization
var middleware = require("../middleware/index"); 

// INDEX route -- show all campgrounds
router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
});

// CREATE route -- add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){ // requires user to be logged in first
    // get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    // getting currently logged in author info
    var author = {
        id: req.user._id,
        username: req.user.username
    }; 
    // creating new campground object
    var newCampground = {name: name, image: image, description: description, author: author, price: price};
    // campgrounds.push(newCampground);
     Campground.create(newCampground, function(err, newlyCreated){
         if(err) {
             console.log(err);
         } else {
             console.log(newlyCreated);
             res.redirect('/campgrounds'); 
         }
     });
});

// New route -- show form to create new campgound 
router.get('/new', middleware.isLoggedIn, function(req, res) { // requires users to be logged in first
    res.render('campgrounds/new');
});


// SHOW route -- shows one thing, e.g., /dogs/:id -- shows info about one dog
router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            res.render('campgrounds/show', {campground: foundCampground}); 
        }
    });
}); 

/****** Updating Campgrounds*********/

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.render('campgrounds/edit', {campground: foundCampground});
      }  
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY Campground Route 
router.delete("/:id", middleware. checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//Exporting router
module.exports = router;
