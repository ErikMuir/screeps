const Role = require('./Role');
const RoleType = require('./RoleType');
const Repairer = require('./Repairer');

const name = 'RampartRepairer';
const type = RoleType.Seconadry;
const body = [WORK, WORK, CARRY, MOVE];
const min = 1;
const ratio = 0.25;

module.exports = class RampartRepairer extends Role {
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

  static getCount(room) { return Role.count({ role: RampartRepairer, room }); }

  static getCreeps(room) { return Role.getCreeps({ role: RampartRepairer, room }); }

  static nextSerial() { return Role.nextSerial({ role: RampartRepairer }); }

  static getStatus(room) { return Role.getStatus({ role: RampartRepairer, room }); }

  static getPercentage(room) { return Role.getPercentage({ role: RampartRepairer, room }); }

  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: RampartRepairer, room, percOverride }); }

  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: RampartRepairer, room, minOverride }); }

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
