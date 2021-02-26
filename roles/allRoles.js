const Harvester = require('./Harvester');
const Upgrader = require('./Upgrader');
const Builder = require('./Builder');
const Repairer = require('./Repairer');
const WallRepairer = require('./WallRepairer');
const RampartRepairer = require('./RampartRepairer');
const Claimer = require('./Claimer');
const RemoteHarvester = require('./RemoteHarvester');
const RemoteBuilder = require('./RemoteBuilder');
const Janitor = require('./Janitor');
const Attacker = require('./Attacker');
const Miner = require('./Miner');
const Lorry = require('./Lorry');

module.exports = [
  Harvester,
  Upgrader,
  Builder,
  Repairer,
  WallRepairer,
  RampartRepairer,
  Claimer,
  RemoteHarvester,
  RemoteBuilder,
  Janitor,
  Attacker,
  Miner,
  Lorry,
];
