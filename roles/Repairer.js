const Role = require('./Role');
const RoleType = require('./RoleType');
const Builder = require('./Builder');

const roleName = 'Repairer';

module.exports = class Repairer extends Role {
  static get roleName() {
    return roleName;
  }

  static get roleType() {
    return RoleType.Primary;
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
