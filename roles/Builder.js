const Role = require('./Role');
const RoleType = require('./RoleType');
const Upgrader = require('./Upgrader');

const name = 'Builder';
const type = RoleType.Primary;
const body = [WORK, WORK, CARRY, MOVE];
const min = 1;
const ratio = 0.25;

module.exports = class Builder extends Role {
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
  static getCount(room) { return Role.count({ role: Builder, room }); }

  /** @param {Room} room */
  static getCreeps(room) { return Role.getCreeps({ role: Builder, room }); }

  static nextSerial() { return Role.nextSerial({ role: Builder }); }

  /** @param {Room} room */
  static getStatus(room) { return Role.getStatus({ role: Builder, room }); }

  /** @param {Room} room */
  static getPercentage(room) { return Role.getPercentage({ role: Builder, room }); }

  /**
   * @param {Room} room
   * @param {Number} percOverride
   * */
  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: Builder, room, percOverride }); }

  /**
   * @param {Room} room
   * @param {Number} minOverride
   * */
  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: Builder, room, minOverride }); }

  /** @param {Creep} creep */
  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // complete a construction site
    }

    if (!creep.memory.working) {
      creep.getEnergy(['container', 'source']);
    } else {
      const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (constructionSite) {
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
      } else {
        Upgrader.run(creep);
      }
    }
  }
};
