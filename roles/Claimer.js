const Role = require('./Role');
const RoleType = require('./RoleType');

module.exports = class Claimer extends Role {
  constructor() {
    const name = 'Claimer';
    const type = RoleType.Remote;
    const body = [CLAIM, MOVE, MOVE];
    const min = 0;
    super({ name, type, body, min });
  }

  static run(creep) {
    if (creep.room.name !== creep.memory.target) {
      const exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
    } else if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  }
};
