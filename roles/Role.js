module.exports = class Role {
  constructor(params) {
    const { roleType, body, min, targetPerc } = params;

    this.roleType = roleType;
    this.body = body;
    this.min = min;
    this.targetPerc = targetPerc;
  }

  get roleType() {
    return this.roleType;
  }

  get body() {
    return this.body;
  }

  get min() {
    return this.min;
  }

  get targetPerc() {
    return this.targetPerc;
  }

  // eslint-disable-next-line class-methods-use-this
  run() {
    throw new Error('You have to implement the run method!');
  }
};
