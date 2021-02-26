const Role = require('./Role');
const RoleType = require('./RoleType');
const Logger = require('../utils/Logger');

module.exports = class Miner extends Role {
  constructor() {
    const name = 'Miner';
    const type = RoleType.Specialized;
    const body = [WORK, WORK, WORK, WORK, WORK, MOVE];
    const min = 0;
    super({ name, type, body, min });
  }

  static run(creep) {
    // get source
    const source = Game.getObjectById(creep.memory.sourceId);
    if (!source) {
      Logger.info(`${creep.name} could not find his source!`);
      return;
    }

    // get container
    const container = Game.getObjectById(creep.memory.containerId);
    if (!container) {
      Logger.info(`${creep.name} could not find his container!`);
      return;
    }

    if (creep.pos.isEqualTo(container.pos)) {
      creep.harvest(source);
    } else {
      creep.moveTo(container);
    }
  }
};
