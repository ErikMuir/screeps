const Role = require('./Role');
const RoleType = require('./RoleType');
const Logger = require('../utils/Logger');

const name = 'Attacker';
const type = RoleType.Specialized;
const body = [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
const min = 1;
const ratio = undefined;

/**
 * @class
 * @implements {Role}
 */
module.exports = class Attacker extends Role {
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
  static getCount(room) { return Role.count({ role: Attacker, room }); }

  /** @param {Room} room */
  static getCreeps(room) { return Role.getCreeps({ role: Attacker, room }); }

  static nextSerial() { return Role.nextSerial({ role: Attacker }); }

  /** @param {Room} room */
  static getStatus(room) { return Role.getStatus({ role: Attacker, room }); }

  /** @param {Room} room */
  static getPercentage(room) { return Role.getPercentage({ role: Attacker, room }); }

  /**
   * @param {Room} room
   * @param {Number} percOverride
   * */
  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: Attacker, room, percOverride }); }

  /**
   * @param {Room} room
   * @param {Number} minOverride
   * */
  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: Attacker, room, minOverride }); }

  /** @param {Creep} creep */
  static run(creep) {
    if (creep.memory.target) {
      // make sure we're in our target room
      if (creep.room.name !== creep.memory.target) {
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        return;
      }

      // move away from the edges
      // (there was weird behavior where they would keep entering and leaving the room over and over)
      if (creep.pos.x === 0 || creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
        creep.moveTo(new RoomPosition(25, 25, creep.memory.target));
      }
    }

    // OVERRIDE SECTION /////////////////////////
    // if (creep.name === 'attacker2' || creep.name === 'attacker3') {
    //     const enemy = Game.getObjectById('596bbcf20c3cb05f4556abf3');
    //     if (enemy) {
    //         if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(enemy);
    //             return;
    //         }
    //     }
    // }

    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length) {
      if (creep.attack(enemies[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(enemies[0]);
      } else {
        Logger.info(`${creep.name} just attacked enemy creep: ${enemies[0]}`);
      }
    }
  }
};
