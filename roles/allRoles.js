const Harvester = require('./Harvester');
const Upgrader = require('./Upgrader');
const Builder = require('./Builder');
const Repairer = require('./Repairer');
const WallRepairer = require('./WallRepairer');
const RampartRepairer = require('./RampartRepairer');
const Claimer = require('./Claimer');
const Attacker = require('./Attacker');

module.exports = [
  Harvester,
  Upgrader,
  Builder,
  Repairer,
  WallRepairer,
  RampartRepairer,
  Claimer,
  Attacker,
];
