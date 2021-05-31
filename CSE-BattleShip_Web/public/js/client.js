let locators = document.querySelectorAll('.locator');
let computerBoard = document.getElementById('computerboard');
//let userBoard = document.getElementById('userboard');
if(locators !== null){
    for(const locator of locators){
        locator.addEventListener('click', function(e){

            e.preventDefault(); //prevent regular form behavior
            //let coords = e.target.value.replace(/\s/, '');
            let coords = e.target.dataset.id;

            let computerCoords = Number(coords) + 100;


            console.log("4) Coordinate sent to back-end: ", coords);

          //  console.log("ROOM", game_room );
            //send to firebase and handle response
            let postRoute = '/gameboard/'+ game_room;
            fetch(postRoute, {

                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id:coords})

            }).then(function(response) {

                return response.json();

            }).then(function(data) {

                let hit = data.hasOwnProperty('hit') && data.hit ? true : false
                let coordinate = data.coor;
                console.log("Coordinate received from firestore: ", coordinate);

                if(hit){
                    //console.log("HIT IS: ", hit);

                    //console.log("Locator Value: ", locator.value );

                    locator.value = 'X'

                    //locator.value = "Y"

                    for(const locator of computerBoard.querySelectorAll('.locator')){
                        if(Number(locator.dataset.id) == computerCoords) {
                            locator.classList.add('hit');
                            locator.value = 'X';
                        }
                    }
                    //console.log(computerBoard[index])

                } else {

                    locator.classList.add('miss');
                    locator.value = 'miss'

                }







            });
        })
      }
}
