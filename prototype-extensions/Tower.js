const Logger = require('../utils/Logger');
const helpers = require('../utils/helpers');

StructureTower.prototype.defend = function defend() {
  // number one priority is to attack hostile creeps
  const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (target) {
    this.attack(target);
    Logger.info(`The tower just attacked enemy creep: ${target}`);
    return;
  }

  // we always want to make sure there is enough energy to defend against attackers
  // const energyPercentage = (this.energy / this.energyCapacity) * 100; // deprecated
  const energyPercentage = (this.store[RESOURCE_ENERGY] / this.store.getCapacity(RESOURCE_ENERGY)) * 100;
  if (energyPercentage <= 50) return;

  const findStructureWithFilter = filter => this.pos.findClosestByRange(FIND_STRUCTURES, { filter });
  const closestDamagedStructure = findStructureWithFilter(helpers.isDamagedStructure)
    || findStructureWithFilter(helpers.isDamagedRampart)
    || findStructureWithFilter(helpers.isDamagedWall);

  if (closestDamagedStructure) {
    this.repair(closestDamagedStructure);
  }
};
