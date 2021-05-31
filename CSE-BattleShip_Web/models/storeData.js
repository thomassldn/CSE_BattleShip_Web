//Import firebase module
const admin = require('firebase-admin');

//Key that allows our application to talk to FireStore - Keep this safe
const serviceAccount = require('../config/cse17b-battleship-firebase-adminsdk-o6lta-1f026ed645.json');
var coordinate = "00";
var dataObj =  {
    Player1:{coordinate:"000"},
    Player2:{coordinate:"00"}
  };


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

//let docRef = db.collection('BattleShip').doc('Player1');

//FUNCTION sendDataToFirestore()
var sendDataToFirestore = function (coordinate, game_room){



  console.log("GAMEEEEE:", game_room.slice(0,-2));

  if( game_room.slice(-1) == 2){ //determine if player 1 is storing this coordinate or player 2
    console.log("This is player 2");
    game_room = game_room.slice(0,-2);
    //Create an object to hold clients information
    dataObj.Player2.coordinate = coordinate;

  } else { //Player 1
    console.log("This is player 1");
    //Create an object to hold clients information
    dataObj.Player1.coordinate = coordinate;


  }
  console.log("GameROOOOM: ", game_room);



   // Add a new map field in collection "BattleShip", document "coordinates"
   let docRef = db.collection('BattleShip').doc('GamesRoom_' + game_room);//{ Player1:{coordiante:"09"}, Player2:{coordinate:"01"} }
   let checkInClient = docRef.set(dataObj, {merge: true})
   .then(function() {
       console.log("4) Coordinate stored in Firestore database!");

   })
   .catch(function(error) {
       console.error("4) Error!!! Could not send coordinate to database: ", error);
   });



  return true;
}//END sendDataToFirestore()

//Before sending response, read data from firestore in real time and send it to the front end
//Read client data from FireStore in real time
const doc = db.collection("BattleShip").doc("GameRoom_3pkdk")
const observer = doc.onSnapshot(docSnapshot => {
  //console.log(`4) Received real-time coordinate from Firestore: ${docSnapshot.coordinate}`);
  coordinate = docSnapshot._fieldsProto.coordinate.stringValue;

  console.log("4) Received real-time coordinate from Firestore:", coordinate);//JSON.stringify(docSnapshot)

}, err => {
  console.log(`Encountered error: ${err}`);
});
//End real-time listener

//FUNCTION sendDataToFirestore()
var getDataFromFirestore = function(){

  return coordinate;

}//END



//export module
module.exports.sendDataToFirestore = sendDataToFirestore;
module.exports.getDataFromFirestore = getDataFromFirestore;
