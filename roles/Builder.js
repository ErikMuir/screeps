const Role = require('./Role');
const RoleType = require('./RoleType');
const Upgrader = require('./Upgrader');

const name = 'Builder';
const type = RoleType.Primary;
const body = [WORK, WORK, CARRY, MOVE];
const min = 1;
const ratio = 0.25;

module.exports = class Builder extends Role {
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

  static getCount = room => Role.count({ role: Builder, room });

  static getCreeps = room => Role.getCreeps({ role: Builder, room });

  static nextSerial = () => Role.nextSerial({ role: Builder });

  static getStatus = room => Role.getStatus({ role: Builder, room });
  
  static getPercentage = room => Role.getPercentage({ role: Builder, room });

  static lessThanPerc = (room, percOverride) => Role.lessThanPerc({ role: Builder, room, percOverride });

  static lessThanMin = (room, minOverride) => Role.lessThanMin({ role: Builder, room, minOverride });

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
