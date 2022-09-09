//const Post = require('../models/post');	//mongoose
const Question = require('../models/question');
const Survey = require('../models/survey');
const SurveyAnswer = require('../models/surveyAnswer');

exports.submitNewSurvey = (req, res, next) => {
	const survey = req.body;
	const newSurvey = new Survey({
		dateOfCreation: Date.now(),
		edittedBy: "the boss",
		section: []
	});
	let section;
	let question;

	for ( var i = 0 ; i < survey.section.length ; i ++){
		section = {
			title: survey.section[i].title,
			questions: []
		};
		for ( var j = 0 ; j < survey.section[i].questions.length ; j++) {
			if (survey.section[i].questions[j].id === null) {	// new question
				question = new Question(survey.section[i].questions[j]);
				section.questions.push(question._id);
				question.save().then( createdQuestion => {
				});
			} else {	// updating old question
				question = new Question({
					_id: survey.section[i].questions[j].id,
					question: survey.section[i].questions[j].question,
					responseType: survey.section[i].questions[j].responseType,
					responses: survey.section[i].questions[j].responses,
					gotoEnabled: survey.section[i].questions[j].gotoEnabled,
					edittable: survey.section[i].questions[j].edittable
				});
				section.questions.push(question._id);
				Question.updateOne( {_id: survey.section[i].questions[j].id}, question).then(result => {		// must meet both conditions before proceeds
					if (result.n > 0) {	// if updated
						res.status(200).json({message: 'Update success!'});
					} else {
						res.status(401).json({message: 'Not Authorized'});
					}
					
				}).catch( error => {
					res.status(500).json({ message: 'error in updating question ' + error});
				})
			}
		}
		newSurvey.section.push(section);
	}

	newSurvey.save().then( savedSurvey => {
		res.status(201).json({
			message: "saved a survey!",
			survey: {
				...savedSurvey,
				id: savedSurvey._id
			}
		});
	}).catch( error =>{
		res.status(500).json({
			message: 'did not save survey'
		})
	});
}

exports.getSurveys = (req,res,next) => {

	const surveyQuery = Survey.find();
	surveyQuery.then( documents => {
		res.status(200).json({
			message: "fetched survey(s)",
			surveys: documents
		})
	}).catch( error => {
		res.status(500).json({ mssage: "failed to fetch survey(s)" });
	});
}

exports.getNewestSurvey = (req,res,next) => {

	console.log( 'getting newest survey' );

	count = 0;
	let numberOfQuestions = 0;
	let survey = [];

	const surveyQuery = Survey.find().limit(1).sort({$natural:-1});
	surveyQuery.then( surveyData => {
		console.log( 'grabbed something');
		survey = [{
			id: surveyData[0]._id.toString(),
			dateOfCreation: surveyData[0].dateOfCreation,
			edittedBy: surveyData[0].edittedBy,
			section: []
		}]
		for ( let i = 0 ; i < surveyData[0].section.length ; i++ ){
			let newSect = {
				title: surveyData[0].section[i].title,
				id: surveyData[0].section[i]._id.toString(),
				questions: []
			}
			survey[0].section.push(newSect);
			for ( let j = 0 ; j < surveyData[0].section[i].questions.length ; j++ ) {
				numberOfQuestions++;
				let newQ = {
					question: 'placeholder'
				}
				survey[0].section[i].questions.push( newQ );
			}
		}
		for ( let i = 0 ; i < surveyData[0].section.length ; i++ ){
			for ( let j = 0 ; j < surveyData[0].section[i].questions.length ; j++ ) {
				let questionID = surveyData[0].section[i].questions[j];
				Question.findById(questionID).then(question => {
					let quest = {
						id: question._id.toString(),
						question: question.question,
						responseType: question.responseType,
						responses: question.responses,
						gotoEnabled: question.gotoEnabled,
						edittable: question.edittable
					}
					console.log( question.responses );
					// console.log( quest )
					survey[0].section[i].questions[j] = quest;
					// survey.section[i].questions[j] = quest;
				}).then( () => {
					count++
					if (count === numberOfQuestions) {
						res.status(200).json({
							message: "fetched survey",
							survey: survey	// if dont return array, .map in service wont work :/
						})
					}

				})
			}
		}

	}).catch( error => {
		console.log( "didn\'t grab anything" );
		res.status(200).json({ 
			message: "failed to fetch survey(s)",
			survey: [defaultQuestions] // if dont return array, .map in service wont work :/
		});
	});
}

