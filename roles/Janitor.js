const Role = require('./Role');
const RoleType = require('./RoleType');
const Lorry = require('./Lorry');
const Logger = require('../utils/Logger');

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

  static getCount = room => Role.count({ role: Janitor, room });

  static getCreeps = room => Role.getCreeps({ role: Janitor, room });

  static nextSerial = () => Role.nextSerial({ role: Janitor });

  static getStatus = room => Role.getStatus({ role: Janitor, room });
  
  static getPercentage = room => Role.getPercentage({ role: Janitor, room });

  static lessThanPerc = (room, percOverride) => Role.lessThanPerc({ role: Janitor, room, percOverride });

  static lessThanMin = (room, minOverride) => Role.lessThanMin({ role: Janitor, room, minOverride });

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // pick up dropped energy
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // deliver energy
    }

    if (!creep.memory.working) {
      const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === RESOURCE_ENERGY });
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
      const structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_SPAWN
          || s.structureType === STRUCTURE_EXTENSION
          || s.structureType === STRUCTURE_TOWER)
          && s.energy < s.energyCapacity,
      }) || creep.room.storage;

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
