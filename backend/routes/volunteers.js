const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const VolunteersController = require('../controllers/volunteers');

router.get("", checkAuth, VolunteersController.getAllVolunteers);

router.get("/:id", checkAuth, VolunteersController.getOneVolunteer);

router.post("", checkAuth, VolunteersController.addVolunteer );

router.put("/:id", checkAuth, VolunteersController.editVolunteer );

router.delete("/:id", checkAuth, VolunteersController.deleteVolunteer );

// router.post("/sendmail", checkAuth, VolunteersController.sendMail );

module.exports = router;