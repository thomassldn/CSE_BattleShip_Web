//File: app.js
//Date: 15 March 2021
//Author(s): Alexis Nieto, Thomas S
//Desc: controller.js
//


//Modules
var bodyParser = require('body-parser'); //used to parse user input
var urlencodedParser = bodyParser.urlencoded({extended: false});//used to parse user input
const {check, validationResult } = require('express-validator');//used to validate user input, will implement later


//Custom Modules
var firestoreData = require("../models/storeData.js"); //Model Used For FireStore Real-Time Database Credentials and Functions

//Declaration of Variables
var  coor = '00';
let coordinate = '00';
let returnCoordinate  = "";
var randomSequ = "";
var game;

module.exports = function(app){

  app.use(bodyParser.json());
  app.use(urlencodedParser);

  app.get('/', function(req, res){

    res.render('index'); //render ./views/index.ejs

  });

 app.get('/start_page', function(req, res){

   //Create random sequence - A9X23
   randomSequ = Math.random().toString(36).substring(7);
   console.log("2) New game room created: http://localhost:8080/gameboard/" + randomSequ);

   game = {game_id: randomSequ};

   res.render('start', game); //send user views/start.js file

 });

  //Start of Application
  app.get('/gameboard/:room_id', function(request, response){

    /*
     if(request.params.id == "*_2"){
       player = 1;
     } else {
       player 2;
     }
     */
     console.log("3) ./views/gameboard.ejs sent to user");
     response.render('gameboard.ejs', {game_id:request.params.room_id})


    });

    app.post('/gameboard/:room_id', function(request, response){

      //console.log("GAME: ", request.params.room_id);

      //1) Receive  coordinate from front end
      let hit = false;
      let id = request.body.id;
      //let game_room = request.body.game_id;

      console.log("5) Coordinate received from front end:", request.body.id);
      //console.log("New game started: ", game_id);

      //console.log("C)
      //check firebase to see if id hit
      if(!hit){
        //hit = true;
        //2) Sending coordinate to Firestore
        console.log("6) Sending coordinate to Firestore database: ", request.body.id);

        hit = firestoreData.sendDataToFirestore(request.body.id, request.params.room_id);
        //console.log("5) Sending coordinate to front-end: ", firestoreData.receiveDataFromFirestore;
      }

      //Send the real-time coordinate that was just received from firestore to the  front-end
      coordinate = firestoreData.getDataFromFirestore();
      console.log("5) Received coordinate from  back end", coordinate);
      response.send({hit: hit, coor:coordinate});

    });
/*

  app.post('/gameboard', function(request, response){

    //1) Receive  coordinate from front end
    let hit = false;
    let id = request.body.id;
    //let game_room = request.body.game_id;
    console.log("1) Coordinate received from front end:", request.body.id);
    //console.log("New game started: ", game_id);

    //console.log("C)
    //check firebase to see if id hit
    if(!hit){
      //hit = true;
      //2) Sending coordinate to Firestore
      console.log("2) Sending coordinate to Firestore")
      console.log("game_id: ", game);
      hit = firestoreData.sendDataToFirestore(request.body.id, game);
      //console.log("5) Sending coordinate to front-end: ", firestoreData.receiveDataFromFirestore;
    }

    //Send the real-time coordinate that was just received from firestore to the  front-end
    coordinate = firestoreData.getDataFromFirestore();
    console.log("5) Received coordinate from  back end", coordinate);
    response.send({hit: hit, coor:coordinate});

  });

*/




/*
  app.get('/api-endpoint', function(request, response){
   response.send({endpoint:'I am a really shitty unsecure api endpoint that returns data'});
  })
*/


};
