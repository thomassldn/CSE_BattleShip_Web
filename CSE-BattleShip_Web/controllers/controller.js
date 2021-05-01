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

//Declaration of Variables
var first_name = "";
var last_name = "";
var user = "User10";
var  coor = '00';
let coordinate = '00';
/*===================================================
 FireStore Real-Time Database Credentials and Functions
 ===================================================*/

//Import firebase module
const admin = require('firebase-admin');

//Key that allows our application to talk to FireStore - Keep this safe
const serviceAccount = require('./cse17b-battleship-firebase-adminsdk-o6lta-1f026ed645.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let docRef = db.collection('BattleShip').doc('Player1');

//This function sends the data to firestore
function sendDataToFireStore(coordinate){



       //Create an object to hold clients information
       var dataObj = {coordinate: coordinate};
       /*
       dataObj[user] = {
         coordinate: coordinate
       };
       */
        // Add a new map field in collection "BattleShip", document "coordinates"
        let checkInClient = docRef.set(dataObj, {merge: true})
        .then(function() {
            console.log("4) Coordinate stored in Firestore database!");

        })
        .catch(function(error) {
            console.error("4) Error!!! Could not send coordinate to database: ", error);
        });



        return true;
}//End() function sendDataToFireStore()




/*===================================================
 END() FireStore Real-Time Database Credentials and Functions
 ===================================================*/

module.exports = function(app){

  app.use(bodyParser.json());
  app.use(urlencodedParser);

  app.get('/', function(req, res){
    res.render('index'); //render ./views/index.ejs

  });

  //get the users first and last name
  app.post('/sign-in', urlencodedParser,function(request, response){
    //validate user input - to be continued


    //Get the first name and last name from the post request and assign it to variables first_name and last_name
    first_name = request.body.fname;
    last_name = request.body.lname;

    response.render('index.ejs'); //render ./views/index.ejs

    //Output data received from front-end to the console
    console.log("1) User signed-in: ", request.body.fname, request.body.lname);

    //Pass name to sendDataToFireStore() function above which will store it in the firestore real-time database
    sendDataToFireStore(request.body.fname, request.body.lname);

  });

  //Start of Application
  app.get('/gameboard', function(request, response){




      //reponse.render('A34J');
      response.render('gameboard.ejs');


    });
/*
  app.post('/coordinate', (request, response) => {
    console.log("TEST",request.body.coordinate);

  })
*/
  app.post('/gameboard', function(request, response){
    //1) Receive  coordinate from front end
    let hit = false;
    let id = request.body.id;
    console.log("1) Coordinate received from front end:", request.body.id);

    //console.log("C)
    //check firebase to see if id hit
    if(!hit){
      //hit = true;
      //2) Sending coordinate to Firestore
      console.log("2) Sending coordinate to Firestore")
      hit = sendDataToFireStore(request.body.id);
      console.log("5) Sending coordinate to front-end: ", coordinate);
    }

    //Before sending response, read data from firestore in real time and send it to the front end
    //Read client data from FireStore in real time
    const doc = db.collection("BattleShip").doc("Player1")
    const observer = doc.onSnapshot(docSnapshot => {
      //console.log(`4) Received real-time coordinate from Firestore: ${docSnapshot.coordinate}`);
      coordinate = docSnapshot._fieldsProto.coordinate.stringValue;

      console.log("4) Received real-time coordinate from Firestore:", coordinate);//JSON.stringify(docSnapshot)
    }, err => {
      console.log(`Encountered error: ${err}`);
    });

    response.send({hit: hit, coor:coordinate});
  });

  app.get('/api-endpoint', function(request, response){
   response.send({endpoint:'I am a really shitty unsecure api endpoint that returns data'});
  })



};
