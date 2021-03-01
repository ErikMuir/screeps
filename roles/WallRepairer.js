const Role = require('./Role');
const RoleType = require('./RoleType');
const Builder = require('./Builder');

const roleName = 'WallRepairer';

module.exports = class WallRepairer extends Role {
  static get roleName() {
    return roleName;
  }

  static get roleType() {
    return RoleType.Secondary;
  }

  static get roleBody() {
    return [WORK, WORK, CARRY, MOVE];
  }

  static get roleMin() {
    return 1;
  }

  static get roleRatio() {
    return 0.25;
  }

  static getCount = room => Role.count({ roleName, room });

  static getCreeps = room => Role.getCreeps({ roleName, room });

  static nextSerial = () => Role.nextSerial(roleName);

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
