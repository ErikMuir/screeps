const Role = require('../roles/Role');
const returnCode = require('../utils/returnCode');
const { tickMessages } = require('../utils/globals');
const Logger = require('../utils/Logger');
const {
  Claimer,
  RemoteHarvester,
  RemoteBuilder,
  Janitor,
  Attacker,
  Miner,
  Lorry,
  // eslint-disable-next-line no-unused-vars
  allRoles,
  primaryRoles,
  secondaryRoles,
  remoteRoles,
  specializedRoles,
} = require('../roles');

StructureSpawn.prototype.primaryMin = undefined;
StructureSpawn.prototype.permanentRole = undefined;
StructureSpawn.prototype.overrideRole = undefined;
StructureSpawn.prototype.createJanitors = false;
StructureSpawn.prototype.createAttackers = false;
StructureSpawn.prototype.createMiners = false;
StructureSpawn.prototype.createRemoteHarvesters = false;
StructureSpawn.prototype.createRemoteBuilders = false;
StructureSpawn.prototype.usePercentages = false;

// spawnCreepsIfNecessary
StructureSpawn.prototype.spawnCreepsIfNecessary = function spawnCreepsIfNecessary() {
  const room = this.room.name;
  let name;
  let energy;

  const wallRampartFilter = s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART;
  const wallTypeStructures = this.room.find(FIND_STRUCTURES, { filter: wallRampartFilter });
  const createSecondaryRoles = wallTypeStructures.length > 0;

  let primaryMinimumsMet = true;
  primaryRoles.forEach(role => {
    if (role.lessThanMin({ room })) primaryMinimumsMet = false;
  });
  // eslint-disable-next-line prefer-const
  energy = primaryMinimumsMet
    ? this.room.energyCapacityAvailable
    : this.room.energyAvailable;

  // ------------ SETTINGS OVERRIDES ---------------------------------------------------------
  this.primaryMin = 3;
  // this.permanentRole = Janitor;
  // this.overrideRole = Janitor;
  this.createJanitors = primaryMinimumsMet; // true;
  this.createAttackers = primaryMinimumsMet; // true;
  this.createMiners = primaryMinimumsMet; // true;
  // this.createRemoteHarvesters = true;
  // this.createRemoteBuilders = true;
  // this.usePercentages = true;
  // energy = this.room.energyAvailable;
  // energy = this.room.energyCapacityAvailable;

  // ------------ ROLE OVERRIDE --------------------------------------------------------------
  if (!name && this.overrideRole) {
    tickMessages[this.name] += Logger.getSpawnAttemptMessage(this.overrideRole);
    name = this.createCustomCreep(energy, this.overrideRole);
  }

  // ------------ SPECIALIZED ROLES ----------------------------------------------------------

  // miners & lorries
  if (!name && this.createMiners && this.room.energyCapacityAvailable >= 550) {
    const sources = this.room.find(FIND_SOURCES);
    let containerCount;

    // miners
    sources.forEach(source => {
      if (name) return;
      const filter = s => s.structureType === STRUCTURE_CONTAINER;
      const containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter });
      containerCount = containers.length;
      containers.forEach(container => {
        const minerAlreadyExists = Game.creeps
          .find(c => c.memory.role === Miner
            && c.memory.sourceId === source.id
            && c.memory.containerId === container.id);
        if (!minerAlreadyExists) {
          tickMessages[this.name] += Logger.getSpawnAttemptMessage(Miner);
          name = this.createMiner(source.id, container.id);
        }
      });
    });

    // lorries
    if (!name && Lorry.getCount(room) < containerCount / 2) {
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(Lorry);
      name = this.createCustomCreep(energy, Lorry);
    }
  }

  // janitors
  if (!name && this.createJanitors) {
    if (Janitor.lessThanMin(room)) {
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(Janitor);
      name = this.createCustomCreep(energy, Janitor);
    }
  }

  // attackers
  if (!name && this.createAttackers) {
    if (Attacker.lessThanMin(room)) {
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(Attacker);
      name = this.createCustomCreep(this.room.energyCapacityAvailable, Attacker);
    }
  }

  // remoteHarvesters
  if (!name && this.createRemoteHarvesters) {
    if (RemoteHarvester.lessThanMin(room)) {
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(RemoteHarvester);
      name = this.createCustomCreep(energy, RemoteHarvester);
    }
  }

  // remoteBuilders
  if (!name && this.createRemoteBuilders) {
    if (RemoteBuilder.lessThanMin(room)) {
      // TODO : this is a bug. the count of remoteBuilders for a room will be 0 if they're already remote.
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(RemoteBuilder);
      name = this.createCustomCreep(energy, RemoteBuilder);
    }
  }

  // ------------ PRIMARY ROLES --------------------------------------------------------------
  if (!name) {
    primaryRoles.forEach(role => {
      if (name) return;
      const lessThanMin = Role.lessThanMin(role, room, this.primaryMin);
      const lessThanPerc = Role.lessThanPerc(role, room);
      if (!lessThanMin && (!lessThanPerc || !this.usePercentages)) return;
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(role);
      name = this.createCustomCreep(energy, role);
    });
  }

  // ------------ SECONDARY ROLES -----------------------------------------------------------------
  if (!name && createSecondaryRoles) {
    secondaryRoles.forEach(role => {
      if (name) return;
      const lessThanMin = Role.lessThanMin(role, room);
      const lessThanPerc = Role.lessThanPerc(role, room);
      if (!lessThanMin && (!lessThanPerc || !this.usePercentages)) return;
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(role);
      name = this.createCustomCreep(energy, role);
    });
  }

  // ------------ PERMANENT ROLE -------------------------------------------------------------
  if (!name && this.permanentRole) {
    tickMessages[this.name] += Logger.getSpawnAttemptMessage(this.permanentRole);
    name = this.createCustomCreep(energy, this.permanentRole);
  }

  // ------------ LOG ACTIVITY ---------------------------------------------------------------
  if (typeof name === 'string') {
    tickMessages[this.name] += name;
    Logger.info(tickMessages[this.name]);
    Logger.info(this.roleStatus());
  } else if (name) {
    tickMessages[this.name] += returnCode(name);
    Logger.info(tickMessages[this.name]);
  }
};

