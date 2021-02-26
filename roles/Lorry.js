const Role = require('./Role');
const RoleType = require('./RoleType');

module.exports = class Lorry extends Role {
  constructor() {
    const name = 'Lorry';
    const type = RoleType.Specialized;
    const body = [WORK, WORK, MOVE];
    const min = 0;
    super({ name, type, body, min });
  }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // pick up energy
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // deliver energy
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container']);
    } else {
      // TODO : extract these helper functions into separate file to be used by Harvester.js
      getEnergyPercentage = s => (s.energy / s.energyCapacity) * 100;
      isSpawn = s => s.structureType === STRUCTURE_SPAWN;
      isExtension = s => s.structureType === STRUCTURE_EXTENSION;
      isTower = s => s.structureType === STRUCTURE_TOWER;
      isContainer = s => s.structureType === STRUCTURE_CONTAINER;
      needsEnergy = s => {
        switch (s.structureType) {
          case STRUCTURE_SPAWN: return getEnergyPercentage(s) < 100;
          case STRUCTURE_EXTENSION: return getEnergyPercentage(s) < 100;
          case STRUCTURE_TOWER: return getEnergyPercentage(s) < 95;
          case STRUCTURE_CONTAINER: return s.room === creep.room && s.store[RESOURCE_ENERGY] < s.storeCapacity;
          default: return false;
        }
      };
      isSpawnNeedingEnergy = s => isSpawn(s) && needsEnergy(s);
      isExtensionNeedingEnergy = s => isExtension(s) && needsEnergy(s);
      isTowerNeedingEnergy = s => isTower(s) && needsEnergy(s);
      isContainerNeedingEnergy = s => isContainer(s) && needsEnergy(s);
      getClosestSpawnNeedingEnergy = () => creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isSpawnNeedingEnergy });
      getClosestExtensionNeedingEnergy = () => creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isExtensionNeedingEnergy });
      getClosestTowerNeedingEnergy = () => creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isTowerNeedingEnergy });
      getClosestContainerNeedingEnergy = () => creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: isContainerNeedingEnergy });
      getClosestStructureNeedingEnergy = () => getClosestSpawnNeedingEnergy()
        || getClosestExtensionNeedingEnergy()
        || getClosestTowerNeedingEnergy()
        // || getClosestContainerNeedingEnergy() // TODO : add a flag to the role to make this optional
        || creep.room.storage;

      const structure = getClosestStructureNeedingEnergy();
      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      }
    }
  }
};
