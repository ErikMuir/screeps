const Role = require('./Role');
const RoleType = require('./RoleType');
const Builder = require('./Builder');

const name = 'Repairer';
const type = RoleType.Primary;
const body = [WORK, WORK, CARRY, MOVE];
const min = 1;
const ratio = 0.25;

module.exports = class Repairer extends Role {
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

  static getCount = room => Role.count({ role: Repairer, room });

  static getCreeps = room => Role.getCreeps({ role: Repairer, room });

  static nextSerial = () => Role.nextSerial({ role: Repairer });

  static getStatus = room => Role.getStatus({ role: Repairer, room });
  
  static getPercentage = room => Role.getPercentage({ role: Repairer, room });

  static lessThanPerc = (room, percOverride) => Role.lessThanPerc({ role: Repairer, room, percOverride });

  static lessThanMin = (room, minOverride) => Role.lessThanMin({ role: Repairer, room, minOverride });

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // repair a construction site
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container', 'source', 'storage']);
    } else {
      // find closest structure with less than max hits
      // Exclude walls because they have way too many max hits and would keep
      // our repairers busy forever. We have to find a solution for that later.
      const structure = creep.pos.findClosestByPath(
        FIND_STRUCTURES,
        { filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART }
      );

      if (structure) {
        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      } else {
        Builder.run(creep);
      }
    }
  }
};
