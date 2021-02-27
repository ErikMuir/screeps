const Role = require('./Role');
const RoleType = require('./RoleType');

module.exports = class RemoteHarvester extends (
  Role
) {
  constructor() {
    const roleName = 'RemoteHarvester';
    const roleType = RoleType.Remote;
    const roleBody = [WORK, WORK, CARRY, MOVE];
    const roleMin = 2;
    super({ roleName, roleType, roleBody, roleMin });
  }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // transfer energy to structure
    }

    if (!creep.memory.working) {
      if (creep.room.name === creep.memory.target) {
        const source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      } else {
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }
    } else if (creep.room.name !== creep.memory.home) {
      const exit = creep.room.findExitTo(creep.memory.home);
      creep.moveTo(creep.pos.findClosestByRange(exit));
    } else {
      // TODO : extract these helper functions into separate file to be used by Harvester.js
      getEnergyPercentage = s => (s.energy / s.energyCapacity) * 100;
      isSpawn = s => s.structureType === STRUCTURE_SPAWN;
      isExtension = s => s.structureType === STRUCTURE_EXTENSION;
      isTower = s => s.structureType === STRUCTURE_TOWER;
      isContainer = s => s.structureType === STRUCTURE_CONTAINER;
      needsEnergy = s => {
        switch (s.structureType) {
          case STRUCTURE_SPAWN:
            return getEnergyPercentage(s) < 100;
          case STRUCTURE_EXTENSION:
            return getEnergyPercentage(s) < 100;
          case STRUCTURE_TOWER:
            return getEnergyPercentage(s) < 95;
          case STRUCTURE_CONTAINER:
            return s.room === creep.room && s.store[RESOURCE_ENERGY] < s.storeCapacity;
          default:
            return false;
        }
      };
      isSpawnNeedingEnergy = s => isSpawn(s) && needsEnergy(s);
      isExtensionNeedingEnergy = s => isExtension(s) && needsEnergy(s);
      isTowerNeedingEnergy = s => isTower(s) && needsEnergy(s);
      isContainerNeedingEnergy = s => isContainer(s) && needsEnergy(s);
      getClosestSpawnNeedingEnergy = () =>
        creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isSpawnNeedingEnergy });
      getClosestExtensionNeedingEnergy = () =>
        creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isExtensionNeedingEnergy });
      getClosestTowerNeedingEnergy = () =>
        creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isTowerNeedingEnergy });
      getClosestContainerNeedingEnergy = () =>
        creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: isContainerNeedingEnergy });
      getClosestStructureNeedingEnergy = () =>
        getClosestSpawnNeedingEnergy() ||
        getClosestExtensionNeedingEnergy() ||
        getClosestTowerNeedingEnergy() ||
        getClosestContainerNeedingEnergy() || // TODO : add a flag to the role to make this optional
        creep.room.storage;

      const structure = getClosestStructureNeedingEnergy();
      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      }
    }
  }
};
