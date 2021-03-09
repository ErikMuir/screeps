const roles = require('../roles');
const Role = require('../roles/Role');
const RoleType = require('../roles/RoleType');
const { tickMessages } = require('../utils/globals');
const helpers = require('../utils/helpers');
const Logger = require('../utils/Logger');

/** @constant {Role[]} allRoles */
const allRoles = Object.keys(roles).map(key => roles[key]);

/** @constant {Role[]} primaryRoles */
const primaryRoles = allRoles.filter(role => role.type === RoleType.Primary);

/** @constant {Role[]} secondaryRoles */
const secondaryRoles = allRoles.filter(role => role.type === RoleType.Secondary);

/** @constant {Role[]} remoteRoles */
const remoteRoles = allRoles.filter(role => role.type === RoleType.Remote);

/** @constant {Role[]} specializedRoles */
const specializedRoles = allRoles.filter(role => role.type === RoleType.Specialized);

StructureSpawn.prototype.primaryMin = undefined;
StructureSpawn.prototype.permanentRole = undefined;
StructureSpawn.prototype.overrideRole = undefined;
StructureSpawn.prototype.createJanitors = false;
StructureSpawn.prototype.createAttackers = false;
StructureSpawn.prototype.createMiners = false;
StructureSpawn.prototype.createRemoteHarvesters = false;
StructureSpawn.prototype.createRemoteBuilders = false;
StructureSpawn.prototype.usePercentages = false;

/**
 * @function spawnCreepsIfNecessary
 * @returns {undefined}
 */
StructureSpawn.prototype.spawnCreepsIfNecessary = function spawnCreepsIfNecessary() {
  const room = this.room.name;
  let name;
  let energy;

  const wallTypeStructures = this.room.find(FIND_STRUCTURES, { filter: helpers.isWallOrRampart });
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
  // this.permanentRole = roles.Janitor;
  // this.overrideRole = roles.Janitor;
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
      const sourceId = source.id;
      const containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: helpers.isContainer });
      containerCount = containers.length;

      containers.forEach(container => {
        const containerId = container.id;
        const minerAlreadyExists = Game.creeps
          .find(c => c.memory.role === roles.Miner
            && c.memory.sourceId === sourceId
            && c.memory.containerId === containerId);

        if (minerAlreadyExists) return;

        tickMessages[this.name] += Logger.getSpawnAttemptMessage(roles.Miner);
        name = this.createMiner({ sourceId, containerId });
      });
    });

    // lorries
    if (!name && roles.Lorry.getCount(room) < containerCount / 2) {
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(roles.Lorry);
      name = this.createCustomCreep(energy, roles.Lorry);
    }
  }

  // janitors
  if (!name && this.createJanitors) {
    if (roles.Janitor.lessThanMin(room)) {
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(roles.Janitor);
      name = this.createCustomCreep(energy, roles.Janitor);
    }
  }

  // attackers
  if (!name && this.createAttackers) {
    if (roles.Attacker.lessThanMin(room)) {
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(roles.Attacker);
      name = this.createCustomCreep(this.room.energyCapacityAvailable, roles.Attacker);
    }
  }

  // remoteHarvesters
  if (!name && this.createRemoteHarvesters) {
    if (roles.RemoteHarvester.lessThanMin(room)) {
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(roles.RemoteHarvester);
      name = this.createCustomCreep(energy, roles.RemoteHarvester);
    }
  }

  // remoteBuilders
  if (!name && this.createRemoteBuilders) {
    if (roles.RemoteBuilder.lessThanMin(room)) {
      // TODO : this is a bug. the count of remoteBuilders for a room will be 0 if they're already remote.
      tickMessages[this.name] += Logger.getSpawnAttemptMessage(roles.RemoteBuilder);
      name = this.createCustomCreep(energy, roles.RemoteBuilder);
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
    tickMessages[this.name] += helpers.returnCode(name);
    Logger.info(tickMessages[this.name]);
  }
};

/**
 * @function createCustomCreep
 * @param {Number} energy
 * @param {Role} role
 * @returns {ScreepsReturnCode}
 */
