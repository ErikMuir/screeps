const Role = require('./Role');
const RoleType = require('./RoleType');
const Builder = require('./Builder');
const helpers = require('../utils/helpers');

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

  /** @param {Room} room */
  static getCount(room) { return Role.count({ role: Repairer, room }); }

  /** @param {Room} room */
  static getCreeps(room) { return Role.getCreeps({ role: Repairer, room }); }

  static nextSerial() { return Role.nextSerial({ role: Repairer }); }

  /** @param {Room} room */
  static getStatus(room) { return Role.getStatus({ role: Repairer, room }); }

  /** @param {Room} room */
  static getPercentage(room) { return Role.getPercentage({ role: Repairer, room }); }

  /**
   * @param {Room} room
   * @param {Number} percOverride
   * */
  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: Repairer, room, percOverride }); }

  /**
   * @param {Room} room
   * @param {Number} minOverride
   * */
  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: Repairer, room, minOverride }); }

  /** @param {Creep} creep */
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
      const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: helpers.isDamagedStructure });
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
