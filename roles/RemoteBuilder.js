const Role = require('./Role');
const RoleType = require('./RoleType');
const Harvester = require('./Harvester');
const helpers = require('../utils/helpers');
const Logger = require('../utils/Logger');

const name = 'RemoteBuilder';
const type = RoleType.Remote;
const body = [WORK, WORK, CARRY, MOVE];
const min = 2;
const ratio = undefined;

module.exports = class RemoteBuilder extends Role {
  static get name() {
    return name;
  }

  static get type() {
    return type;
  }

  static get body() {
    return body;
  }

  static get min() {
    return min;
  }

  static get ratio() {
    return ratio;
  }

  static getCount(room) { return Role.count({ role: RemoteBuilder, room }); }

  static getCreeps(room) { return Role.getCreeps({ role: RemoteBuilder, room }); }

  static nextSerial() { return Role.nextSerial({ role: RemoteBuilder }); }

  static getStatus(room) { return Role.getStatus({ role: RemoteBuilder, room }); }

  static getPercentage(room) { return Role.getPercentage({ role: RemoteBuilder, room }); }

  static lessThanPerc(room, percOverride) { return Role.lessThanPerc({ role: RemoteBuilder, room, percOverride }); }

  static lessThanMin(room, minOverride) { return Role.lessThanMin({ role: RemoteBuilder, room, minOverride }); }

  static run(creep) {
    // do we need to change our primary goal?
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false; // harvest energy from source
    } else if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true; // build construction site
    }

    if (!creep.memory.working) {
      // don't do anything until you're in the target room
      if (creep.memory.target && creep.room.name !== creep.memory.target) {
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
        return;
      }

      // TODO : should we refactor this dropped energy thing to be an option for all remote roles until we have a concept of a remote janitor????
      const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: helpers.isResourceEnergy });
      if (droppedEnergy) {
        if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedEnergy);
        } else {
          Logger.info(`${creep.name} found ${droppedEnergy.energy} energy at ${droppedEnergy.pos}`);
        }
      } else {
        creep.getEnergy(['source']);
      }
    } else {
      const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, { filter: helpers.isSpawnOrRoad });
      if (constructionSite) {
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
      } else {
        Harvester.run(creep);
      }
    }
  }
};
