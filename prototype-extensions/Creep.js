const helpers = require('../utils/helpers');

/**
 * @function runRole
 * @returns {undefined}
 */
Creep.prototype.runRole = function runRole() {
  this.memory.role.run(this);
};

/**
 * @function getEnergy
 * @param {String[]} sources
 * @returns {Boolean}
 * */
Creep.prototype.getEnergy = function getEnergy(sources) {
  const theSources = sources || ['source'];
  let success = false;
  theSources.forEach(source => {
    if (success) return;
    switch (source) {
      case 'source':
        success = this.getEnergyFromSource();
        break;
      case 'container':
        success = this.getEnergyFromContainer();
        break;
      case 'storage':
        success = this.getEnergyFromStorage();
        break;
      default:
        throw new Error(`Unknown source type: ${source}`);
    }
  });
};

/**
 * @function getEnergyFromSource
 * @returns {Boolean}
 */
Creep.prototype.getEnergyFromSource = function getEnergyFromSource() {
  const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (this.harvest(source) === ERR_NOT_IN_RANGE) {
    this.moveTo(source);
  }
  return true;
};

/**
 * @function getEnergyFromContainer
 * @returns {Boolean}
 */
Creep.prototype.getEnergyFromContainer = function getEnergyFromContainer() {
  const container = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: helpers.isContainerWithEnergy });
  if (container) {
    if (this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.moveTo(container);
    }
  }
  return !!container;
};

/**
 * @function getEnergyFromStorage
 * @returns {Boolean}
 */
Creep.prototype.getEnergyFromStorage = function getEnergyFromStorage() {
  const storage = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: helpers.isStorageWithEnergy });
  if (storage) {
    if (this.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.moveTo(storage);
    }
  }
  return !!storage;
};
