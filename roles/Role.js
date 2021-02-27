module.exports = class Role {
  constructor(params) {
    const { roleName, roleType, roleBody, roleMin, roleRatio } = params;
    this.roleName = roleName;
    this.roleType = roleType;
    this.roleBody = roleBody;
    this.roleMin = roleMin;
    this.roleRatio = roleRatio;
  }

  get roleName() {
    return this.roleName;
  }

  get roleType() {
    return this.roleType;
  }

  get roleBody() {
    return this.roleBody;
  }

  get roleMin() {
    return this.roleMin;
  }

  get roleRatio() {
    return this.roleRatio;
  }

  static run() {
    throw new Error('You have to implement the run method!');
  }

  static count() {
    throw new Error('You have to implement the run method!');
    return _.sum(
      Game.creeps,
      c => (role === undefined || c.memory.role === role) && (room === undefined || c.room.name === room)
    );
  }
};
