const User = require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    res.render("user/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser,password);

        console.log(registerUser);
        req.login(registerUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust !!");
            res.redirect("/listing");
        });
        
    } catch(e){
        console.log(e.message);
        req.flash("error", e.message);
        return res.redirect("/signup");
    }  
};

module.exports.renderLoginForm = (req,res) => {
    res.render("user/login.ejs");
};

module.exports.login = async (req,res) => {
    let {username} = req.body
    req.flash("success", `Welcome back ${username} to WanderLust`);
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logOut((err) => {
        if(err){
           return next(err);
        }

        req.flash("success", "Your are logged out!");
        res.redirect("/listing");
    });
};