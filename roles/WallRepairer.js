const Role = require('./Role');
const RoleType = require('./RoleType');
const Builder = require('./Builder');

const name = 'WallRepairer';
const type = RoleType.Secondary;
const body = [WORK, WORK, CARRY, MOVE];
const min = 1;
const ratio = 0.25;

module.exports = class WallRepairer extends Role {
  static get name() {
    return name;
  }

  static get type() {
    return type;
  }

  static get body() {
    return body;
  }

  static get min() {
    return min;
  }

  static get ratio() {
    return ratio;
  }

  static getCount = room => Role.count({ role: WallRepairer, room });

  static getCreeps = room => Role.getCreeps({ role: WallRepairer, room });

  static nextSerial = () => Role.nextSerial({ role: WallRepairer });

  static getStatus = room => Role.getStatus({ role: WallRepairer, room });
  
  static getPercentage = room => Role.getPercentage({ role: WallRepairer, room });

  static lessThanPerc = (room, percOverride) => Role.lessThanPerc({ role: WallRepairer, room, percOverride });

  static lessThanMin = (room, minOverride) => Role.lessThanMin({ role: WallRepairer, room, minOverride });

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
