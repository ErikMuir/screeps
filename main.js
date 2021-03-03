require('./prototype-extensions/Creep');
require('./prototype-extensions/Tower');
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
  Object.keys(Game.structures)
    .filter(key => Game.structures[key].structureType === STRUCTURE_TOWER)
    .forEach(key => Game.structures[key].defend());

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
