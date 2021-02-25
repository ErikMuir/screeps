require('./prototype-extensions/prototype.creep');
require('./prototype-extensions/prototype.tower');
require('./prototype-extensions/prototype.spawn');
const { tickMessages } = require('./utils/globals');
const Logger = require('./utils/Logger');

module.exports.loop = () => {
  // clear up memory from dead creeps
  Object.keys(Memory.creeps).forEach(name => {
    if (!Game.creeps[name]) {
      Logger.info(`laid to rest: ${name}`);
      delete Memory.creeps[name];
    }
  });

  // run creep logic for each creep
  Object.keys(Game.creeps)
    .forEach(name => Game.creeps[name].runRole());

  // run tower logic for each tower
  Game.structures
    .filter(s => s.structureType === STRUCTURE_TOWER)
    .forEach(tower => tower.defend());

  // run spawn logic for each spawn
  Object.keys(Game.spawns)
    .forEach(name => {
      const { room } = Game.spawns[name];
      const spawn = Game.spawns[name];
      const level = Game.spawns[name].room.energyAvailable;
      const capacity = Game.spawns[name].room.energyCapacityAvailable;
      const energy = `[energy ${level}/${capacity}]`;

      tickMessages[name] = `${room} ${spawn} ${energy} ... `;
      Game.spawns[name].spawnCreepsIfNecessary();
    });
};
