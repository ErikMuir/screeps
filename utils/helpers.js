const isWall = s => s.structureType === STRUCTURE_WALL;
const isRampart = s => s.structureType === STRUCTURE_RAMPART;
const isSpawn = s => s.structureType === STRUCTURE_SPAWN;
const isExtension = s => s.structureType === STRUCTURE_EXTENSION;
const isTower = s => s.structureType === STRUCTURE_TOWER;
const isContainer = s => s.structureType === STRUCTURE_CONTAINER;
const isStorage = s => s.structureType === STRUCTURE_STORAGE;
const isRoad = s => s.structureType === STRUCTURE_ROAD;
const isResourceEnergy = r => r.resourceType === RESOURCE_ENERGY;
const isWallOrRampart = s => isWall(s) || isRampart(s);
const isSpawnOrRoad = cs => isSpawn(cs) || isRoad(s);
const isDamaged = s => s.hits < s.hitsMax;
const isDamagedStructure = s => isDamaged(s) && !isWallOrRampart(s);
const isDamagedRampart = s => isDamaged(s) && isRampart(s);
const isDamagedWall = s => isDamaged(s) && isWall(s);
const isContainerWithEnergy = s => isContainer(s) && s.store[RESOURCE_ENERGY] > 0;
const isStorageWithEnergy = s => isStorage(s) && s.store[RESOURCE_ENERGY] > 0;
const getEnergyPercentage = s => (s.energy / s.energyCapacity) * 100;
const isSpawnNeedingEnergy = s => isSpawn(s) && s.energy < s.energyCapacity;
const isExtensionNeedingEnergy = s => isExtension(s) && s.energy < s.energyCapacity;
const isTowerNeedingEnergy = s => isTower(s) && getEnergyPercentage(s) < 95;
const isContainerNeedingEnergy = s => isContainer(s) && s.store[RESOURCE_ENERGY] < s.storeCapacity;
const getClosestSpawnNeedingEnergy = creep => creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isSpawnNeedingEnergy });
const getClosestExtensionNeedingEnergy = creep => creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isExtensionNeedingEnergy });
const getClosestTowerNeedingEnergy = creep => creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: isTowerNeedingEnergy });
const getClosestContainerNeedingEnergy = creep => creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: isContainerNeedingEnergy });
const getClosestStructureNeedingEnergy = (creep, includeContainers) => getClosestSpawnNeedingEnergy(creep)
  || getClosestExtensionNeedingEnergy(creep)
  || getClosestTowerNeedingEnergy(creep)
  || (includeContainers && getClosestContainerNeedingEnergy(creep))
  || creep.room.storage;

module.exports = {
  isWall,
  isRampart,
  isSpawn,
  isExtension,
  isTower,
  isContainer,
  isStorage,
  isRoad,
  isResourceEnergy,
  isWallOrRampart,
  isSpawnOrRoad,
  isDamaged,
  isDamagedStructure,
  isDamagedRampart,
  isDamagedWall,
  isContainerWithEnergy,
  isStorageWithEnergy,
  getEnergyPercentage,
  isSpawnNeedingEnergy,
  isExtensionNeedingEnergy,
  isTowerNeedingEnergy,
  isContainerNeedingEnergy,
  getClosestSpawnNeedingEnergy,
  getClosestExtensionNeedingEnergy,
  getClosestTowerNeedingEnergy,
  getClosestContainerNeedingEnergy,
  getClosestStructureNeedingEnergy,
};
