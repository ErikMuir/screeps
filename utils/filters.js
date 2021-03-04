const wallTypeStructuresFilter = s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART;
const containersFilter = s => s.structureType === STRUCTURE_CONTAINER;
const damagedStructureFilter = s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART;
const damagedRampartFilter = s => s.hits < s.hitsMax && s.structureType === STRUCTURE_RAMPART;
const damagedWallFilter = s => s.hits < s.hitsMax && s.structureType === STRUCTURE_WALL;
const containersWithEnergy = s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0 && s.room === this.room; // will 'this' work?
const storageWithEnergy = s => s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0 && s.room === this.room; // will 'this' work?
const getEnergyPercentage = s => (s.energy / s.energyCapacity) * 100;
const isSpawn = s => s.structureType === STRUCTURE_SPAWN;
const isExtension = s => s.structureType === STRUCTURE_EXTENSION;
const isTower = s => s.structureType === STRUCTURE_TOWER;
const isContainer = s => s.structureType === STRUCTURE_CONTAINER;
const needsEnergy = s => {
  switch (s.structureType) {
    case STRUCTURE_SPAWN: return getEnergyPercentage(s) < 100;
    case STRUCTURE_EXTENSION: return getEnergyPercentage(s) < 100;
    case STRUCTURE_TOWER: return getEnergyPercentage(s) < 95;
    case STRUCTURE_CONTAINER: return s.room === creep.room && s.store[RESOURCE_ENERGY] < s.storeCapacity;
    default: return false;
  }
};
const isFullOfEnergy = s => s.energy >= s.energyCapacity;
const isSpawnNeedingEnergy = s => isSpawn(s) && needsEnergy(s);
const isExtensionNeedingEnergy = s => isExtension(s) && needsEnergy(s);
const isTowerNeedingEnergy = s => isTower(s) && needsEnergy(s);
const isContainerNeedingEnergy = s => isContainer(s) && needsEnergy(s);
const couldUseEnergy = s => (isSpawn(s) || isExtension(s) || isTower(s)) && !isFullOfEnergy(s);
const resourceEnergyFilter = r => r.resourceType === RESOURCE_ENERGY;

module.exports = {
  wallTypeStructuresFilter,
  containersFilter,
  damagedStructureFilter,
  damagedRampartFilter,
  damagedWallFilter,
  containersWithEnergy,
  storageWithEnergy,
  isSpawnNeedingEnergy,
  isExtensionNeedingEnergy,
  isTowerNeedingEnergy,
  isContainerNeedingEnergy,
  couldUseEnergy,
  resourceEnergyFilter,
};
