const Role = require('./Role');
const RoleType = require('./RoleType');

const roleName = 'Claimer';

module.exports = class Claimer extends Role {
  static get roleName() {
    return roleName;
  }

  static get roleType() {
    return RoleType.Remote;
  }

  static get roleBody() {
    return [CLAIM, MOVE, MOVE];
  }

  static get roleMin() {
    return 0;
  }

  static get roleRatio() {
    return undefined;
  }

  static getCount = room => Role.count({ roleName, room });

  static getCreeps = room => Role.getCreeps({ roleName, room });

  static nextSerial = () => Role.nextSerial(roleName);

  static run(creep) {
    if (creep.room.name !== creep.memory.target) {
      const exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
    } else if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  }
};
