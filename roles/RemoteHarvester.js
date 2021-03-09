const Role = require('./Role');
const RoleType = require('./RoleType');
const helpers = require('../utils/helpers');

const name = 'RemoteHarvester';
const type = RoleType.Remote;
const body = [WORK, WORK, CARRY, MOVE];
const min = 2;
const ratio = undefined;

module.exports = class RemoteHarvester extends Role {
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
  static getCount(room) { return Role.count({ role: RemoteHarvester, room }); }

  /** @param {Room} room */
  static getCreeps(room) { return Role.getCreeps({ role: RemoteHarvester, room }); }

  static nextSerial() { return Role.nextSerial({ role: RemoteHarvester }); }

  /** @param {Room} room */
  static getStatus(room) { return Role.getStatus({ role: RemoteHarvester, room }); }

  /** @param {Room} room */
  static getPercentage(room) { return Role.getPercentage({ role: RemoteHarvester, room }); }

  /**
   * @param {Room} room
   * @param {Number} percOverride
   * */
  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: RemoteHarvester, room, percOverride }); }

  /**
   * @param {Room} room
   * @param {Number} minOverride
   * */
  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: RemoteHarvester, room, minOverride }); }

  /** @param {Creep} creep */
  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // transfer energy to structure
    }

    if (!creep.memory.working) {
      if (creep.room.name === creep.memory.target) {
        const source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      } else {
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }
    } else if (creep.room.name !== creep.memory.home) {
      const exit = creep.room.findExitTo(creep.memory.home);
      creep.moveTo(creep.pos.findClosestByRange(exit));
    } else {
      const includeContainers = true;
      const structure = helpers.getClosestStructureNeedingEnergy(creep, includeContainers);
      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      }
    }
  }
};
