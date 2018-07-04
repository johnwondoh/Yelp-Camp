var mongoose    = require("mongoose");
var Campground  = require("./models/campgrounds");
var Comment     = require("./models/comment");

var data = [
    {
        name: 'Snowy Moutains',
        image: "https://farm1.staticflickr.com/231/449630003_56eaa7c686.jpg",
        description: "The camp were snow ain't shit"
    },
    {
        name: 'Forest Bizza',
        image: "https://farm1.staticflickr.com/951/41067031894_d30afbb669.jpg",
        description: "The camp were snow ain't shit"
    },
    {
        name: 'Alunguntugui',
        image: "https://farm1.staticflickr.com/74/180338316_11c27993bb.jpg",
        description: "The camp were snow ain't shit"
    }
];

function seedDB(){
    // remove all campgrounds
    Campground.remove({}, function (err){
        if(err){
            console.log(err);
        } 
        console.log('removed campgrounds');
        
        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log('added a campground ');
                    // add comments
                    Comment.create(
                        {
                            text: "This place is awesome, wish I had internet though",
                            author: "Zulomite"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log('created new comments');
                            }
                        }
                    );
                }
            });
        });
    });
}

module.exports = seedDB;