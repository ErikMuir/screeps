var roleLorry = require('role.lorry');

module.exports = {
  run: function (creep) {
    // switch state if necessary
    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
    } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    // if creep is supposed to transfer energy to a structure
    if (creep.memory.working == true) {
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
          (s.structureType == STRUCTURE_SPAWN ||
            s.structureType == STRUCTURE_EXTENSION ||
            s.structureType == STRUCTURE_TOWER) &&
          s.energy < s.energyCapacity,
      });

      if (structure == undefined) {
        structure = creep.room.storage;
      }

      if (structure != undefined) {
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      } else if (creep.carry.energy < creep.carryCapacity) {
        creep.memory.working = false;
      }
    }
    // if creep is supposed to pickup dropped energy
    else {
      const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: r => r.resourceType == RESOURCE_ENERGY,
      });

      if (droppedEnergy != undefined) {
        if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedEnergy);
        } else {
          console.log(`${creep.name} found ${droppedEnergy.energy} energy at ${droppedEnergy.pos}`);
        }
      } else {
        roleLorry.run(creep);
      }
    }
  },
};
