// const puppeteer = require('puppeteer');
const Voter = require("../models/voter");
const Question = require("../models/question");
const Volunteer = require("../models/volunteer");
// const nodemailer = require("nodemailer");
// const schedule = require("node-schedule");

//

// const scheduler = schedule.scheduleJob('00 21 * * *', function(req){

// 	//var host = req.get('host');

// 	//if ( host === 'localhost:3000') {
	
// 		console.log(Date.now().toISOString() + ' doing scheduled update to gvote');

// 		voterQuery = Voter.find({ status: '2canvassed' }).sort({ poll: 1 }); //status = 'canvassed' // sort by poll#
// 		voterQuery.then( voters => {

// 			//var voters = voters
// 			console.log("number of voters to update: " + voters.length);

// 			if (voters.length > 0) {

// 				var url = "https://vote.greenparty.ca";
// 				var poll;

// 				(async () => {

// 					const browser = await puppeteer.launch({
// 						headless: false,
// 						ignoreDefaultArgs: ['--disable-extensions']
// 					});
// 					const page = await browser.newPage();
// 					//await page.setViewport({ width: 1920, height: 1080 });

// 					// disable css and images so that page loads faster
// 					/*await page.setRequestInterception(true);
// 					page.on('request', (req) => {
// 					  	if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
// 						    req.abort();
// 						}
// 						else {
// 						    req.continue();
// 						}
// 					})*/

// 					await page.goto(url, {waitUntil: 'networkidle2'});
// 					await page.type('#login_email', process.env.GVOTE_USER);
// 					await page.type('#login_password', process.env.GVOTE_PASSWORD);
// 					await page.click('#login_button', {waitUntil: 'networkidle2'});

// 					console.log('logged in');

// 					for (var i = 0 ; i<voters.length ; i++){
// 						let voter = voters[i];
						
// 						if (poll !== voter.poll) {	//if poll is different, change poll

// 							poll = voter.poll;
// 							await page.goto(url + '/foot_canvasses/new', {waitUntil: 'networkidle2'});
// 							await page.type('.select2-search__field', poll); 
// 							await page.keyboard.press('Enter');	// press 'enter'
// 							await page.click('.footcanvass-submit', {waitUntil: 'networkidle2'});
// 							await page.waitForSelector('.foot-canvass-app');
// 							await page.waitFor(10000);

// 							console.log('navigation done~');
// 						}

// 						console.log('begin entering data')
// 						// find row with voter's sequence number. if unsuccessful, look for name
// 						let enterData = await page.evaluate( (voter) => {
// 							console.log('entering data for voter...');

// 							let voterEditted = false;
// 							let allVoters = document.querySelectorAll('div.person-row');
// 							for (var i = 0 ; i<allVoters.length ; i++) {
// 								thisVoter = allVoters[i];
// 								thisVoterName = thisVoter.querySelector('a').innerHTML;
// 								if (voter.name === thisVoterName){
// 									console.log('found voter');
// 									console.log(voter);
// 									thisVoter.querySelector('.pull-right').click();	// click to open form
// 									var qIndex;
// 									var ans;

// 									var value = "";

// 									// home/not home
// 									qIndex = voter.answers.map( function(x) {return x.questionID}).indexOf("5d40ccbce622cd24b43ac9d9");
// 									if ( voter.answers[qIndex].response !== null ) 
// 										ans = voter.answers[qIndex].response[0];
// 									else
// 										ans = null;
// 									if (ans === "5d632a04cd7c052baca8ca02"){ // ans = no
// 										console.log('voter not home');
// 										thisVoter.querySelector('.person-form').querySelector('a.pull-right').click();
// 										voterEditted = true;
// 									} else {

// 										console.log('voter is home');

