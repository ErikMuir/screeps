const Role = require('./Role');
const RoleType = require('./RoleType');
const Upgrader = require('./Upgrader');

const roleName = 'Builder';

module.exports = class Builder extends Role {
  static get roleName() {
    return roleName;
  }

  static get roleType() {
    return RoleType.Primary;
  }

  static get roleBody() {
    return [WORK, WORK, CARRY, MOVE];
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
