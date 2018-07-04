var express = require("express");
var router  = express.Router({mergeParams: true});
// the above additional parameter {mergeParams: true} is necessary if we want all params to merge
// if, say the id is specified in the app file [nessay for shortening path declarations]. If we don't use this
// and specify and id in app.js, we will get an error since the id will be null (unless this parameter is 
// merged with existing ones)
var Campground  = require("../models/campgrounds");
var Comment     = require("../models/comment");
// adding middleware for checking loggin and authorization
var middleware = require("../middleware/index");

// COMMENT new -- new comment form
router.get('/new', middleware.isLoggedIn, function(req, res) {
    // the middleware is added to ensure that a user is logged in before they can add a comment
    // this middleware is defined by us below -- (unless moved)
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
           res.render('comments/new', {campground: campground});
       }
    });
});
// COMMENT create -- creates a new comment
router.post('/', middleware.isLoggedIn, function(req, res){
    // the middleware is also added here since a post request can still be sent 
    // to create a comment event if the user isn't logged in
   Campground.findById(req.params.id, function(err, campground) {
       if(err){
           console.log(err);
           res.redirect('/campgrounds'); 
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err) {
                   req.flash("error", "Something went wrong...");
                   console.log(err);
               } else {
                   // getting the author of the comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save the comment
                   comment.save();
                   //push newly created comment into campgrounds comment array
                   campground.comments.push(comment); 
                   campground.save();
                    //   console.log(comment);
                    req.flash("success", "Successfully added comment");
                   res.redirect('/campgrounds/'+campground._id);
               }
           });
       }
   });
});


/******Edit and Update of Comments*******/
//EDIT Comment Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else {
            res.render('comments/edit', {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });
});


// UPDATE comments route
router.put('/:comment_id', middleware.checkCommentOwnership,  function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

/****COMMENT DESTROY Route*****/
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // res.send('Destroying comment route');
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});




/********* Authorization middleware **********/
// we implement a middle check checking the authority of a user, i.e., what he 
// can and cannot do. Note that authorization is different from authentication.

module.exports = router; 