StructureSpawn.prototype.createCustomCreep = function createCustomCreep(energy, role) {
  switch (role) {
    case roles.Lorry:
      return this.createLorry(energy);
    case roles.Janitor:
      return this.createJanitor(energy);
    case roles.Attacker:
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

  const nextSerial = role.nextSerial();
  const memory = {
    role,
    working: false,
    serial: nextSerial,
  };
  return this.spawnCreep(body, `${role.name}${nextSerial}`, { memory });
};

/**
 * @function createLorry
 * @param {Number} energy
 * @returns {ScreepsReturnCode}
 */
StructureSpawn.prototype.createLorry = function createLorry(energy) {
  const role = roles.Lorry;
  const body = [];
  const numberOfParts = Math.min(Math.floor(energy / 150), Math.floor(50 / 3));

  for (let i = 0; i < numberOfParts; i += 1) {
    body.push(MOVE);
  }
  for (let i = 0; i < numberOfParts * 2; i += 1) {
    body.push(CARRY);
  }

  if (!body.length) return ERR_NOT_ENOUGH_ENERGY;

  const nextSerial = role.nextSerial();
  const memory = {
    role,
    working: false,
    serial: nextSerial,
  };
  return this.spawnCreep(body, `${role.name}${nextSerial}`, { memory });
};

/**
 * @function createJanitor
 * @param {Number} energy
 * @returns {ScreepsReturnCode}
 */
StructureSpawn.prototype.createJanitor = function createJanitor(energy) {
  const role = roles.Janitor;
  const body = [];
  const numberOfParts = Math.min(Math.floor(energy / 150), Math.floor(50 / 3));

  for (let i = 0; i < numberOfParts; i += 1) {
    body.push(MOVE);
  }
  for (let i = 0; i < numberOfParts * 2; i += 1) {
    body.push(CARRY);
  }

  if (!body.length) return ERR_NOT_ENOUGH_ENERGY;

  const nextSerial = role.nextSerial();
  const memory = {
    role,
    working: false,
    serial: nextSerial,
  };
  return this.spawnCreep(body, `${role.name}${nextSerial}`, { memory });
};

/**
 * @function createAttacker
 * @param {Number} energy
 * @returns {ScreepsReturnCode}
 */
StructureSpawn.prototype.createAttacker = function createAttacker(energy) {
  const role = roles.Attacker;
  const body = [];
  const numberOfParts = Math.min(Math.floor(energy / 210), Math.floor(50 / 3));

  for (let i = 0; i < numberOfParts; i += 1) {
    body.push(MOVE);
  }
  for (let i = 0; i < numberOfParts * 2; i += 1) {
    body.push(ATTACK);
  }

  if (!body.length) return ERR_NOT_ENOUGH_ENERGY;

  const nextSerial = role.nextSerial();
  const memory = {
    role,
    working: false,
    serial: nextSerial,
  };
  return this.spawnCreep(body, `${role.name}${nextSerial}`, { memory });
};

/**
 * @function createMiner
 * @param {Object} params
 * @param {string} params.sourceId
 * @param {string} params.containerId
 * @returns {ScreepsReturnCode}
 */
StructureSpawn.prototype.createMiner = function createMiner({ sourceId, containerId }) {
  const role = roles.Miner;
  const nextSerial = role.nextSerial();
  const memory = {
    role,
    working: false,
    serial: nextSerial,
    sourceId,
    containerId,
  };
  return this.spawnCreep(role.body, `${role.name}${nextSerial}`, { memory });
};

/**
 * @function createClaimer
 * @param {string} target
 * @returns {ScreepsReturnCode}
 * */
StructureSpawn.prototype.createClaimer = function createClaimer(target) {
  const role = roles.Claimer;
  const nextSerial = role.nextSerial();
  const memory = {
    role,
    working: false,
    serial: nextSerial,
    target,
  };
  return this.spawnCreep(role.body, `${role.name}${nextSerial}`, { memory });
};

/**
 * @function newCreep - keeping this around for easy console use
 * @param {Role} role
 * @param {BodyPartConstant[]} theBody
 * @returns {ScreepsReturnCode}
 * */
StructureSpawn.prototype.newCreep = function newCreep(role, theBody) {
  const body = theBody || role.body;
  const nextSerial = role.nextSerial();
  const memory = {
    role,
    working: false,
    serial: nextSerial,
  };
  return this.spawnCreep(body, `${role.name}${nextSerial}`, { memory });
};

/**
 * @function roleStatus
 * @param {Role} role
 * @returns {String}
 * */
StructureSpawn.prototype.roleStatus = function roleStatus(role) {
  const separater = ' | ';
  const theRoles = role ? [role] : [...primaryRoles, ...secondaryRoles, ...remoteRoles, ...specializedRoles];
  let status = `${this.room} ${this}`;
  theRoles.forEach(r => { status += `${Role.getStatus(r, this.room.name)}${separater}`; });
  return status;
};

/**
 * @function avgCreepSize
 * @returns {Number}
 * */
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

/**
 * @function energyStatus
 * @returns {undefined}
 * */
StructureSpawn.prototype.energyStatus = function energyStatus() {
  const level = this.room.energyAvailable;
  const capacity = this.room.energyCapacityAvailable;
  Logger.info(`[${level}/${capacity}]`);
};
