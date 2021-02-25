const Role = require('./Role');
const RoleType = require('./RoleType');
const Logger = require('../utils/Logger');

module.exports = class Attacker extends Role {
  constructor() {
    const name = 'Attacker';
    const type = RoleType.Specialized;
    const body = [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    const min = 1;
    super({ name, type, body, min });
  }

  static run(creep) {
    if (creep.memory.target) {
      // make sure we're in our target room
      if (creep.room.name !== creep.memory.target) {
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        return;
      }

      // move away from the edges
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
