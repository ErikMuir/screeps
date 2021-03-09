const RoleType = require('./RoleType');

module.exports = class Role {
  constructor() {
    if (this instanceof Role) {
      throw new Error('Roles cannot be instantiated.');
    }
  }

  /**
   * @static
   * @abstract
   * @return {String}
   */
  static get name() {
    throw new Error('not implemented');
  }

  /**
   * @static
   * @abstract
   * @return {RoleType}
   */
  static get type() {
    throw new Error('not implemented');
  }

  /**
   * @static
   * @abstract
   * @return {BodyPartConstant[]}
   */
  static get body() {
    throw new Error('not implemented');
  }

  /**
   * @static
   * @abstract
   * @return {Number}
   */
  static get min() {
    throw new Error('not implemented');
  }

  /**
   * @static
   * @abstract
   * @return {Number}
   */
  static get ratio() {
    throw new Error('not implemented');
  }

  /**
   * @static
   * @abstract
   * @function run
   * @return {undefined}
   */
  static run() {
    throw new Error('not implemented');
  }

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
    return Role.getCreeps({ role, room }).length;
  }

  /**
   * @static
   * @function nextSerial
   * @param {Object} params
   * @param {Role} params.role
   * @returns {Number}
   */
  static nextSerial({ role }) {
    const serials = Role.getCreeps({ role }).map(c => parseInt(c.memory.serial) || 0);
    const lastSerial = serials.length ? Math.max(...serials) : 0;
    return lastSerial + 1;
  }

  /**
   * @static
   * @function getStatus
   * @param {Object} params
   * @param {Role} params.role
   * @param {Room} params.room
   * @returns {String}
   */
  static getStatus({ role, room }) {
    return `${role.name}: ${Role.getCount({ role, room })}/${role.min}`;
  }

  /**
   * @static
   * @function getPercentage
   * @param {Object} params
   * @param {Role} params.role
   * @param {Room} params.room
   * @returns {Number}
   */
  static getPercentage({ role, room }) {
    const roleCount = Role.getCount({ role, room });
    const typeCount = RoleType.getCount({ role, room });
    return roleCount / typeCount;
  }

  /**
   * @static
   * @function lessThanPerc
   * @param {Object} params
   * @param {Role} params.role
   * @param {Room} params.room
   * @param {Number} params.percOverride
   * @returns {Boolean}
   */
  static lessThanPerc({ role, room, percOverride }) {
    return Role.getPercentage({ role, room }) < (percOverride || role.ratio || 0);
  }

  /**
   * @static
   * @function lessThanMin
   * @param {Object} params
   * @param {Role} params.role
   * @param {Room} params.room
   * @param {Number} params.minOverride
   * @returns {Boolean}
   */
  static lessThanMin({ role, room, minOverride }) {
    return Role.getCount({ role, room }) < (minOverride || role.min || 0);
  }
};
