const Role = require('./Role');
const RoleType = require('./RoleType');
const Harvester = require('./Harvester');
const Logger = require('../utils/Logger');

module.exports = class RemoteBuilder extends Role {
  constructor() {
    const name = 'RemoteBuilder';
    const type = RoleType.Remote;
    const body = [WORK, WORK, CARRY, MOVE];
    const min = 2;
    super({ name, type, body, min });
  }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // build construction site
    }

    if (!creep.memory.working) {
      // don't do anything until you're in the target room
      if (creep.memory.target && creep.room.name !== creep.memory.target) {
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        return;
      }

      // TODO : should we refactor this dropped energy thing to be an option for all remote roles until we have a concept of a remote janitor????
      const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === RESOURCE_ENERGY });
      if (droppedEnergy) {
        if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedEnergy);
        } else {
          Logger.info(`${creep.name} found ${droppedEnergy.energy} energy at ${droppedEnergy.pos}`);
        }
      } else {
        creep.getEnergy(['source']);
      }
    } else {
      const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
        filter: cs => cs.structureType === STRUCTURE_SPAWN
        // || cs.structureType === STRUCTURE_ROAD // TODO : should this be an optional flag?
        ,
      });
      if (constructionSite) {
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
      } else {
        Harvester.run(creep);
      }
    }
  }
};
