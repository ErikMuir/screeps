const Role = require('./Role');
const RoleType = require('./RoleType');
const Lorry = require('./Lorry');
const Logger = require('../utils/Logger');
const helpers = require('../utils/helpers');

const name = 'Janitor';
const type = RoleType.Specialized;
const body = [CARRY, CARRY, MOVE];
const min = 1;
const ratio = undefined;

module.exports = class Janitor extends Role {
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

  static getCount(room) { return Role.count({ role: Janitor, room }); }

  static getCreeps(room) { return Role.getCreeps({ role: Janitor, room }); }

  static nextSerial() { return Role.nextSerial({ role: Janitor }); }

  static getStatus(room) { return Role.getStatus({ role: Janitor, room }); }

  static getPercentage(room) { return Role.getPercentage({ role: Janitor, room }); }

  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: Janitor, room, percOverride }); }

  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: Janitor, room, minOverride }); }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // pick up dropped energy
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // deliver energy
    }

    if (!creep.memory.working) {
      const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: helpers.isResourceEnergy });
      if (droppedEnergy) {
        if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedEnergy);
        } else {
          Logger.info(`${creep.name} found ${droppedEnergy.energy} energy at ${droppedEnergy.pos}`);
        }
      } else {
        Lorry.run(creep);
      }
    } else {
      const includeContainers = false;
      const structure = helpers.getClosestStructureNeedingEnergy(creep, includeContainers);
      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      } else if (creep.carry.energy < creep.carryCapacity) {
        creep.memory.working = false;
      }
    }
  }
};