// 										// support level 
// 										qIndex = voter.answers.map( function(x) {return x.questionID}).indexOf("5d8c071bddec2706194f61ec");
// 										if ( voter.answers[qIndex].response !== null ) {
// 											console.log('has support level');
// 											ans = voter.answers[qIndex].response[0];
// 											console.log('support: ' + ans);
// 											if (ans) {
// 												switch (ans) {
// 													case '5d8c071bddec2706194f61f1':
// 														value = "5";
// 														break;
// 													case '5d8c071bddec2706194f61f0':
// 														value = "4";
// 														break;
// 													case '5d8c071bddec2706194f61ef':
// 														value = "3";
// 														break;
// 													case '5d8c071bddec2706194f61ee':
// 														value = "2";
// 														break;
// 													case '5d8c071bddec2706194f61ed':
// 														value = "1";
// 														break;
// 												}
// 												if (value){
// 													thisVoter.querySelectorAll('select.form-control')[0].value = value;
// 													var event = new Event('change', { bubbles: true });
// 												    event.simulated=true;
// 													thisVoter.querySelectorAll('select.form-control')[0].dispatchEvent(event);
// 													voterEditted = true;
// 												}
// 											}
// 										} else {
// 											console.log('no support level indicated');
// 										}

// 										// sign
// 										qIndex = voter.answers.map( function(x) {return x.questionID}).indexOf("5d8c071bddec2706194f61f3");
// 										if ( voter.answers[qIndex].response !== null ) {
// 											console.log('has sign request :)');
// 											ans = voter.answers[qIndex].response[0];
// 											console.log(ans);
// 											if (ans) {
// 												thisVoter.querySelectorAll('a.btn')[3].click();
// 												var value;
// 												switch (ans) {
// 													case '5d8c071bddec2706194f61f6':
// 														value = "lawn";
// 														break;
// 													case '5d8c071bddec2706194f61f5':
// 														value = "window";
// 														break;
// 													case '5d8c071bddec2706194f61f4':
// 														value = "large";
// 														break;
// 												}
// 												if (value) {
// 													thisVoter.querySelectorAll("select.form-control")[2].value = value;
// 													voterEditted = true;
// 												}
// 											}
// 										} else {
// 											console.log('no sign request');
// 										}

// 										// Save deets!
// 										console.log('save');
// 										thisVoter.querySelector('span.pull-right').querySelector('a').click();

// 										if (!voterEditted)
// 											console.log('nothing changed for voter');

										
// 									}

// 									break;
// 								} // end when voter is found
									
// 							}
// 							voter.ifEditted = voterEditted;
// 							return voter;

// 						}, voter).then(voter => {
// 							 if (voter.ifEditted) {

// 								var voterInfo = {
// 									_id: voter._id,
// 									status: '3complete'
// 								}
								
// 								Voter.updateOne( {_id: voter._id }, voterInfo ).then( v => {
// 									console.log('voter ' + voter.name + ' updated');
// 								}).catch( error => {
// 									console.log('failed updating voter ' + voter.name + '\n' + error);
// 								})
// 							} else {

// 								var voterInfo = {
// 									_id: voter._id,
// 									needsManualEntry: true
// 								}
								
// 								Voter.updateOne( {_id: voter._id }, voterInfo ).then( v => {
// 									console.log('*** voter ' + voter.name + ' needs manual entry');
// 								}).catch( error => {
// 									console.log('failed updating voter ' + voter.name + '\n' + error);
// 								})
// 							}
// 						}).catch( error => {
// 							console.log('something went wrong :/');
// 							console.log(error);
// 							//res.status(500).json({ message: 'something went wrong when saving voter to Gvote...\n' + error });
// 						}) // end eval

						
// 					}

// 					//await page.screenshot({path: 'backend/images/screenshot.png'});
// 					await browser.close();
// 					res.status(200).json({ message: 'Data uploaded to GVote!' });
// 				})().catch( error => {
// 					res.status(500).json({ message: 'something went wrong when saving the poll\n' + error });
// 					console.log('something went wrong when updating info to gvote\n' + error);
// 				});
// 			} else { // end of if voters.length > 0
// 				console.log('no voters to update to gvote');
// 			}
// 		})
// 	//}

		
// })

exports.test = (req,res,next) => {

}

// exports.scrapePoll = (req,res,next) => {

