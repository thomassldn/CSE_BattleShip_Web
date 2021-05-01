
let locators = document.querySelectorAll('.locator');
if(locators !== null){
    for(const locator of locators){
        locator.addEventListener('click', function(e){
            e.preventDefault(); //prevent regular form behavior
            //let coords = e.target.value.replace(/\s/, '');
            let coords = e.target.dataset.id;
            console.log("Coordinate send to back-end: ", coords);
            //send to firebase and handle response
            fetch('/gameboard', {
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
                    locator.classList.add('hit');
                    locator.value = 'X'
                } else {

                    locator.classList.add('miss');
                    locator.value = 'miss'
                    
                }
            });
        })
      }
}
