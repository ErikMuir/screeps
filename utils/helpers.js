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

/** @param {Number} code */
const returnCode = code => {
  switch (code) {
    case 0:
      return 'OK';
    case -1:
      return 'ERR_NOT_OWNER';
    case -2:
      return 'ERR_NO_PATH';
    case -3:
      return 'ERR_NAME_EXISTS';
    case -4:
      return 'ERR_BUSY';
    case -5:
      return 'ERR_NOT_FOUND';
    case -6:
      return 'ERR_NOT_ENOUGH_ENERGY';
    case -7:
      return 'ERR_INVALID_TARGET';
    case -8:
      return 'ERR_FULL';
    case -9:
      return 'ERR_NOT_IN_RANGE';
    case -10:
      return 'ERR_INVALID_ARGS';
    case -11:
      return 'ERR_TIRED';
    case -12:
      return 'ERR_NO_BODYPART';
    case -14:
      return 'ERR_RCL_NOT_ENOUGH';
    case -15:
      return 'ERR_GCL_NOT_ENOUGH';
    default:
      return `Unknown code: ${code}`;
  }
};

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
  returnCode,
};
