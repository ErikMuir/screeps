const Role = require('./Role');
const RoleType = require('./RoleType');
const Logger = require('../utils/Logger');

const name = 'Miner';
const type = RoleType.Specialized;
const body = [WORK, WORK, WORK, WORK, WORK, MOVE];
const min = 0;
const ratio = undefined;

module.exports = class Miner extends Role {
  static get name() {
    return name;
  }

  static get type() {
    return type;
  }

  static get body() {
    return body;
  }

  static get min() {
    return min;
  }

  static get ratio() {
    return ratio;
  }

  static getCount = room => Role.count({ role: Miner, room });

  static getCreeps = room => Role.getCreeps({ role: Miner, room });

  static nextSerial = () => Role.nextSerial({ role: Miner });

  static getStatus = room => Role.getStatus({ role: Miner, room });
  
  static getPercentage = room => Role.getPercentage({ role: Miner, room });

  static lessThanPerc = (room, percOverride) => Role.lessThanPerc({ role: Miner, room, percOverride });

  static lessThanMin = (room, minOverride) => Role.lessThanMin({ role: Miner, room, minOverride });

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
