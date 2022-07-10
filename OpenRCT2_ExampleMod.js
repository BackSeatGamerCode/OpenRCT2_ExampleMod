var REWARDS = {
    "difficultGuestGeneration": function(name, reward, command){ temporaryFlagToggle("difficultGuestGeneration", 5, reward); },
    "difficultParkRating":      function(name, reward, command){ temporaryFlagToggle("difficultParkRating", 5, reward); },
    "forbidHighConstruction":   function(name, reward, command){ temporaryFlagToggle("forbidHighConstruction", 5, reward); },
    "forbidLandscapeChanges":   function(name, reward, command){ temporaryFlagToggle("forbidLandscapeChanges", 5, reward); },
    "forbidMarketingCampaigns": function(name, reward, command){ temporaryFlagToggle("forbidMarketingCampaigns", 5, reward); },
    "forbidTreeRemoval":        function(name, reward, command){ temporaryFlagToggle("forbidTreeRemoval", 5, reward); },
    "freeParkEntry":            function(name, reward, command){ temporaryFlagToggle("freeParkEntry", 1, reward); },
    "noMoney":                  function(name, reward, command){ temporaryFlagToggle("noMoney", 1, reward); },
    "open":                     function(name, reward, command){ temporaryFlagToggle("open", 1, reward); },
    "renameRandomRide":         function(name, reward, command){ renameRandomRide(name); },
    "maxBankLoan":              function(name, reward, command){ park.bankLoan = park.maxBankLoan; },
    "halfRating":               function(name, reward, command){ park.rating = Math.floor(park.rating / 2); },
    "loan1000":                 function(name, reward, command){ park.bankLoan += 10000; },
    "renamePark":               function(name, reward, command){ park.name = name; },
    "crash":                    function(name, reward, command){ crashRandomCar() },
    "creeper":                  function(name, reward, command){ creeper() },
    "sploosh":                  function(name, reward, command){ sploosh() }
}

function cartesianProduct(arr1, arr2){
   var res = [];
   for(var i = 0; i < arr1.length; i++){
      for(var j = 0; j < arr2.length; j++){
         res.push(
            [arr1[i]].concat(arr2[j])
         );
      };
   };
   return res;
}

function moveCamera(x, y){
    var position = ui.mainViewport.getCentrePosition();
    position.x = x;
    position.y = y;

    ui.mainViewport.scrollTo(position);
}

function isValidPeep(peep){
    return peep.isInPark && peep.x > 0 && peep.y > 0;
}

function floodTile(tile){
    for (var i = tile.elements.length - 1; i >= 0; i--) {
        var element = tile.elements[i];
        if(element.type == 'surface'){
            if(element.waterHeight > element.baseZ){
                continue;
            }
            element.waterHeight = element.baseZ;
            element.baseHeight -= 2;
            element.baseZ -= 16;
            element.clearanceHeight -= 2;
            element.clearanceZ -= 16;
        } else {
            tile.removeElement(i)
        }
    }
    return true;
}

function randint(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffle(array) {
  return array.sort(function(){ return Math.random() - 0.5});
}

function getTileLocations(xSize, ySize){
    var result = [];
    for (var x = xSize; x >= 1; x--) {
        for (var y = ySize; y >= 1; y--) {
            result.push([x, y])
        }
    }
    return result;
}

function sploosh(){
    var deleteInterval = 10;
    var duration = map.size.x * map.size.y * deleteInterval / 1000 / 60;

    var locations = shuffle(getTileLocations(map.size.x, map.size.y));
    
    postMessage("Estimated Time To Complete: " + duration + "m");

    var interval = context.setInterval(function () {
        var pos = locations[0];
        locations.shift();

        var tile = map.getTile(pos[0], pos[1]);
        floodTile(tile);

        if(locations.length == 0){
            context.clearInterval(interval);
            postMessage("sploosh");
        }

    }, deleteInterval);
    
}

function locateRandom(objects){
    var obj = objects[Math.floor(Math.random() * objects.length)];

    moveCamera(obj.x, obj.y);

    return obj;
}

function locateRandomEntity(type, filter){
    var entities = map.getAllEntities(type);
    entities = entities.filter(filter)

    if (entities.length > 0){
        var entity = entities[Math.floor(Math.random() * entities.length)];

        var position = ui.mainViewport.getCentrePosition();
        position.x = entity.x;
        position.y = entity.y;

        ui.mainViewport.scrollTo(position);

        return entity;
    }
    return null;
}

function creeper(){   
    var peep = locateRandomEntity("guest", isValidPeep);

    if(peep != null){
        context.setTimeout(function () {
            map.createEntity("explosion_cloud", {
                x: peep.x,
                y: peep.y,
                z: peep.z + 10
            });
            peep.remove();
        }, 1000);
    }
}

function crashRandomCar() {
    function isValidCar(car){
        return true;
    }

    var car = locateRandomEntity("car", isValidCar);

    if (car != null){
        context.setTimeout(function () {
            for (var i = 0; i < 5; i++) {
                context.setTimeout(function () {
                    map.createEntity("explosion_cloud", {
                        x: car.x,
                        y: car.y,
                        z: car.z,
                    });
                }, i * 100);
            }
            car.status = "crashing";
        }, 1000);
    }
}

function renameRandomRide(user) {
    if (map.rides.length > 0){
        map.rides[Math.floor(Math.random() * map.rides.length)].name = user;
    }
}

function temporaryFlagToggle(flag, duration, reward){
    park.setFlag(flag, !park.getFlag(flag));

    context.setTimeout(function () {
        park.setFlag(flag, !park.getFlag(flag));
        postMessage(reward + " has been disabled");
    }, duration * 1000 * 60)
}

function postMessage(message){
    try {
        park.postMessage({
            type: "award",
            text: message
        });
    } catch (error) {
        console.log(error);
    }
}

function main() {
    postMessage("BackSeatGamer Initialized...");

    var server = network.createListener();
    server.on('connection', function (conn) {
        conn.on('data', function(data) {
            conn.write("done");

            data = JSON.parse(data);

            var command = data["command"];
            var reward = data["name"];
            var user = data["guest"];

            if(REWARDS.hasOwnProperty(command)){
                postMessage(user + " has redeemed the reward " + reward);
                REWARDS[command](user, reward, command);

            } else {
                postMessage("Unknown Command: " + command);
            }
        });
    });
    server.listen(8080);

}

registerPlugin({
    name: 'BackSeatGamer OpenRCT2 Example Mod',
    version: '1.0',
    authors: ['CPSuperstore', "BackSeatGamer"],
    type: 'remote',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main
});
