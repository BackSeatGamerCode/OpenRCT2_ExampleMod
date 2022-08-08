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
    "maxBankLoan":              function(name, reward, command){ park.bankLoan += park.maxBankLoan; },
    "halfRating":               function(name, reward, command){ park.rating = Math.floor(park.rating / 2); },
    "loan1000":                 function(name, reward, command){ park.bankLoan += 1000; },
    "renamePark":               function(name, reward, command){ park.name = name; },
    "crash":                    function(name, reward, command){ crashRandomCar() },
    "creeper":                  function(name, reward, command){ creeper() },
    "sploosh":                  function(name, reward, command){ sploosh() },
    "fireEmployee":             function(name, reward, command){ fireEmployee() },
    "entertainPatron":          function(name, reward, command){ entertainPatron() },
    "createTrash":              function(name, reward, command){ createTrash() },
    "writeName":                function(name, reward, command){ writeName(name) },
    "gift1000":                 function(name, reward, command){ park.cash += 1000 },
    "pickPocket":               function(name, reward, command){ pickPocket() },
    "confuse":                  function(name, reward, command){ confuse() },
    "fireSploosh":              function(name, reward, command){ fireSploosh() }
}

BANDIT_CLONE_COUNT = 1;
TRASH_TYPES = [
    "vomit", "vomit_alt", "empty_can", "rubbish", "burger_box", "empty_cup", "empty_box", 
    "empty_bottle", "empty_bowl_red", "empty_drink_carton", "empty_juice_cup", "empty_bowl_blue"
];

CURSES = ["Dinkleberg", "Perry the Platypus", "Bandit"]

TEXT_Y = 1;

function confuse(){
    var peep = locateRandomEntity("guest", isValidPeep);

    if(peep != null){
        console.log(peep.name)

        var x = peep.x;
        var y = peep.y;

        context.setInterval(function () {
            
            peep.destination = {
                x: x,
                y: y
            };

        }, 2000);
    }
}

function pickPocket(){
    var peep = locateRandomEntity("guest", isValidPeep);

    if(peep != null){
        context.setTimeout(function () {

            map.createEntity("money_effect", {
                x: peep.x,
                y: peep.y,
                z: peep.z + 10
            });

            peep.name = "CURSE YOU " + CURSES[Math.floor(Math.random() * CURSES.length)].toUpperCase();
            
            park.cash += peep.cash;
            peep.cash = 0;

            ui.showError("Pick Pocket Complete", peep.name);

            
        }, 1000);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function writeName(name){
    name = name.toLowerCase();

    var xPos = 40;
    var yPos = TEXT_Y;

    TEXT_Y += 64;

    for (var i = 0; i < name.length; i++) {
        var letter = name.charAt(i);

        if(TILE_LETTERS.hasOwnProperty(letter)){
            var matrix = TILE_LETTERS[letter].reverse();

            for (var y = 0; y < matrix.length; y++) {
                for (var x = 0; x < matrix[y].length; x++) {

                    if (matrix[y][x] == 1){
                        map.createEntity("litter", {
                            x: xPos + (x * 8),
                            y: yPos + (y * 8),
                            z: 256
                        });
                        // var tile = map.getTile(xPos + x, yPos + y);

                        // floodTile(tile)
                    }
                }
            }

            TILE_LETTERS[letter].reverse()
        } 
        xPos += 6 * 8;
    }
}

function entertainPatron(){
    var peep = locateRandomEntity("guest", isValidPeep);

    if(peep != null){
        context.setTimeout(function () {
            
            for (var i = 0; i < 100; i++) {
                var staff = map.createEntity("staff", {
                    x: peep.x,
                    y: peep.y,
                    z: peep.z
                });
                
                staff.staffType = "entertainer";
                staff.name = "Bandit Clone " + BANDIT_CLONE_COUNT;
                staff.orders = 1;

                staff.energy = 100;
                staff.energyTarget = 100;

                staff.destination = peep.destination;

                BANDIT_CLONE_COUNT ++;
            }

        }, 1000);
    }
}

function createTrash(){
    var peep = locateRandomEntity("guest", isValidPeep);

    if(peep != null){
        context.setTimeout(function () {
            
            for (var i = 0; i < 100; i++) {
                var trash = map.createEntity("litter", {
                    x: peep.x + getRandomInt(-8, 8),
                    y: peep.y + getRandomInt(-8, 8),
                    z: peep.z
                });
                trash.litterType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
            }

        }, 1000);
    }
}

function fireEmployee(){
    var peep = locateRandomEntity("staff", function(peep) {return peep.staffType != "entertainer";}, false);

    if(peep != null){
        console.log(peep.name);
        peep.remove();
    }
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


function fireSploosh(){
    var x = 1;

    var interval = context.setInterval(function () {

        for (var y = 0; y < map.size.y; y++) {
            floodTile(map.getTile(x, y));
        }

        if(x >= map.size.x){
            context.clearInterval(interval);
            postMessage("sploosh v2");
        }
        
        x++;

    }, 1000);
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

function locateRandomObject(type, filter){
    if (filter == undefined){
        filter = function(peep) {return true;}
    }

    var objects = context.getAllObjects(type);
    objects = objects.filter(filter)

    if (objects.length > 0){
        return objects[Math.floor(Math.random() * objects.length)];
    }
}

function locateRandomEntity(type, filter, move){
    if (filter == undefined){
        filter = function(peep) {return true;}
    }

    if (move == undefined){
        move = true;
    }

    var entities = map.getAllEntities(type);
    entities = entities.filter(filter)

    if (entities.length > 0){
        var entity = entities[Math.floor(Math.random() * entities.length)];

        if (move){
            var position = ui.mainViewport.getCentrePosition();
            position.x = entity.x;
            position.y = entity.y;

            ui.mainViewport.scrollTo(position);
        }

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
    server.listen(29175);

    // context.subscribe('interval.tick', function() {
    //     park.cash += 1;
    // });
}

registerPlugin({
    name: 'BackSeatGamer OpenRCT2 Plugin',
    version: '1.0',
    authors: ['CPSuperstore', "BackSeatGamer"],
    type: 'remote',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main
});


TILE_LETTERS = {
    "a": [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    "b": [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    "c": [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
    ],
    "d": [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    "e": [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    "f": [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
    ],
    "g": [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
    ],
    "h": [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    "i": [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    "j": [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
    ],
    "k": [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 0, 1, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    "l": [
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    "m": [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    "n": [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    "o": [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    "p": [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
    ],
    "q": [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 0],
        [0, 1, 1, 0, 1],
    ],
    "r": [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    "s": [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    "t": [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    "u": [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    "v": [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
    ],
    "w": [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0],
    ],
    "x": [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    "y": [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    "z": [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
}
