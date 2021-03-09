const Role = require('./Role');
const RoleType = require('./RoleType');

const name = 'Claimer';
const type = RoleType.Remote;
const body = [CLAIM, MOVE, MOVE];
const min = 0;
const ratio = undefined;

module.exports = class Claimer extends Role {
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
  static getCount(room) { return Role.count({ role: Claimer, room }); }

  /** @param {Room} room */
  static getCreeps(room) { return Role.getCreeps({ role: Claimer, room }); }

  static nextSerial() { return Role.nextSerial({ role: Claimer }); }

  /** @param {Room} room */
  static getStatus(room) { return Role.getStatus({ role: Claimer, room }); }

  /** @param {Room} room */
  static getPercentage(room) { return Role.getPercentage({ role: Claimer, room }); }

  /**
   * @param {Room} room
   * @param {Number} percOverride
   * */
  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: Claimer, room, percOverride }); }

  /**
   * @param {Room} room
   * @param {Number} minOverride
   * */
  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: Claimer, room, minOverride }); }

  /** @param {Creep} creep */
  static run(creep) {
    if (creep.room.name !== creep.memory.target) {
      const exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
    } else if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  }
};
