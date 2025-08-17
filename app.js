if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app =  express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utility/ExpressError.js")
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport =  require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";
const dburl = process.env.ATLASDB_URL;


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",() => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,                           //this store comes from above mongostore
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,   // This set a deadline for about 1week and the time is provide in milliseconds
        maxAge: 7*24*60*60*1000,                    
        httpOnly: true,
    },
};


app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main()
.then(() => {
    console.log("Connected to Database.");
})

.catch((err) => {console.log(err)});

async function main() {
  await mongoose.connect(dburl);  //replacing the MONGO_URL with dburl
}


// app.get("/", (req,res) => {
//     res.send("This is the root.");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // serializeUser means we are storing the user details in the session
passport.deserializeUser(User.deserializeUser()); // deserializeUser means we are deleting the user details from the session after completion

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/",userRouter);


//Page not found route
app.all("/random", (req,res,next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error Handling middlewaver 
app.use((err,req,res,next) => {
    let {statusCode = 505, message ="Something went wrong"} = err;
    res.status(statusCode).render("listing/error.ejs", {message});
});

app.get("/", (req, res) => {
  res.redirect("/listing"); // Or your main route
});

app.listen(8080, ()=>{
    console.log("Server 8080 is listening.");
});