// 	console.log("scraping poll# " + req.body.poll);

// 	var poll = req.body.poll + "";
// 	var url = "https://vote.greenparty.ca";
// 	var screenshot = "backend/images/screenshot.png";

// 	(async () => {

// 		const browser = await puppeteer.launch({
// 			headless: false,
// 			ignoreDefaultArgs: ['--disable-extensions']
// 		});
// 		const page = await browser.newPage();
// 		//await page.setViewport({ width: 1920, height: 1080 });

// 		// disable css and images so that page loads faster
// 		await page.setRequestInterception(true);
// 		page.on('request', (req) => {
// 		  	if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
// 			    req.abort();
// 			}
// 			else {
// 			    req.continue();
// 			}
// 		})


// 		await page.goto(url, {waitUntil: 'networkidle2'});
// 		await page.type('#login_email', process.env.GVOTE_USER);
// 		await page.type('#login_password', process.env.GVOTE_PASSWORD);
// 		await page.click('#login_button', {waitUntil: 'networkidle2'});

// 	for ( var p = 500 ; p <= 501 ; p++)	{

// 		polls = p + "0";
// 		console.log('scraping poll ' + polls);

// 		await page.goto(url + '/foot_canvasses/new', {waitUntil: 'networkidle2'});
// 		await page.type('.select2-search__field', polls); 
// 		await page.keyboard.press('Enter');	// press 'enter'
// 		await page.click('.footcanvass-submit', {waitUntil: 'networkidle2'});
// 		await page.waitForSelector('.foot-canvass-app');
// 		await page.waitFor(2000);

// 		console.log('navigation done~');

// 		let voterData = await page.evaluate( () => {
// 			console.log('evaluating page...');
// 			var voters = [];
// 			let allVoters = document.querySelectorAll('div.person-row');
// 			allVoters.forEach( voter => {
// 				let voterjson = {};
// 				let address = voter.querySelectorAll('span')[0].innerHTML;
// 				try {
// 					voterjson.poll = voter.querySelector('div.col-xs-1').innerHTML;
// 					voterjson.sequence = voter.querySelectorAll('div.col-xs-1')[1].innerHTML;

// 					let address = voter.querySelectorAll('span')[0].innerHTML;
// 					address = address.split(/ (.+)/);	// splits only first space
// 					let apthouse = address[0];
// 					voterjson.streetName = address[1];
// 					if ( apthouse.includes('-') ) {
// 						apthouse = apthouse.split(/\-(?=[^\-]+$)/);
// 						voterjson.aptNum = apthouse[0];
// 						voterjson.houseNum = apthouse[1];
// 					} else {
// 						voterjson.houseNum = apthouse;
// 					}

					
// 					voterjson.city = voter.querySelectorAll('span')[1].innerHTML;
// 					voterjson.name = voter.querySelector('a').innerHTML;


// 					voterjson.GVoteLink = voter.querySelector('a').getAttribute('href');

// 					try{
// 						voterjson.support = voter.querySelector('span.support-score').getAttribute('data-original-title');
// 					} catch {
// 						console.log('no support level indicated for this voter');
// 					}
// 				}
// 				catch (exception) { 
// 					res.status(500).json({ message: "something wrong with getting voter details"})
// 					console.log(exception); 
// 				}
// 				console.log(voterjson);
// 				voters.push(voterjson);
// 			})
// 			//console.log(voters);
// 			return voters;
// 		}).then( voters => {
// 			//console.log('voters');
// 			//console.log(voters);

