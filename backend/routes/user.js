const express = require("express");

const UserController = require('../controllers/user');

const router = express.Router();

//create user
router.post("/signup", UserController.createUser);

// login
// Unlike traditional full-stack application, SPA uses json web tokens rather than cookies with session IDs on the server side
// this is because apis in SPAs are stateless -> it doesnt connect to front-end app. front-end and back-end are 2 different servers
// server doesnt store any information about the app, so server can't store any sessions
// Therefore, we create a JSON Web Token. upon successful login, a token is generated and sent back to the browser, 
// which can then be stored in angular app, cookie, or local storage
// Token is then attached to all future requrests as part of the URL or as header
// token is heavily hashed, apparently impossible to unhash, cant be faked or guessed. 
// only requests with valid token are allowed access. can learn more about json web tokens @ jwt.io
router.post("/login", UserController.userLogin);

router.get("/view", UserController.viewUsers);

router.put("/:id", UserController.editUser);

module.exports = router;