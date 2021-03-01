module.exports = class RoleType {
  static get Specialized() { return 'Specialized'; }

  static get Primary() { return 'Primary'; }

  static get Secondary() { return 'Secondary'; }

  static get Remote() { return 'Remote'; }

  static getCreeps({ role, room }) {
    return Game.creeps.filter(c => (!room || room === c.room.name) && (role.type === c.role.type));
  }

  static getCount({ role, room }) {
    return RoleType.getCreeps({ role, room }).length;
  }
};
