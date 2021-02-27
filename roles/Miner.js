const Role = require('./Role');
const RoleType = require('./RoleType');
const Logger = require('../utils/Logger');

module.exports = class Miner extends Role {
  constructor() {
    const roleName = 'Miner';
    const roleType = RoleType.Specialized;
    const roleBody = [WORK, WORK, WORK, WORK, WORK, MOVE];
    const roleMin = 0;
    super({ roleName, roleType, roleBody, roleMin });
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
