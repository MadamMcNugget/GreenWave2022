// const nodemailer = require("nodemailer");
const Volunteer = require('../models/volunteer');

exports.getAllVolunteers = (req,res,next) => {
	
	const volunteerQuery = Volunteer.find();
	volunteerQuery.then( volunteersData => {
		res.status(200).json({
			message: "all volunteers fetched!",
			volunteers: volunteersData
		})
	}).catch( error => {
		res.status(500).json({ message: "failed to fetch all volunteers...", error: error });
	});
}

exports.getOneVolunteer = (req,res,next) => {;

	Volunteer.findById(req.params.id).then( volunteer => {
		if (volunteer)
			res.status(200).json(volunteer);
		else
			res.status(200).json({message: "volunteer not found"});
	}).catch( error => {
		res.status(500).json({message: "Fetching volunteer failed"});
	})
}

exports.addVolunteer = (req,res,next) => {

	console.log('adding a new volunteer');
	console.log(req.body);

	volunteer = new Volunteer(req.body);
	volunteer.save().then( data => {

		/*
		//send intake mail
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.NODEMAIL_USER_EMAIL,
				pass: process.env.NODEMAIL_USER_PASSWORD
			}
		});

		let mail = {
			to: req.body.email,
			from: 'hazel <hazelyip@hotmail.com>',
			subject: 'test mail',
			text: 'testing test mail from field'
		} 

		// send mail with defined transport object
		let info = transporter.sendMail( mail, (error, info) => {
			if (error) 
				res.status(200).json({message: "could not send email", error: error});
			else
				res.status(200).json({message: "message sent!"});
		})*/

		res.status(200).json({
			message: "volunteer added!",
			volunteer: data
		})

		//TODO: send intake email when added new volunteer
	}).catch( error => {
		res.status(500).json({ message: "Email already taken", error: error });
	})
	
}

exports.editVolunteer = (req,res,next) => {

	const volunteer = new Volunteer({
		_id: req.params.id,
		...req.body
	});
	Volunteer.updateOne( {_id: req.params.id }, volunteer).then(result => {
		if (result.n > 0) 	// if updated
			res.status(200).json({message: 'Update success!'});
		else 
			res.status(200).json({message: 'Not Authorized or just cannot update volunteer'});
	}).catch( error => {
		res.status(500).json({message: 'Failed to update volunteer', error: error});
	});
	
}

exports.deleteVolunteer = (req,res,next) => {

	Volunteer.deleteOne({_id: req.params.id}).then( result => {
		if (result.n > 0) 	// if updated
			res.status(200).json({message: "deletion success"});
		else
			res.status(500).json({message: "deletion failed"});
	}).catch( error => {
		res.status(500).json({message: "Deleting volunteer failed", error: error});
	})
	
}

// exports.sendMail = (req,res,next) => {

// 	console.log('sending mail');

// 	roles = req.body.roles;
// 	rolesExist = false;
// 	for ( var role in roles ) {
// 		if (roles[role] === true){
// 			rolesExist = true;
// 			break;
// 		}
// 	}

// 	let transporter = nodemailer.createTransport({
// 		host: "smtp.gmail.com",
// 		port: 465,
// 		secure: true, // true for 465, false for other ports
// 		auth: {
// 			user: process.env.NODEMAIL_USER_EMAIL,
// 			pass: process.env.NODEMAIL_USER_PASSWORD
// 		}
// 	});


// 	if (rolesExist) {
// 		query = {
// 			'$or': []
// 		}
// 		for ( var role in roles ) {
// 			if (roles[role]){
// 				var r = JSON.parse('{"roles.' + role + '": true}');
// 				query.$or.push( r );
// 			}
// 		}

// 		Volunteer.find( query ).then( data => {
// 			selectedEmails = [];
// 			for ( var v in data ) {
// 				selectedEmails.push(data[v].email);
// 			}

// 			let mail = {
// 				bcc: selectedEmails,
// 				cc: req.body.cc,
// 				subject: req.body.subject,
// 				text: req.body.body
// 			} 

// 			// send mail with defined transport object
// 			let info = transporter.sendMail( mail, (error, info) => {
// 				if (error) 
// 					res.status(200).json({message: "could not send email", error: error});
// 				else
// 					res.status(200).json({message: "message sent!"});
// 			})
// 		}).catch(error => {
// 			console.log(error);
// 			res.status(500).json({message: "Sending email failed..", error: error });
// 		})

// 	} else {

// 		let mail = {
// 			cc: req.body.cc,
// 			subject: req.body.subject,
// 			text: req.body.body
// 		} 

// 		// send mail with defined transport object
// 		let info = transporter.sendMail( mail, (error, info) => {
// 			console.log(info);
// 			console.log(error);
// 			if (error) 
// 				res.status(500).json({message: "could not send email - " + error.response, error: error});
// 			else
// 				res.status(200).json({message: "message sent!"});
// 		})

// 	}

	

// }