const RoleType = require('./RoleType');

module.exports = class Role {
  constructor() {
    if (this instanceof Role) {
      throw new Error('Roles cannot be instantiated.');
    }
  }

  static getCreeps = ({ role, room }) =>
    Game.creeps.filter(c => (!room || room === c.room.name) && (!role.name || role.name === c.role.name));

  static getCount = ({ role, room }) =>
    Role.getCreeps({ role, room }).length;

  static nextSerial = ({ role }) => {
    const serials = Role.getCreeps({ role }).map(c => parseInt(c.memory.serial) || 0);
    const lastSerial = serials.length ? Math.max(...serials) : 0
    return lastSerial + 1;
  }

  static getStatus = ({ role, room }) =>
    `${role.name}: ${Role.getCount({ role, room })}/${role.min}`;

  static getPercentage = ({ role, room }) => {
    const roleCount = Role.getCount({ role, room });
    const typeCount = RoleType.getCount({ role, room });
    return roleCount / typeCount;
  }

  static lessThanPerc = ({ role, room, percOverride }) =>
    Role.getPercentage({ role, room }) < (percOverride || role.ratio || 0);
  
  static lessThanMin = ({ role, room, minOverride }) =>
    Role.getCount({ role, room }) < (minOverride || role.min || 0);
};
