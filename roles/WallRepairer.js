const Role = require('./Role');
const RoleType = require('./RoleType');
const Builder = require('./Builder');

module.exports = class WallRepairer extends Role {
  constructor() {
    const roleName = 'WallRepairer';
    const roleType = RoleType.Secondary;
    const roleBody = [WORK, WORK, CARRY, MOVE];
    const roleMin = 1;
    const roleRatio = 0.25;
    super({ roleName, roleType, roleBody, roleMin, roleRatio });
  }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // repair a wall
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container', 'source']);
    } else {
      let target;
      const walls = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_WALL });

      // loop with increasing percentages
      for (let percentage = 0.0001; percentage <= 1; percentage += 0.0001) {
        // find a wall with less than percentage hits
        target = walls.find(wall => wall.hits / wall.hitsMax < percentage);
        if (target) break;
      }

      if (target) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      } else {
        Builder.run(creep);
      }
    }
  }
};
