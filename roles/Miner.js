const Role = require('./Role');
const RoleType = require('./RoleType');
const Logger = require('../utils/Logger');

const name = 'Miner';
const type = RoleType.Specialized;
const body = [WORK, WORK, WORK, WORK, WORK, MOVE];
const min = 0;
const ratio = undefined;

module.exports = class Miner extends Role {
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
  static getCount(room) { return Role.count({ role: Miner, room }); }

  /** @param {Room} room */
  static getCreeps(room) { return Role.getCreeps({ role: Miner, room }); }

  static nextSerial() { return Role.nextSerial({ role: Miner }); }

  /** @param {Room} room */
  static getStatus(room) { return Role.getStatus({ role: Miner, room }); }

  /** @param {Room} room */
  static getPercentage(room) { return Role.getPercentage({ role: Miner, room }); }

  /**
   * @param {Room} room
   * @param {Number} percOverride
   * */
  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: Miner, room, percOverride }); }

  /**
   * @param {Room} room
   * @param {Number} percOverride
   * */
  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: Miner, room, minOverride }); }

  /** @param {Creep} creep */
  static run(creep) {
    // get source
    const source = Game.getObjectById(creep.memory.sourceId);
    if (!source) {
      Logger.info(`${creep.name} could not find his source!`);
      return;
    }

    // get container
    const container = Game.getObjectById(creep.memory.containerId);
    if (!container) {
      Logger.info(`${creep.name} could not find his container!`);
      return;
    }

    if (creep.pos.isEqualTo(container.pos)) {
      creep.harvest(source);
    } else {
      creep.moveTo(container);
    }
  }
};
