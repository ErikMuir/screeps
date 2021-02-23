const Role = require('./Role');
const RoleType = require('./RoleType');

module.exports = class Harvester extends Role {
  constructor() {
    const roleType = RoleType.Primary;
    const body = [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    const min = 1;
    const targetPerc = 0.25;
    super({ roleType, body, min, targetPerc });
  }
};
