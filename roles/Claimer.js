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

  static getCount = room => Role.count({ role: Claimer, room });

  static getCreeps = room => Role.getCreeps({ role: Claimer, room });

  static nextSerial = () => Role.nextSerial({ role: Claimer });

  static getStatus = room => Role.getStatus({ role: Claimer, room });
  
  static getPercentage = room => Role.getPercentage({ role: Claimer, room });

  static lessThanPerc = (room, percOverride) => Role.lessThanPerc({ role: Claimer, room, percOverride });

  static lessThanMin = (room, minOverride) => Role.lessThanMin({ role: Claimer, room, minOverride });

  static run(creep) {
    if (creep.room.name !== creep.memory.target) {
      const exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
    } else if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  }
};
