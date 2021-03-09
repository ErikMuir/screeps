const Role = require('./Role');
const RoleType = require('./RoleType');
const helpers = require('../utils/helpers');

const name = 'Lorry';
const type = RoleType.Specialized;
const body = [WORK, WORK, MOVE];
const min = 0;
const ratio = undefined;

module.exports = class Lorry extends Role {
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
  static getCount(room) { return Role.count({ role: Lorry, room }); }

  /** @param {Room} room */
  static getCreeps(room) { return Role.getCreeps({ role: Lorry, room }); }

  static nextSerial() { return Role.nextSerial({ role: Lorry }); }

  /** @param {Room} room */
  static getStatus(room) { return Role.getStatus({ role: Lorry, room }); }

  /** @param {Room} room */
  static getPercentage(room) { return Role.getPercentage({ role: Lorry, room }); }

  /**
   * @param {Room} room
   * @param {Number} percOverride
   * */
  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: Lorry, room, percOverride }); }

  /**
   * @param {Room} room
   * @param {Number} minOverride
   * */
  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: Lorry, room, minOverride }); }

  /** @param {Creep} creep */
  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // pick up energy
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // deliver energy
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container']);
    } else {
      const includeContainers = false;
      const structure = helpers.getClosestStructureNeedingEnergy(creep, includeContainers);
      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      }
    }
  }
};
