const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const VoterController = require('../controllers/voters');

router.get("", checkAuth, VoterController.getAllVoters);

// router.get("/:id", checkAuth, VoterController.getOneVolunteer);

router.post("", checkAuth, VoterController.createVoter );

// router.put("/:id", checkAuth, VoterController.editVolunteer );

// router.delete("/:id", checkAuth, VoterController.deleteVolunteer );


module.exports = router;