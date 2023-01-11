// Take our token that is provided by the request object (headers: authorization)
// Check to see if the token is expired. If it is expired, write a response back to the user
// If the token is valid we will crate a variable to contain the user's information based off of the ID we captured in the createion of the token.
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const validateSession = async(req, res, next) => {
    try {
        const token = req.headers.authorization
        // verify the token to see if it is expired
        const decodedToken = await jwt.verify(token, process.env.JWT)
        console.log(decodedToken);

        const user = await User.findById(decodedToken.id);

        if (!user){
            throw Error("User not found")
        }

        req.user = user

        req.test = "this is a test"
        return next();
    } catch (error) {
        res.json({message: error.message})  
    }
}

module.exports = validateSession