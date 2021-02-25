/* eslint-disable no-console */
module.exports = class Logger {
  static info(str) {
    console.log(str);
  }

  static getSpawnAttemptMessage(role) {
    return `attempting to create a new ${role.name} creep ... `;
  }
};
