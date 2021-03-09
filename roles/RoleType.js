/** @class */
module.exports = class RoleType {
  /**
   * @static
   * @returns {String}
   * */
  static get None() { return 'None'; }

  /**
   * @static
   * @returns {String}
   * */
  static get Specialized() { return 'Specialized'; }

  /**
   * @static
   * @returns {String}
   * */
  static get Primary() { return 'Primary'; }

  /**
   * @static
   * @returns {String}
   * */
  static get Secondary() { return 'Secondary'; }

  /**
   * @static
   * @returns {String}
   * */
  static get Remote() { return 'Remote'; }

  /**
   * @static
   * @function getCreeps
   * @param {Object} params
   * @param {Role} params.role
   * @param {Room} params.room
   * @returns {Creep[]}
   */
  static getCreeps({ role, room }) {
    return Object
      .keys(Game.creeps)
      .filter(key => {
        const creep = Game.creeps[key];
        if (room && creep.room.name !== room) return false;
        if (role && creep.role.name !== role.name) return false;
        return true;
      })
      .map(key => Game.creeps[key]);
  }

  /**
   * @static
   * @function getCount
   * @param {Object} params
   * @param {Role} params.role
   * @param {Room} params.room
   * @returns {Number}
   */
  static getCount({ role, room }) {
    return RoleType.getCreeps({ role, room }).length;
  }
};
