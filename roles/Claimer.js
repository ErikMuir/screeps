const Role = require('./Role');
const RoleType = require('./RoleType');

module.exports = class Claimer extends Role {
  constructor() {
    const roleName = 'Claimer';
    const roleType = RoleType.Remote;
    const roleBody = [CLAIM, MOVE, MOVE];
    const roleMin = 0;
    super({ roleName, roleType, roleBody, roleMin });
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
