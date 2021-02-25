var roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  builder: require('role.builder'),
  repairer: require('role.repairer'),
  miner: require('role.miner'),
  lorry: require('role.lorry'),
  attacker: require('role.attacker'),
  wallRepairer: require('role.wallRepairer'),
  rampartRepairer: require('role.rampartRepairer'),
  janitor: require('role.janitor'),
  claimer: require('role.claimer'),
  remoteHarvester: require('role.remoteHarvester'),
  remoteBuilder: require('role.remoteBuilder'),
};

Creep.prototype.runRole = function () {
  roles[this.memory.role].run(this);
};

Creep.prototype.getEnergy = function (sources) {
  sources = sources || ['source'];
  let success = false;
  for (var source of sources) {
    switch (source) {
      case 'source':
        success = this.getEnergyFromSource();
        break;
      //---------------------------------------------------
      case 'container':
        success = this.getEnergyFromContainer();
        break;
      //---------------------------------------------------
      case 'storage':
        success = this.getEnergyFromStorage();
        break;
    }
    if (success) break;
  }
};

Creep.prototype.getEnergyFromSource = function () {
  let source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (this.harvest(source) == ERR_NOT_IN_RANGE) {
    this.moveTo(source);
  }
  return true;
};

Creep.prototype.getEnergyFromContainer = function () {
  let container = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0 && s.room == this.room,
  });
  if (container != undefined) {
    if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(container);
    }
    return true;
  } else {
    return false;
  }
};

Creep.prototype.getEnergyFromStorage = function () {
  let storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0 && s.room == this.room,
  });
  if (storage != undefined) {
    if (this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(storage);
    }
    return true;
  } else {
    return false;
  }
};
