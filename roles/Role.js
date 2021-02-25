module.exports = class Role {
  constructor(params) {
    const { name, type, body, min, targetPerc } = params;
    this.name = name;
    this.type = type;
    this.body = body;
    this.min = min;
    this.targetPerc = targetPerc;
  }

  get name() { return this.name; }

  get type() { return this.type; }

  get body() { return this.body; }

  get min() { return this.min; }

  get targetPerc() { return this.targetPerc; }

  static run() {
    throw new Error('You have to implement the run method!');
  }
};
