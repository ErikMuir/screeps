const Role = require('./Role');

module.exports = class Attacker extends Role {
  constructor() {
    const roleType = 0;
    const body = [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    const min = 1;
    super({ roleType, body, min });
  }
};
