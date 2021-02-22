// import modules
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
var Globals = require('globals');

module.exports.loop = function () {
    // clear up memory from dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            console.log(`laid to rest: ${name}`);
            delete Memory.creeps[name];
        }
    }

    // run creep logic for each creep
    for (let name in Game.creeps) {
        Game.creeps[name].runRole(); 
    }

    // run tower logic for each tower
    for (let tower of _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER)) {
        tower.defend();
    }

    // run spawn logic for each spawn
    for (let spawnName in Game.spawns) {
        var room = Game.spawns[spawnName].room;
        var spawn = Game.spawns[spawnName];
        var level = Game.spawns[spawnName].room.energyAvailable;
        var capacity = Game.spawns[spawnName].room.energyCapacityAvailable;
        var energy = `[energy ${level}/${capacity}]`;
        
        Globals.tickMessages[spawnName] = `${room} ${spawn} ${energy} ... `;
        Game.spawns[spawnName].spawnCreepsIfNecessary();
    }
};