// ? Add your boilerplate code for a controller
const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ! Break down the url to two levels, - /user = first level, belongs on the app.js; /signup = second level, belongs on the controller.js 

// ? Create a route that is a POST ("/signup")
router.post("/signup", async (req, res) => {
// 1. create a new object based off the Model Schema (ie. User)

try{  
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    })
// 2. Try Catch - we want to try and save the data but if we get an error we want to send back the error message.


    const newUser = await user.save()
    // After we generate a NEW user we can generate a token
    const token = jwt.sign({id: newUser._id}, process.env.JWT, {expiresIn: 60 * 60 * 24});

    res.json({
        user: newUser,
        message: "Success, user created!",
        token: token,
    });
}catch (error) {
    res.json({message: error.message})
}    
});

// ? Make sure your route is working
// ! It WORKS
// ? Full url localhost:4000/user/signup

// ? Create a ('/login) route POST
// ? Make sure the route is working
// ? Fuller URL: localhost:/4000/user/login
// ? Try to console log the email in the route

router.post("/login", async (req, res)=>{
try {
//1. check our DB to see if the email that is supplied in the body is found in our DB.
const user = await User.findOne({email: req.body.email})

// res.json({user: user, message:"Success"});
// 2. If we found a document (aka record) in the database validate that the password matches otherewise send a response that there is no match.

// ? We dont find a user and throw and ERROR
if (!user){
    throw new Error("User Not Found");
}

const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
// ? Password do not match we throw an ERROR
    if(!isPasswordMatch) {
        throw new Error("Password is not a match");
    }
// Pass all our checks
const token = jwt.sign({id: user._id}, process.env.JWT, {expiresIn: 60 * 60 * 24});


res.json({ user: user, message: "Success", token: token });
} catch (error) {
  res.json({ message: error.message });
}
 
});


module.exports = router