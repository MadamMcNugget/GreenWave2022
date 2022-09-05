const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const PollsController = require('../controllers/polls');

// router.post("", checkAuth, PollsController.scrapePoll );

// router.post("/updateToGVote", checkAuth, PollsController.updateToGVote)

router.get("/current", checkAuth, PollsController.getCurrentPolls );

router.get("/voters/all", checkAuth, PollsController.getAllVoters );

router.get("/voters/findbystreet/:street", checkAuth, PollsController.findByStreet );

router.get("/voters/answered", checkAuth, PollsController.getAllAnswered );

router.get("/voter/:id", checkAuth, PollsController.getOneVoter );

router.put("/voter", checkAuth, PollsController.updateOneVoter );

router.put("/voter/complete", checkAuth, PollsController.voterComplete );

router.delete("/poll/:poll", checkAuth, PollsController.deletePoll );

module.exports = router;