// 			if ( voters.length === 0 ){
// 				res.status(200).json({
// 					message: 'no voters in poll'
// 				})
// 			} else {
// 				for (var i = 0 ; i < voters.length ; i++ ) {
// 					var count = 0;
// 					var voter = new Voter(voters[i]);
// 					//console.log(voter);
// 					voter.save().then( v => {
// 						count++;
// 						console.log("saving voter " + count);
// 						if ( count === voters.length ){
// 							console.log("done scraping poll " + polls);
// 							/*res.status(200).json({
// 								message: 'poll saved!',
// 								voters: voters
// 							})*/
// 						}
// 					})
// 					.catch( error => {
// 						res.status(500).json({ message: "could not save voter to database\n " + error});
// 					});
// 				}
// 				console.log('poll has been pulled! ' + voters.length + ' voters were added');
// 			}
// 		}).catch( error => {
// 			res.status(500).json({ message: 'something went wrong when saving the poll\n' + error });
// 			console.log('something went wrong when scraping poll ' + polls + ". trying again");
// 			p--;
// 		})
// 	}

// 		//await page.screenshot({path: 'backend/images/screenshot.png'});
// 		await browser.close();
// 		res.status(200).json({
// 			message: 'poll saved!',
// 			//voters: voters
// 		})
// 	})().catch( error => {
// 		res.status(500).json({ message: 'something went wrong when saving the poll\n' + error })
// 	});
		

// 	//res.status(200).json({data: "hi"});
// }

// exports.updateToGVote =  (req,res,next) => {

// 	var host = req.get('host');

// 	if ( host === 'localhost:3000') {

// 		res.setTimeout(30*60*1000);

// 		console.log(Date.now().toISOString() + ' doing scheduled update to gvote');

// 		voterQuery = Voter.find({ status: '2canvassed' }).sort({ poll: 1 }); //status = 'canvassed' // sort by poll#
// 		voterQuery.then( voters => {

// 			//var voters = voters
// 			console.log("number of voters to update: " + voters.length);

// 			if (voters.length > 0) {

// 				var url = "https://vote.greenparty.ca";
// 				var poll;

// 				(async () => {

// 					const browser = await puppeteer.launch({
// 						headless: false,
// 						ignoreDefaultArgs: ['--disable-extensions']
// 					});
// 					const page = await browser.newPage();
// 					//await page.setViewport({ width: 1920, height: 1080 });

// 					// disable css and images so that page loads faster
// 					/*await page.setRequestInterception(true);
// 					page.on('request', (req) => {
// 					  	if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
// 						    req.abort();
// 						}
// 						else {
// 						    req.continue();
// 						}
// 					})*/

// 					await page.goto(url, {waitUntil: 'networkidle2'});
// 					await page.type('#login_email', 'hazelyip@hotmail.com');
// 					await page.type('#login_password', 'TF2is1412%awesomesauce');
// 					await page.click('#login_button', {waitUntil: 'networkidle2'});

// 					console.log('logged in');

// 					for (var i = 0 ; i<voters.length ; i++){
// 						let voter = voters[i];
						
// 						if (poll !== voter.poll) {	//if poll is different, change poll

// 							poll = voter.poll;
// 							await page.goto(url + '/foot_canvasses/new', {waitUntil: 'networkidle2'});
// 							await page.type('.select2-search__field', poll); 
// 							await page.keyboard.press('Enter');	// press 'enter'
// 							await page.click('.footcanvass-submit', {waitUntil: 'networkidle2'});
// 							await page.waitForSelector('.foot-canvass-app');
// 							await page.waitFor(10000);

// 							console.log('navigation done~');
// 						}

// 						console.log('begin entering data')
// 						// find row with voter's sequence number. if unsuccessful, look for name
// 						let enterData = await page.evaluate( (voter) => {
// 							console.log('entering data for voter...');

// 							let voterEditted = false;
// 							let allVoters = document.querySelectorAll('div.person-row');
// 							for (var i = 0 ; i<allVoters.length ; i++) {
// 								thisVoter = allVoters[i];
// 								thisVoterName = thisVoter.querySelector('a').innerHTML;
// 								if (voter.name === thisVoterName){
// 									console.log('found voter');
// 									console.log(voter);
// 									thisVoter.querySelector('.pull-right').click();	// click to open form
// 									var qIndex;
// 									var ans;

// 									var value = "";

