// Restructuring Reviews

const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utility/wrapAsync.js");
const ExpressError = require("../utility/ExpressError.js")

const Review =  require("../models/review.js");
const Listing =  require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");


// Review - POST ROUTE   
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync (reviewController.createReview)
);

// Review - DELETE ROUTE
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;