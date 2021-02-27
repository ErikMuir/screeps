const Role = require('./Role');
const RoleType = require('./RoleType');
const Upgrader = require('./Upgrader');

module.exports = class Builder extends Role {
  constructor() {
    const roleName = 'Builder';
    const roleType = RoleType.Primary;
    const roleBody = [WORK, WORK, CARRY, MOVE];
    const roleMin = 1;
    const roleRatio = 0.25;
    super({ roleName, roleType, roleBody, roleMin, roleRatio });
  }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // complete a construction site
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container', 'source']);
    } else {
      const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (constructionSite) {
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
      } else {
        Upgrader.run(creep);
      }
    }
  }
};
