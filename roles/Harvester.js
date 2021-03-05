const Role = require('./Role');
const RoleType = require('./RoleType');
const helpers = require('../utils/helpers');

const name = 'Harvester';
const type = RoleType.Primary;
const body = [WORK, WORK, CARRY, MOVE];
const min = 1;
const ratio = 0.25;

module.exports = class Harvester extends Role {
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

  static getCount(room) { return Role.count({ role: Harvester, room }); }

  static getCreeps(room) { return Role.getCreeps({ role: Harvester, room }); }

  static nextSerial() { return Role.nextSerial({ role: Harvester }); }

  static getStatus(room) { return Role.getStatus({ role: Harvester, room }); }

  static getPercentage(room) { return Role.getPercentage({ role: Harvester, room }); }

  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: Harvester, room, percOverride }); }

  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: Harvester, room, minOverride }); }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // transfer energy to structure
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container', 'source']);
    } else {
      const includeContainers = true;
      const structure = helpers.getClosestStructureNeedingEnergy(creep, includeContainers);
      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      }
    }
  }
};
