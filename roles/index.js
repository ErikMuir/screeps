const RoleType = require('./RoleType');
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

const allRoles = [
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

const primaryRoles = allRoles.filter(r => r.type === RoleType.Primary);
const secondaryRoles = allRoles.filter(r => r.type === RoleType.Secondary);
const remoteRoles = allRoles.filter(r => r.type === RoleType.Remote);
const specializedRoles = allRoles.filter(r => r.type === RoleType.Specialized);

module.exports = {
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
  allRoles,
  primaryRoles,
  secondaryRoles,
  remoteRoles,
  specializedRoles,
};