// 									// home/not home
// 									qIndex = voter.answers.map( function(x) {return x.questionID}).indexOf("5d40ccbce622cd24b43ac9d9");
// 									if ( voter.answers[qIndex].response !== null ) 
// 										ans = voter.answers[qIndex].response[0];
// 									else
// 										ans = null;
// 									if (ans === "5d632a04cd7c052baca8ca02"){ // ans = no
// 										console.log('voter not home');
// 										thisVoter.querySelector('.person-form').querySelector('a.pull-right').click();
// 										voterEditted = true;
// 									} else {

// 										console.log('voter is home');

// 										// support level 
// 										qIndex = voter.answers.map( function(x) {return x.questionID}).indexOf("5d8c071bddec2706194f61ec");
// 										if ( voter.answers[qIndex].response !== null ) {
// 											console.log('has support level');
// 											ans = voter.answers[qIndex].response[0];
// 											console.log('support: ' + ans);
// 											if (ans) {
// 												switch (ans) {
// 													case '5d8c071bddec2706194f61f1':
// 														value = "5";
// 														break;
// 													case '5d8c071bddec2706194f61f0':
// 														value = "4";
// 														break;
// 													case '5d8c071bddec2706194f61ef':
// 														value = "3";
// 														break;
// 													case '5d8c071bddec2706194f61ee':
// 														value = "2";
// 														break;
// 													case '5d8c071bddec2706194f61ed':
// 														value = "1";
// 														break;
// 												}
// 												if (value){
// 													thisVoter.querySelectorAll('select.form-control')[0].value = value;
// 													var event = new Event('change', { bubbles: true });
// 												    event.simulated=true;
// 													thisVoter.querySelectorAll('select.form-control')[0].dispatchEvent(event);
// 													voterEditted = true;
// 												}
// 											}
// 										} else {
// 											console.log('no support level indicated');
// 										}

// 										// sign
// 										qIndex = voter.answers.map( function(x) {return x.questionID}).indexOf("5d8c071bddec2706194f61f3");
// 										if ( voter.answers[qIndex].response !== null ) {
// 											console.log('has sign request :)');
// 											ans = voter.answers[qIndex].response[0];
// 											console.log(ans);
// 											if (ans) {
// 												thisVoter.querySelectorAll('a.btn')[3].click();
// 												var value;
// 												switch (ans) {
// 													case '5d8c071bddec2706194f61f6':
// 														value = "lawn";
// 														break;
// 													case '5d8c071bddec2706194f61f5':
// 														value = "window";
// 														break;
// 													case '5d8c071bddec2706194f61f4':
// 														value = "large";
// 														break;
// 												}
// 												if (value) {
// 													thisVoter.querySelectorAll("select.form-control")[2].value = value;
// 													voterEditted = true;
// 												}
// 											}
// 										} else {
// 											console.log('no sign request');
// 										}

// 										// Save deets!
// 										console.log('save');
// 										thisVoter.querySelector('span.pull-right').querySelector('a').click();

// 										if (!voterEditted)
// 											console.log('nothing changed for voter');

										
// 									}

// 									break;
// 								} // end when voter is found
									
// 							}
// 							voter.ifEditted = voterEditted;
// 							return voter;

// 						}, voter).then(voter => {
// 							 if (voter.ifEditted) {

// 								var voterInfo = {
// 									_id: voter._id,
// 									status: '3complete'
// 								}
								
// 								Voter.updateOne( {_id: voter._id }, voterInfo ).then( v => {
// 									console.log('voter ' + voter.name + ' updated');
// 								}).catch( error => {
// 									console.log('failed updating voter ' + voter.name + '\n' + error);
// 								})
// 							} else {

// 								var voterInfo = {
// 									_id: voter._id,
// 									needsManualEntry: true
// 								}
								
// 								Voter.updateOne( {_id: voter._id }, voterInfo ).then( v => {
// 									console.log('*** voter ' + voter.name + ' needs manual entry');
// 								}).catch( error => {
// 									console.log('failed updating voter ' + voter.name + '\n' + error);
// 								})
// 							}
// 						}).catch( error => {
// 							console.log('something went wrong :/');
// 							console.log(error);
// 							//res.status(500).json({ message: 'something went wrong when saving voter to Gvote...\n' + error });
// 						}) // end eval

						
// 					}

