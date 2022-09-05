const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const SurveysController = require('../controllers/surveys');

                    // vv  multer will extract a single file from incoming request
router.post("", checkAuth, SurveysController.submitNewSurvey);

//router.put("/:id", /*checkAuth,*/ extractFile, PostsController.updatePost );

// since server is waiting for a response, .send ( or res.anything ) implicitly ends this request
// example response: 
// - res.send('i\'m a post!'); 
// - res.json();
router.get("", checkAuth, SurveysController.getSurveys );

router.get("/newest", checkAuth, SurveysController.getNewestSurvey );

router.get("/question/:id", checkAuth, SurveysController.getQuestion );

module.exports = router;