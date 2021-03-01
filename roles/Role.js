module.exports = class Role {
  constructor() {
    if (this instanceof Role) {
      throw new Error('Roles cannot be instantiated.');
    }
  }

  static getCreeps = ({ roleName, room }) => Game.creeps
    .filter(c => (!room || room === c.room.name) && (!roleName || roleName === c.roleName));

  static getCount = ({ roleName, room }) => Role.getCreeps({ roleName, room }).length;

  static nextSerial = roleName => {
    if (!roleName) throw new Error('Role.nextSerial: roleName is required');
    const serials = Role.getCreeps({ roleName }).map(c => parseInt(c.memory.serial) || 0);
    const lastSerial = serials.length ? Math.max(...serials) : 0
    return lastSerial + 1;
  }
};