// 					//await page.screenshot({path: 'backend/images/screenshot.png'});
// 					await browser.close();
// 					res.status(200).json({ message: 'Data uploaded to GVote!' });
// 				})().catch( error => {
// 					res.status(500).json({ message: 'something went wrong when saving the poll\n' + error });
// 					console.log('something went wrong when updating info to gvote\n' + error);
// 				});
// 			} else { // end of if voters.length > 0
// 				console.log('no voters to update to gvote');
// 			}
// 		})
// 	} else {
// 		res.status(500).json({ message: 'This action can only be done in localhost' });
// 	}

// }

exports.getCurrentPolls = (req,res,next) => {

	console.log('getting current polls');

	Voter.distinct('poll').then( polls => {
		if ( polls ) {
			res.status(200).json(polls);
		} else
			res.status(200).json({ message: "no polls" });
	}).catch( error => {
		res.status(500).json({ message: 'fetching current polls failed' });
	})
}

exports.getAllVoters = (req,res,next) => {

	console.log("getting all voters");

	Voter.find().sort({ poll: 1, sequence: 1 }).then( voters => {
		res.status(200).json({
			message: "fetched all voters",
			voters: voters
		});
	}).catch( error => {
		res.status(500).json({ message: 'fetching all voters failed' });
	})
}

exports.getOneVoter = (req,res,next) => {

	console.log('getting one voter');

	Voter.findById(req.params.id).then( voter => {
		res.status(200).json({
			message: "fetched voter",
			voter: voter
		});
	}).catch( error => {
		res.status(500).json({ message: 'fetching voter failed' });
	})
}

// update voter when voter gets canvassed
exports.updateOneVoter = (req,res,next) => {

	console.log('updating one voter');

	let status;

	// Check if voter has any personal information to input or wants to volunteer.
	var volAns = "";
	var emailAns = "";
	var phoneAns = ""; 
	qIndex = req.body.answers.map( function(x) {return x.questionID}).indexOf("63198e2f4c211f1af52f392b");
	if ( req.body.answers[qIndex].response !== null )
		volAns = req.body.answers[qIndex].response[0];
	qIndex = req.body.answers.map( function(x) {return x.questionID}).indexOf("63198e4f4c211f1af52f392d");
	if ( req.body.answers[qIndex].response !== null )
		emailAns = req.body.answers[qIndex].response[0];
	qIndex = req.body.answers.map( function(x) {return x.questionID}).indexOf("63198e5e4c211f1af52f392e");
	if ( req.body.answers[qIndex].response !== null )
		phoneAns = req.body.answers[qIndex].response[0];

	if ( volAns === "oo" || emailAns || phoneAns ) {	// if any of these exist
		// updatedtogvote => true
		console.log('voter needs manual entry');
		var voterInfo = {
			_id: req.body.voter._id,
			answers: req.body.answers,
			canvassedDate: Date.now(),
			canvassedBy: req.body.canvassedBy,
			status: '2canvassed',
			needsManualEntry: true,
			support: req.body.voter.support
		}
	} else {
		var voterInfo = {
			_id: req.body.voter._id,
			answers: req.body.answers,
			canvassedDate: Date.now(),
			canvassedBy: req.body.canvassedBy,
			status: '2canvassed',
			needsManualEntry: false,
			support: req.body.voter.support
		}
	}

	Voter.updateOne( {_id: req.body.voter._id }, voterInfo ).then( voter => {

		/*var qIndex = req.body.answers.map( function(x) {return x.questionID}).indexOf("5d40ccbce622cd24b43ac9ec");
		var volAns = req.body.answers[qIndex].response;

		// if want to be volunteer
		if (volAns === "5d632a04cd7c052baca8ca11"){	
			qIndex = req.body.answers.map( function(x) {return x.questionID}).indexOf("5d632a04cd7c052baca8ca19");
			emailAns = req.body.answers[qIndex].response;
			if (emailAns) {
				var nameSplit = req.body.voter.name.split(' ');
				var fName = "";
				for ( var i = 0 ; i<nameSplit.length-1 ; i++ ){
					if ( i === 0 ) 
						fName = fName + nameSplit[i];
					else 
						fName = fName + " " + nameSplit[i];
				}
				var lName = nameSplit[nameSplit.length-1];

				console.log(fName);
				console.log(lName);

				var address = ""
				if( req.body.voter.aptNum)	
					address = address + req.body.voter.aptNum + "-"
				address = address + req.body.voter.houseNum + " " + req.body.voter.streetName;

				var newVolunteer = new Volunteer({
					firstName: fName,
					lastName: lName,
					email: emailAns,
					address: address
				});

				newVolunteer.save().then( data => {

					var intakeText = "Hello " + nameSplit[0] + "!\n\nThank you for signing up to be a volunteer for the Green Party of Canada and for Amita Kuttner's campaign!\n\nPlease reply to this email with how you would like to help out with the campaign. Currently, we need help canvassing, knocking on doors and spreading the Green Party message around your neighborhood. We also need people on the phone, and people in the office to help out with various activities. Or you can help out with whatever your are comfortable with :)  Every little bit helps and we are fortunate to have you on board.\n\nThanks again for offering your help!"
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
						to: emailAns,
						subject: 'Volunteering for Amita Kuttner',
						text: intakeText
					};
					let info = transporter.sendMail( mail, (error, info) => {
						if (error) 
							res.status(200).json({message: "could not send email", error: error});
						else
							res.status(200).json({message: "message sent!"});
					});
				}).catch(error => {
					console.log('did not save or send email\n' + error);
				})

					
			}
		}*/

		res.status(200).json({
			message: "updated voter",
			voter: voter
		});
	}).catch( error => {
		res.status(500).json({ message: 'updating voter failed' });
	})
}

