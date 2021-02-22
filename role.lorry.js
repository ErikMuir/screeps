module.exports = {
  // a function to run the logic for this role
  run: function (creep) {
    // if creep is bringing energy to a structure but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to transfer energy to a structure
    if (creep.memory.working == true) {
      // find closest spawn or extension which is not full
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
          (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity,
      });

      if (structure == undefined) {
        structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: s => s.structureType == STRUCTURE_TOWER && (s.energy / s.energyCapacity) * 100 < 95,
        });
      }

      if (structure == undefined) {
        structure = creep.room.storage;
      }

      // if we found a structure
      if (structure != undefined) {
        // try to transfer energy, if it is not in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          creep.moveTo(structure);
        }
      }
    }
    // if creep is supposed to get energy
    else {
      creep.getEnergy(['container']);
    }
  },
};
