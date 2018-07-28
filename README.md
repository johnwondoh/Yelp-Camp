# Yelp Camp

Yelp Cam is a full CRUD web application that includes authentication, authorization, and RESTful routing. It allows users to sign up to add new campgrounds or to comment on a campground. To edit or delete a campground, the user needs to be authorized to do so. That is, a check is put in place to ensure that users are the owner of the campground or comment that they want to edit or delete. This application was built as part of a Udemy course, the Web Developer Bootcamp by Colt Steele. 

## Authentication
Users who have not been authenticated (signed up or logged in) will only be able to view campgrounds that are available on the website, and the comments that are available under each campground. They will, however, not be able to add new campgrounds or comments to the application, or edit or delete an existing comment or campground. 

To be able to do this, they will need to either login in, if they have already registered, or signed up if they haven’t. We used the middleware 'passport' and internally specified middleware for this. After authentication, these are what a user can do:

* Post a new campground
* Comment on an existing campground


## Authorization
Since users who have been authenticated should not be allowed to edit or delete a comment that does not belong to them, we implemented measure to prevent this by specifying authorization. After a user has been authenticated, they only have the authority to delete or edit items that belong to them.  We use internally specified middleware to achieve this. Authorization ensures the following:

Authenticated users can edit or delete any of their comments on any posted campground. 
Authenticated users can edit or delete any campground that was posted by them


## Dependencies:
   * body-parser
   * connect-flash
   * ejs
   * express
   * express-session
   * method-override
   * mongoose
   * passport
   * passport-local
   * passport-local-mongoose


## Frameworks
* Express
* Semantic UI


## Database
* Mongo DB