exports.voterComplete = (req,res,next) => {

	console.log('complete voter');

	var voterInfo = {
		_id: req.body.voterId,
		needsManualEntry: false,
		status: '3complete'
	}

	Voter.updateOne( {_id: req.body.voterId }, voterInfo ).then( voter => {
		res.status(200).json({message: "voter updated to complete"});
	})
}

// find voters that have streetname
exports.findByStreet = (req,res,next) => {

	var street = req.params.street;
	console.log('finding voters by street: ' + street);

	var query;
	str = street.split(/ (.+)/);
	if (!isNaN(str[0])) {	//isNaN stands for 'Not a Number'
		houseNum = str[0];
		streetName = str[1];
		query = { houseNum: houseNum, streetName: new RegExp(streetName, "i") };
	} else {
		houseNum = "";
		streetName = street;
		query = { streetName: new RegExp(streetName, "i") };
	}
	console.log( `query: `, query );
	Voter.find( query ).sort( {city: 1, streetName: 1, houseNum: 1, aptNum: 1 }).then( voters => {
		res.status(200).json({
			message: "fetched selected voters",
			voters: voters
		});
	}).catch( error => {
		console.log(error);
		res.status(500).json({ message: 'fetching selected voters failed ' + error});
	})
}

exports.getAllAnswered = (req, res, next) => {

	console.log('getting answered');

	const pageSize = +req.query.pagesize;	// adding '+' converts these to numbers
	const currentPage = +req.query.page;
	var count = 0;

	//	code for easy way to change status of voters
	/*Voter.find({"canvassedDate" : { "$gte": new Date("2019-09-30T00:00:00.000Z") }}).then( data => {
		for ( var i = 0 ; i<data.length ; i++) {
			var info = {
				_id: data[i]._id,
				status: '2canvassed'
			}
			Voter.updateOne( {_id: data[i]._id }, info ).then( result => {
				count++;
				console.log('updated one. Updated so far: ' + count);
			}).catch( error => {
				console.log('failed to update');
			})
		}
	})*/
	
	voterQuery = Voter.find({ canvassedDate: {$exists:true} }).sort({ 'needsManualEntry': -1, 'status': 1 });
	if (pageSize && currentPage) {	//this block executes when both params are set
		voterQuery
			.skip(pageSize * (currentPage - 1))	// skips first n posts
			.limit(pageSize);	// limits amount of documents in return. since queried, its treated as text rather than numeric. limit only accepts numeric
	}

	let fetchedAnswers;
	let totalCount;
	let canvassedTodayCount;
	let needsManualCount;
	let completeCount;
	let responses = [];
	let questionIDs = [];
	const questionQuery = Question.find();

	voterQuery.then( voters => {

		fetchedAnswers = voters;
		return Voter.find({ canvassedDate: {$exists:true} }).countDocuments();

	}).then(count => {

		totalCount = count;
		return Voter.find({ status: '2canvassed' }).countDocuments();

	}).then(count => {

		canvassedTodayCount = count;
		return Voter.find({ needsManualEntry: true }).countDocuments();

	}).then(count => {

		needsManualCount = count;
		return Voter.find({ status: '3complete' }).countDocuments();

	}).then(count => {

		completeCount = count;

		Question.find().then( allQuestions => {
			for ( var i = 0 ; i < allQuestions.length ; i++ ){
				questionIDs.push(allQuestions[i]._id);
			}
			for ( var i = 0 ; i < fetchedAnswers.length ; i++ ) {
				for ( var j = 0 ; j < fetchedAnswers[i].answers.length ; j++ ) {
					var qIndex = allQuestions.map( function(x) {return x.id}).indexOf(fetchedAnswers[i].answers[j].questionID);
					var readableAnswer = {};
					if (fetchedAnswers[i].answers[j].response){
						responses = []
						if( allQuestions[qIndex].responseType === 'Text' ){
							responses = fetchedAnswers[i].answers[j].response
						} else {
							for ( var k = 0 ; k < fetchedAnswers[i].answers[j].response.length ; k++ ) {
								var resID = fetchedAnswers[i].answers[j].response[k];
								var rIndex = allQuestions[qIndex].responses.map( function(x) {return x.id}).indexOf(resID);
								var resString = allQuestions[qIndex].responses[rIndex].response
								responses.push(resString);
							}
						}
						readableAnswer = {
							id: fetchedAnswers[i].answers[j].questionID,
							question: allQuestions[qIndex].question,
							response: responses
						}
					} else {
						readableAnswer = {
							id: fetchedAnswers[i].answers[j].questionID,
							question: allQuestions[qIndex].question,
							response: null
						}
					}
					fetchedAnswers[i].answers[j] = readableAnswer;
				}
			}
			res.status(200).json({
				voters: fetchedAnswers,
				totalCount: totalCount,
				canvassedTodayCount: canvassedTodayCount,
				manualCount: needsManualCount,
				completeCount: completeCount,
				message: "answered voters fetched successfullyyy!"
			})
		}).catch( error => {
			res.status(500).json({ message: "Fetching voters failed", error: error });
		})



		//res.status(200).json({message: "get answered voters"});
	}).catch( error => {
		console.log(error);
		res.status(500).json({ message: 'fetching answered voters failed\nError: ' + error});
	})
}

exports.deletePoll = (req,res,next) => {

	console.log('deleting poll# ' + req.params.poll);

	Voter.deleteMany({ poll: req.params.poll }).then( result => {
		if ( result.n > 0 )
			res.status(200).json({message: "deletion success"});
		else
			res.status(500).json({message: "no matching polls"});
	}).catch( error => {
		res.status(500).json({message: "Poll deletion failed", error: error});
	})
}

exports.deleteVoter = (req,res,next) => {

	console.log('deleting voter ' + req.params.voter);

	Voter.deleteOne({ _id: req.params.voter }).then( result => {
		if ( result.n > 0 )
			res.status(200).json({message: "deletion success"});
		else
			res.status(500).json({message: "no matching voter"});
	}).catch( error => {
		res.status(500).json({message: "Voter deletion failed", error: error});
	});
}