const Role = require('./Role');
const RoleType = require('./RoleType');

const roleName = 'Upgrader';

module.exports = class Builder extends Role {
  static get roleName() {
    return roleName;
  }

  static get roleType() {
    return RoleType.Primary;
  }

  static get roleBody() {
    return [WORK, CARRY, MOVE, MOVE];
  }

  static get roleMin() {
    return 1;
  }

  static get roleRatio() {
    return 0.25;
  }

  static getCount = room => Role.count({ roleName, room });

  static getCreeps = room => Role.getCreeps({ roleName, room });

  static nextSerial = () => Role.nextSerial(roleName);

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
