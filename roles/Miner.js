const Role = require('./Role');
const RoleType = require('./RoleType');
const Logger = require('../utils/Logger');

const roleName = 'Miner';

module.exports = class Miner extends Role {
  static get roleName() {
    return roleName;
  }

  static get roleType() {
    return RoleType.Specialized;
  }

  static get roleBody() {
    return [WORK, WORK, WORK, WORK, WORK, MOVE];
  }

  static get roleMin() {
    return 0;
  }

  static get roleRatio() {
    return undefined;
  }

  static getCount = room => Role.count({ roleName, room });

  static getCreeps = room => Role.getCreeps({ roleName, room });

  static nextSerial = () => Role.nextSerial(roleName);

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
