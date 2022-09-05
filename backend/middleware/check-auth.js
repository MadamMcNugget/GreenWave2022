// middleware to check whether requests should accepted or rejected
// middleware is a function which gets executed on incoming requests
// will be used in posts.js route

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	// token can also be obtained via query parameters, but most apis use this
	// authorization is typically chosen name, can be any name
	// convention to indication that we added token to authorization. 
	// headers typically containts 'Bearer <token_here>' to indication json web token. 
	// split() with separate above string. since we want <token>, get it with array [1]
	try {
		const token = req.headers.authorization.split(" ")[1];	// split fails if no authorization header, so catch
		const decodedToken = jwt.verify(token, process.env.JWT_KEY);	// verify also fails if it cannot verify, so add catch block
		req.userData = {email: decodedToken.email, userId: decodedToken.userId };
		//if made it this far, then we know we have a valid token
		next();
		// next() keeps any request fields we added to it, so if posts.js uses this middleware, it will also have object seen above with decodedToken
		// 'userData' can be anything as long as its not already taken.

	} catch (error) {
		res.status(401). json ({message: "You are not authenticated"});
	}	

}; 