// createCustomCreep
StructureSpawn.prototype.createCustomCreep = function createCustomCreep(energy, role) {
  switch (role) {
    case Lorry:
      return this.createLorry(energy);
    case Janitor:
      return this.createJanitor(energy);
    case Attacker:
      return this.createAttacker(energy);
    default:
  }

  const body = [];
  const numberOfParts = Math.min(Math.floor(energy / 200), Math.floor(50 / 3));

  for (let i = 0; i < numberOfParts; i += 1) {
    body.push(WORK);
    body.push(CARRY);
    body.push(MOVE);
  }

  if (!body.length) return ERR_NOT_ENOUGH_ENERGY;

  const nextSerial = Role.nextSerial(role);
  return this.createCreep(body, `${role.name}${nextSerial}`, {
    role,
    working: false,
    serial: nextSerial,
  });
};

// createLorry
StructureSpawn.prototype.createLorry = function createLorry(energy) {
  const body = [];
  const numberOfParts = Math.min(Math.floor(energy / 150), Math.floor(50 / 3));

  for (let i = 0; i < numberOfParts; i += 1) {
    body.push(MOVE);
  }
  for (let i = 0; i < numberOfParts * 2; i += 1) {
    body.push(CARRY);
  }

  if (!body.length) return ERR_NOT_ENOUGH_ENERGY;

  const nextSerial = Lorry.nextSerial();
  return this.createCreep(body, `${Lorry.name}${nextSerial}`, {
    role: Lorry,
    working: false,
    serial: nextSerial,
  });
};

// createJanitor
StructureSpawn.prototype.createJanitor = function createJanitor(energy) {
  const body = [];
  const numberOfParts = Math.min(Math.floor(energy / 150), Math.floor(50 / 3));

  for (let i = 0; i < numberOfParts; i += 1) {
    body.push(MOVE);
  }
  for (let i = 0; i < numberOfParts * 2; i += 1) {
    body.push(CARRY);
  }

  if (!body.length) return ERR_NOT_ENOUGH_ENERGY;

  const nextSerial = Janitor.nextSerial();
  return this.createCreep(body, `${Janitor.name}${nextSerial}`, {
    role: Janitor,
    working: false,
    serial: nextSerial,
  });
};

// createAttacker
StructureSpawn.prototype.createAttacker = function createAttacker(energy) {
  const body = [];
  const numberOfParts = Math.min(Math.floor(energy / 210), Math.floor(50 / 3));

  for (let i = 0; i < numberOfParts; i += 1) {
    body.push(MOVE);
  }
  for (let i = 0; i < numberOfParts * 2; i += 1) {
    body.push(ATTACK);
  }

  if (!body.length) return ERR_NOT_ENOUGH_ENERGY;

  const nextSerial = Attacker.nextSerial();
  return this.createCreep(body, `${Attacker.name}${nextSerial}`, {
    role: Attacker,
    working: false,
    serial: nextSerial,
  });
};

// createMiner
StructureSpawn.prototype.createMiner = function createMiner(sourceId, containerId) {
  const nextSerial = Miner.nextSerial();
  return this.createCreep(Miner.body, `${Miner.name}${nextSerial}`, {
    role: Miner,
    working: false,
    serial: nextSerial,
    sourceId,
    containerId,
  });
};

// createClaimer
StructureSpawn.prototype.createClaimer = function createClaimer(target) {
  const nextSerial = Claimer.nextSerial();
  return this.createCreep(Claimer.body, `${Claimer.name}${nextSerial}`, {
    role: Claimer,
    working: false,
    serial: nextSerial,
    target,
  });
};

// newCreep
// -- keeping this around for easy console use
StructureSpawn.prototype.newCreep = function newCreep(role, theBody) {
  const body = theBody || Roles[role].body;
  const nextSerial = Role.nextSerial(role);
  return this.createCreep(body, `${role.name}${nextSerial}`, {
    role,
    working: false,
    serial: nextSerial,
  });
};

// roleStatus
StructureSpawn.prototype.roleStatus = function roleStatus(role) {
  const separater = ' | ';
  const theRoles = role ? [role] : [...primaryRoles, ...secondaryRoles, ...remoteRoles, ...specializedRoles];
  let status = `${this.room} ${this}`;
  theRoles.forEach(r => { status += `${Role.getStatus(r, this.room.name)}${separater}`; });
  return status;
};

// avgCreepSize
StructureSpawn.prototype.avgCreepSize = function avgCreepSize() {
  let totalSize = 0;
  const creeps = Object.keys(Game.creeps).map(key => Game.creeps[key]);
  creeps.forEach(creep => {
    creep.body.forEach(bodyPart => {
      totalSize += BODYPART_COST[bodyPart.type];
    });
  });
  return `Average creep size: ${Math.floor(totalSize / creeps.length)}`;
};

// energyStatus
StructureSpawn.prototype.energyStatus = function energyStatus() {
  const level = this.room.energyAvailable;
  const capacity = this.room.energyCapacityAvailable;
  Logger.info(`[${level}/${capacity}]`);
};
