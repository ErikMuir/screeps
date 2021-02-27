const Role = require('./Role');
const RoleType = require('./RoleType');
const Lorry = require('./Lorry');
const Logger = require('../utils/Logger');

module.exports = class Janitor extends Role {
  constructor() {
    const roleName = 'Janitor';
    const roleType = RoleType.Specialized;
    const roleBody = [CARRY, CARRY, MOVE];
    const roleMin = 1;
    super({ roleName, roleType, roleBody, roleMin });
  }

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
