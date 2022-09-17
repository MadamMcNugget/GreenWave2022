const Voter = require( '../models/voter' );

exports.createVoter = ( req, res, next ) => {

	console.log( `creating new voter`, req.body );

	let voter = new Voter( req.body );
	voter.save().then( data => {

		res.status( 200 ).json( {
			success: true,
			message: "volunteer added!"
		} );

	// 	//TODO: send intake email when added new volunteer?

	} ).catch( error => {
		console.log( error );
		res.status( 200 ).json( { success: false, message: "Voter not added", error: error } );
	} );
}

exports.getAllVoters = (req,res,next) => {

	console.log("getting all voters");

	Voter.find().then( voters => {
		console.log( `got ${ voters.length } voters` );
		res.status(200).json({
			message: "fetched all voters",
			voters: voters
		});
	}).catch( error => {
		console.log( error );
		res.status(500).json({ message: 'fetching all voters failed' });
	})
}