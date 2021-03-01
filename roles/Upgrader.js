const Role = require('./Role');
const RoleType = require('./RoleType');

const name = 'Upgrader';
const type = RoleType.Primary;
const body = [WORK, CARRY, MOVE, MOVE];
const min = 1;
const ratio = 0.25;

module.exports = class Upgrader extends Role {
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

  static getCount = room => Role.count({ role: Upgrader, room });

  static getCreeps = room => Role.getCreeps({ role: Upgrader, room });

  static nextSerial = () => Role.nextSerial({ role: Upgrader });

  static getStatus = room => Role.getStatus({ role: Upgrader, room });
  
  static getPercentage = room => Role.getPercentage({ role: Upgrader, room });

  static lessThanPerc = (room, percOverride) => Role.lessThanPerc({ role: Upgrader, room, percOverride });

  static lessThanMin = (room, minOverride) => Role.lessThanMin({ role: Upgrader, room, minOverride });

  static run(creep) {
    if (creep.memory.target && creep.memory.target !== creep.room.name) {
      const exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
      return;
    }

    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // deliver energy to controller
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container', 'source']);
    } else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  }
};
