var Campground  = require("../models/campgrounds");
var Comment     = require("../models/comment");

var middlewareObj = {};

/********* Authorization middleware **********/
// we implement a middle check checking the authority of a user, i.e., what he 
// can and cannot do. Note that authorization is different from authentication.
//------ moved to middleware/index--------------//

/*----checking campground post ownership to allow editting and delete----*/
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect('back');
    }
};

/*--checking comment ownership to allow edit and delete-----*/
middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id , function(err, foundComment) {
            if(err){
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect('back');
    }
};

// we define a middle wear to check if a user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect('/login');
} ;




module.exports = middlewareObj;