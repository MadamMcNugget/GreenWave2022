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

	count = 0;
	let numberOfQuestions = 0;

	const surveyQuery = Survey.find().limit(1).sort({$natural:-1});
	surveyQuery.then( surveyData => {
		survey = surveyData[0];
		for ( let i = 0 ; i < survey.section.length ; i++ ){
			for ( let j = 0 ; j < survey.section[i].questions.length ; j++ ) {
				numberOfQuestions++;
			}
		}
		for ( let i = 0 ; i < survey.section.length ; i++ ){
			for ( let j = 0 ; j < survey.section[i].questions.length ; j++ ) {
				questionID = survey.section[i].questions[j];
				Question.findById(questionID).then(question => {
					surveyData[0].section[i].questions[j] = question;
				}).then( () => {
					count++
					if (count === numberOfQuestions) {
						res.status(200).json({
							message: "fetched survey",
							survey: surveyData	// if dont return array, .map in service wont work :/
						})
					}

				})
			}
		}

	}).catch( error => {
		res.status(500).json({ message: "failed to fetch survey(s)" });
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
