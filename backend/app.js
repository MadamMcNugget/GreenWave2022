const path = require("path");	// pathing shipped with nodeJS. construct path thats safe to run on any OS
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');	

//const postsRoutes = require("./routes/posts");	// any http requests for posts is here
const userRoutes = require("./routes/user");
const surveysRoutes = require("./routes/surveys");
const pollsRoutes = require("./routes/polls");
const volunteersRoutes = require("./routes/volunteers");
const app = express();

//mongoose.connect("mongodb://daza:" + process.env.MONGO_ATLAS_PW + "@ac-4im0bdv-shard-00-00.dzhrvu7.mongodb.net:27017,ac-4im0bdv-shard-00-01.dzhrvu7.mongodb.net:27017,ac-4im0bdv-shard-00-02.dzhrvu7.mongodb.net:27017/?ssl=true&replicaSet=atlas-vm7zgt-shard-0&authSource=admin&retryWrites=true&w=majority" )
mongoose.connect("mongodb+srv://daza:" + process.env.MONGO_ATLAS_PW + "@cluster0.dzhrvu7.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true })
	.then( () => {
		console.log("Connected to database!");
	})
	.catch( () => {
		console.log("Connection to database failed.");
	});

app.use(ignoreFavicon);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); // supports only default features in the url encoding
app.use("/images", express.static(path.join("backend/images")));	// any requests to this folder will be allowed to continue and fetch their files from here. requests to images forwared to backend/images

app.use( (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');		// sets which domains are allowed to access our resources. here, app may sent request to all domains and they can access our resources
	res.setHeader('Access-control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');	// sets what headers the domain can request along with default headers. request may have these extra headers
	res.setHeader('Access-control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS");	//Allows which http requests may be sent. OPTIONS checks if post request is valid.
	next();
})


function ignoreFavicon(req, res, next) {  // browser will try to make a second request to find a favicon.ico, executing middleware twice. this function to is ignore that 2nd request
  if (req.originalUrl === '/favicon.ico') {	// check https://stackoverflow.com/questions/35408729/express-js-prevent-get-favicon-ico/35408810#35408810
    res.status(204).json({nope: true});		// note response code 204 returns no body
  } else {
    next();
  }
}

//app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/surveys", surveysRoutes);
app.use("/api/polls", pollsRoutes);
app.use("/api/volunteers", volunteersRoutes);

module.exports = app;