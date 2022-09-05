// controller: logic for routes

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
	bcrypt.hash(req.body.password, 10)	// salting rounds, longer = safer, but takes more time
		.then(hash =>{
			const user = new User({
				email: req.body.email,
				password: hash, //req.body.password 	//storing passwords like this is bad. use package to help hash password --> npm install --save bcrypt
				status: req.body.status
			});
			user.save()
				.then(result => {
					res.status(201).json({message: "user created!", result: result});
				})
				.catch (err => {	// catch if duplicate email or some error.
					console.log( err );
					res.status(500).json({
						message: "Email already taken. Please use another email."
					});
				})
		});
}

exports.userLogin = (req, res, next) => {
	// find if email/username exists
	let fetchedUser;
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user )	{	//user not found!
				return res.status(401).json({message: 'Auth failed' });
			}
			fetchedUser = user;
			// if reached here then user found! check for matching password
			return bcrypt.compare(req.body.password, user.password);
		})
		.then(result => {	//result returns true if compoare is successful, false if not
			if (!result){
				return res.status(401).json({message: 'Auth failed' });	// since can only have 1 res in block, 'return' is nessasary so we can use res.stat in other part of block
			}

			const token = jwt.sign(
				//creates token based on input data of choice, in this case a json object
				// second param is our own secret - password we use for creating the hash, will only be stored on server and used to validate the hashes
				// 3rd param are optional params. expires in 1h is quite typical tokens shouldn't last forever
				{ email: fetchedUser.email, userId: fetchedUser._id }, 
				process.env.JWT_KEY, 	// process.env provides access to global variable in begin/nodemon.js
				//{ expiresIn: "1h" }
			); 	

			// success!
			res.status(200).json({
				token: token, 
				message: 'token created!', 
				expiresIn: null, //3600,
				userId: fetchedUser._id,
				email: fetchedUser.email,
				status: fetchedUser.status
			});	//duration in seconds before expires

		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({
				message: "Something went wrong when signing in :/"
			});
		})

	//create token
}

exports.viewUsers = ( req, res, next ) => {

	const userQuery = User.find();
	userQuery.then( userData => {
		res.status(200).json({
			message: 'found all users',
			users: userData
		})
	}).catch( error => {
		res.status(500).json({ message: 'failed to fetch all users...'});
	})
}

exports.editUser = ( req, res, next ) => {

	const user = new User({
		_id: req.params.id,
		...req.body
	})

	User.updateOne( { _id: req.params.id }, user ).then( result => {
		if (result.n > 0) 	// if updated
			res.status(200).json({message: "update success", user: user});
		else
			res.status(200).json({message: "update failed"});
	}).catch( error => {
		res.status(500).json({message: 'Failed to update user' + error, error: error});
	});

}
