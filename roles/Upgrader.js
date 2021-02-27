const Role = require('./Role');
const RoleType = require('./RoleType');

module.exports = class Builder extends Role {
  constructor() {
    const roleName = 'Upgrader';
    const roleType = RoleType.Primary;
    const roleBody = [WORK, CARRY, MOVE, MOVE];
    const roleMin = 1;
    const roleRatio = 0.25;
    super({ roleName, roleType, roleBody, roleMin, roleRatio });
  }

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
