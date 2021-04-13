//File: app.js
//Date: 15 March 2021
//Author(s): Alexis Nieto, Thomas S
//Desc: Start of BattleShip Web application
//

var express = require('express');
var app = express();
var simpleFormController = require('./controllers/controller'); // this is the controller.js file in the controller folder

//Template engine
app.set('view engine', 'ejs');

//Serve static files
app.use(express.static('./public'));

//Fire controllers
simpleFormController(app);// pass app

app.listen(3000);

console.log("Now listening on http://localhost:3000/ ... ")
