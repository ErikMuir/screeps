// create a new function for StructureTower
StructureTower.prototype.defend = function () {
  var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (target != undefined) {
    this.attack(target);
    console.log(`The tower just attacked enemy creep: ${target}`);
    return;
  }

  var energyPercentage = (this.energy / this.energyCapacity) * 100;
  if (energyPercentage <= 50) {
    // we always want to make sure there is enough energy to defend against attackers
    return;
  }

  // find closest damaged structure other than walls and ramparts
  var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: s => s.hits < s.hitsMax, //&& s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
  });

  if (closestDamagedStructure == undefined) {
    // find closest damaged rampart
    closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => s.hits < s.hitsMax && s.structureType == STRUCTURE_RAMPART,
    });
  }

  if (closestDamagedStructure == undefined) {
    // find closest damaged wall
    closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => s.hits < s.hitsMax && s.structureType == STRUCTURE_WALL,
    });
  }

  if (closestDamagedStructure != undefined) {
    this.repair(closestDamagedStructure);
    return;
  }
};