exports.getQuestion = (req,res,next) => {

	Question.findById(req.params.id).then(question => {
		if (question){	//is post exists
			res.status(200).json(question);
		} else {
			res.status(200).json({message: 'Post not found!'});
		}		
	})
	.catch( error => {
		res.status(500).json({ message: "Fetching post failed"});
	});
}

defaultQuestions = {
		"_id": "AAA",
		"edittedBy": "default",
    "section": [
      {
        "_id": "1",
        "title": "Are they a Supporter?",
				"step": 1,
        "questions": [
          { 
            "_id": "a",
            "question": "Is the resident home?", 
            "responseType": "Multiple Choice", 
            "responses": [
              { "_id": "aa", "response": "Yes", "goto": "none" },
              { "_id": "bb", "response": "No", "goto": "end" }
            ], 
            "gotoEnabled": true,
            "edittable": false 
          },
          { 
            "_id": "b",
            "question": "Support Level", 
            "responseType": "Multiple Choice", 
            "responses": [
              { "_id": "cc", "response": "Strong Green", "goto": "none" },
              { "_id": "dd", "response": "Weak Green", "goto": "none" },
              { "_id": "ff", "response": "Undecided", "goto": "none" },
              { "_id": "gg", "response": "Weak Opposition", "goto": "none" },
              { "_id": "hh", "response": "Strong Opposition", "goto": "none" }
            ], 
            "gotoEnabled": false,
            "edittable": false 
          },
          { 
            "_id": "c",
            "question": "Favourite food?", 
            "responseType": "Checkbox", 
            "responses": [
              { "_id": "ii", "response": "sushi", "goto": "none" },
              { "_id": "jj", "response": "curry", "goto": "none" },
              { "_id": "kk", "response": "pasta", "goto": "none" }
            ], 
            "gotoEnabled": false,
            "edittable": true  
          }
        ]
      },
      {
        "_id": "2",
        "title": "Are they willing to help",
				"step": 2,
        "questions": [
          { 
            "_id": "d",
            "question": "Sign Request", 
            "responseType": "Checkbox", 
            "responses": [
              { "_id": "ll", "response": "Lawn", "goto": "none" },
              { "_id": "mm", "response": "Window", "goto": "none" },
              { "_id": "nn", "response": "Large", "goto": "none"}
            ], 
            "gotoEnabled": false,
            "edittable": false  
          },
          { 
            "_id": "e",
            "question": "Donation Pledge", 
            "responseType": "Text", 
            "responses": [], 
            "gotoEnabled": false,
            "edittable": false  
          },
          { 
            "_id": "f",
            "question": "Do they want to help volunteer?", 
            "responseType": "Multiple Choice", 
            "responses": [
              { "_id": "oo", "response": "Yes", "goto": "none" },
              { "_id": "pp", "response": "No", "goto": "3 1" }
            ], 
            "gotoEnabled": true,
            "edittable": false 
          },
          { 
            "_id": "g",
            "question": "Volunteer role", 
            "responseType": "Checkbox", 
            "responses": [
              { "_id": "qq", "response": "Foot Canvass", "goto": "none" },
              { "_id": "rr", "response": "Phone Canvass", "goto": "none" },
              { "_id": "ss", "response": "Photography", "goto": "none"}
            ],
            "gotoEnabled": false,
            "edittable": false  
          }
        ]
      },
      {
        "_id": "3",
        "title": "Getting Contact Info",
				"step": 3,
        "questions": [
          { 
            "_id": "h",
            "question": "Email", 
            "responseType": "Text", 
            "responses": [], 
            "gotoEnabled": false,
            "edittable": false  
          },
          { 
            "_id": "i",
            "question": "Phone Number", 
            "responseType": "Text", 
            "responses": [], 
            "gotoEnabled": false,
            "edittable": false  
          },
          { 
            "_id": "j",
            "question": "Candidate Follow Up", 
            "responseType": "Text", 
            "responses": [], 
            "gotoEnabled": false,
            "edittable": false  
          }
        ]
      }
    ]
  }