// Restructuring Listings

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
const Listing =  require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//Index and Create route
router
.route("/")
.get(wrapAsync (listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync (listingController.createListing)
);


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Search-Bar route
router.get("/search",
    wrapAsync (listingController.searchListing)
);

//we have put new first because if we put new after the show, update and delete route then server we will consider the new as id and start look for it in the data base.



//Show, update, Delete route
router
.route("/:id")
.get(wrapAsync (listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync (listingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync (listingController.destroyListing)
);



//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync (listingController.renderEditForm)
);

module.exports = router;

