/* eslint-disable no-console */
module.exports = class Logger {
  /** @param {string} str */
  static info(str) {
    console.log(str);
  }

  /** @param {Role} role */
  static getSpawnAttemptMessage(role) {
    return `attempting to create a new ${role.name} creep ... `;
  }
};
