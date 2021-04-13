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
var user = "User1";

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

let docRef = db.collection('BattleShip').doc('coordinates');

//This function sends the data to firestore
function sendDataToFireStore(coordinate){

 //Create an object to hold clients information
 var dataObj = {};
 dataObj[user] = {
   fname: coordinate
 };

  // Add a new map field in collection "BattleShip", document "coordinates"
  let checkInClient = docRef.set(dataObj, {merge: true})
  .then(function() {
      console.log("2) New sing-in stored in  firestore database!");
  })
  .catch(function(error) {
      console.error("2) Error!!! Could not send user info to database: ", error);
  });

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


  app.get('/gameboard', function(request, response){
      response.render('gameboard.ejs');

    });


};
