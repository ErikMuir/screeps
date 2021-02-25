const Role = require('./Role');
const RoleType = require('./RoleType');
const Repairer = require('./Repairer');

module.exports = class RampartRepairer extends Role {
  constructor() {
    const name = 'RampartRepairer';
    const type = RoleType.Secondary;
    const body = [WORK, WORK, CARRY, MOVE];
    const min = 1;
    const targetPerc = 0.25;
    super({ name, type, body, min, targetPerc });
  }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // repair a rampart
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container', 'source', 'storage']);
    } else {
      let target;
      const ramparts = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_RAMPART });

      // loop with increasing percentages
      for (let percentage = 0.0001; percentage <= 1; percentage += 0.0001) {
        // find a wall with less than percentage hits
        target = ramparts.find(wall => wall.hits / wall.hitsMax < percentage);
        if (target) break;
      }

      if (target) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      } else {
        Repairer.run(creep);
      }
    }
  }
};
