module.exports = {
  harvester: {
    roleType: 1,
    body: [WORK, WORK, CARRY, MOVE],
    min: 1,
    targetPerc: 0.25,
  },
  upgrader: {
    roleType: 1,
    body: [WORK, CARRY, MOVE, MOVE],
    min: 1,
    targetPerc: 0.25,
  },
  builder: {
    roleType: 1,
    body: [WORK, WORK, CARRY, MOVE],
    min: 1,
    targetPerc: 0.25,
  },
  repairer: {
    roleType: 1,
    body: [WORK, WORK, CARRY, MOVE],
    min: 1,
    targetPerc: 0.25,
  },
  wallRepairer: {
    roleType: 2,
    body: [WORK, WORK, CARRY, MOVE],
    min: 1,
    targetPerc: 0.25,
  },
  rampartRepairer: {
    roleType: 2,
    body: [WORK, WORK, CARRY, MOVE],
    min: 1,
    targetPerc: 0.75,
  },
  claimer: {
    roleType: 3,
    body: [CLAIM, MOVE, MOVE],
    min: 0,
    targetPerc: undefined,
  },
  remoteHarvester: {
    roleType: 3,
    body: [WORK, WORK, CARRY, MOVE],
    min: 2,
    targetPerc: undefined,
  },
  remoteBuilder: {
    roleType: 3,
    body: [WORK, WORK, CARRY, MOVE],
    min: 2,
    targetPerc: undefined,
  },
  janitor: {
    roleType: 0,
    body: [CARRY, CARRY, MOVE],
    min: 1,
    targetPerc: undefined,
  },
  attacker: {
    roleType: 0,
    body: [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE],
    min: 1,
    targetPerc: undefined,
  },
  miner: {
    roleType: 0,
    body: [WORK, WORK, WORK, WORK, WORK, MOVE],
    min: 0,
    targetPerc: undefined,
  },
  lorry: {
    roleType: 0,
    body: [CARRY, CARRY, MOVE],
    min: 0,
    targetPerc: undefined,
  },
  count(role, room) {
    return _.sum(
      Game.creeps,
      c => (role === undefined || c.memory.role === role) && (room === undefined || c.room.name === room)
    );
  },
  creeps(role, room) {
    return _.filter(Game.creeps, c => c.memory.role === role && (room === undefined || c.room.name === room));
  },
  nextSerial(role) {
    return this.count(role) === 0 ? 1 : _.max(this.creeps(role).map(c => parseInt(c.memory.serial) || 0)) + 1;
  },
  status(role, room) {
    return `${role}: ${this.count(role, room)}/${this[role].min}`;
  },
  percentage(role, room) {
    return this.count(role, room) / _.sum(Game.creeps, c => c.memory.roleType === this[role].roleType);
  },
  lessThanPerc(role, room, percOverride) {
    return this.percentage(role, room) < (percOverride || this[role].targetPerc || 0);
  },
  lessThanMin(role, room, minOverride) {
    return this.count(role, room) < (minOverride || this[role].min);
  },
};
