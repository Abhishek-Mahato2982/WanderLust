const Listing =  require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // here we have acquired the our mapbox geocoding service
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });  // we have initiated the geocoding service by passing our mapToken

module.exports.index = async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listing/new.ejs");
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "The listing that your looking doesn't exists!");
        return res.redirect("/listing");
    }
    res.render("listing/show.ejs", {listing});
};

module.exports.createListing = async (req,res,next) => {
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })

    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry; // Storing the coordinates in the database

    let saveListing = await newListing.save();
    console.log(saveListing);

    req.flash("success", "New listing has been successfully saved.");
    res.redirect("/listing");
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "The listing that your looking doesn't exists!");
        res.redirect("/listing");
    }else{
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listing/edit.ejs", {listing, originalImageUrl});
    }
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){   // when the file doesn't exists in the variable then it will show undefine then in order to check whether empty or not we use typeof
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success", "Listing has been successfully updated!");
    res.redirect("/listing");
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing has been deleted!");
    res.redirect("/listing");
};

module.exports.searchListing = async (req,res) => {
    let {location, country} = req.query;
    const allListings = await Listing.find({location: location, country: country});
    
    if(allListings.length !== 0){
        res.render("listing/index.ejs", {allListings});
    }else{
        req.flash("error", "Requested Listing is not Found");
        res.redirect("/listing");
    }  
};