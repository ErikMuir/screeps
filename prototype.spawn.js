var Roles = require('roles');
var Constants = require('constants');
var Globals = require('globals');
var primaryRoles = [
    'harvester',
    'upgrader',
    'builder',
    'repairer'
];
var secondaryRoles = [
    'wallRepairer',
    'rampartRepairer'
];
var specializedRoles = [
    'janitor',
    'attacker',
    'miner',
    'lorry'
];
var remoteRoles = [
    'claimer',
    'remoteHarvester',
    'remoteBuilder'
];

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
StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () {
        let room = this.room.name;
        let name = undefined;

        let wallTypeStructures = 
            this.room.find(FIND_STRUCTURES, { 
                filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART 
            });
        let createSecondaryRoles = wallTypeStructures.length > 0;

        let primaryMinimumsMet = true;
        _.forEach(primaryRoles, (role) => { 
            if (Roles.lessThanMin(role, room)) 
                primaryMinimumsMet = false; 
        });
        let energy = primaryMinimumsMet ? this.room.energyCapacityAvailable : this.room.energyAvailable;


        //------------ SETTINGS OVERRIDES ---------------------------------------------------------
        this.primaryMin = 3;
        //this.permanentRole = 'janitor'; 
        //this.overrideRole = 'janitor';
        this.createJanitors = primaryMinimumsMet; //true;
        this.createAttackers = primaryMinimumsMet; //true;
        this.createMiners = primaryMinimumsMet; //true; 
        //this.createRemoteHarvesters = true;
        //this.createRemoteBuilders = true;
        //this.usePercentages = true;
        //energy = this.room.energyAvailable;
        //energy = this.room.energyCapacityAvailable;


        //------------ ROLE OVERRIDE --------------------------------------------------------------
        if (name == undefined && typeof this.overrideRole === 'string') {
            Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", this.overrideRole);
            name = this.createCustomCreep(energy, this.overrideRole);
        }


        //------------ SPECIALIZED ROLES ----------------------------------------------------------

        // miners & lorries
        if (name == undefined && this.createMiners === true && this.room.energyCapacityAvailable >= 550) {
            let sources = this.room.find(FIND_SOURCES);
            let containerCount = 0;

            // miners
            for (let source of sources) {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, 
                    { filter: s => s.structureType == STRUCTURE_CONTAINER });
                for (let container of containers) {
                    containerCount++;
                    if (!_.some(Game.creeps, (c) => c.memory.role === 'miner' 
                                                    && c.memory.sourceId == source.id 
                                                    && c.memory.containerId == container.id)) 
                    {
                        Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", "miner");
                        name = this.createMiner(source.id, container.id);
                        break;
                    }
                }

                if (name != undefined) {
                    break;
                }
            }

            // lorries
            if (name == undefined && Roles.count('lorry', room) < (containerCount / 2)) {
                Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", "lorry");
                name = this.createCustomCreep(energy, 'lorry');
            }
        }

        // janitors
        if (name == undefined && this.createJanitors === true) {
            if (Roles.lessThanMin('janitor', room)) {
                Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", "janitor");
                name = this.createCustomCreep(energy, 'janitor');
            }
        }

        // attackers
        if (name == undefined && this.createAttackers === true) {
            if (Roles.lessThanMin('attacker', room)) {
                Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", "attacker");
                name = this.createCustomCreep(this.room.energyCapacityAvailable, 'attacker');
            }
        }

        // remoteHarvesters
        if (name == undefined && this.createRemoteHarvesters === true) {
            if (Roles.lessThanMin('remoteHarvester', room)) {
                Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", "remoteHarvester");
                name = this.createCustomCreep(energy, 'remoteHarvester');
            }
        }

        // remoteBuilders
        if (name == undefined && this.createRemoteBuilders === true) {
            if (Roles.lessThanMin('remoteBuilder', room)) { // TODO : this is a bug. the count of remoteBuilders for a room will be 0 if they're already remote.
            Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", "remoteBuilder");
                name = this.createCustomCreep(energy, 'remoteBuilder');
            }
        }


        //------------ PRIMARY ROLES --------------------------------------------------------------
        if (name == undefined) {
            for (let role of primaryRoles) {
                if (Roles.lessThanMin(role, room, this.primaryMin) || (this.usePercentages === true && Roles.lessThanPerc(role, room))) {
                    Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", role);
                    name = this.createCustomCreep(energy, role);
                    break;
                }
            }
        }


        //------------ SECONDARY ROLES -----------------------------------------------------------------
        if (name == undefined && createSecondaryRoles === true) {
            for (let role of secondaryRoles) {
                if (Roles.lessThanMin(role, room) || (this.usePercentages === true && Roles.lessThanPerc(role, room))) {
                    Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", role);
                    name = this.createCustomCreep(energy, role);
                    break;
                }
            }
        }


        //------------ PERMANENT ROLE -------------------------------------------------------------
        if (name == undefined && typeof this.permanentRole === 'string') {
            Globals.tickMessages[this.name] += Globals.logMessage("spawn attempt", this.permanentRole);
            name = this.createCustomCreep(energy, this.permanentRole);
        }


        //------------ LOG ACTIVITY ---------------------------------------------------------------
        if (typeof name === 'string') {
            Globals.tickMessages[this.name] += name;
            console.log(Globals.tickMessages[this.name]);
            console.log(this.roleStatus());
        } 
        else if (name != undefined) {
            Globals.tickMessages[this.name] += Constants.returnCode(name);
            console.log(Globals.tickMessages[this.name]);
        }
    };

// createCustomCreep
StructureSpawn.prototype.createCustomCreep =
    function (energy, role) {
        if (role === 'lorry' || role === 'janitor') 
            return this.createLorry(energy, role);

        if (role === 'attacker') 
            return this.createAttacker(energy);

        var body = [];        
        var numberOfParts = Math.floor(energy / 200);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));

        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }

        if (body.length) {
            var nextSerial = Roles.nextSerial(role);
            return this.createCreep(body, role + nextSerial,
                { 
                    role: role, 
                    working: false, 
                    serial: nextSerial,
                    roleType: Roles[role].roleType
                });
        } 
        else {
            return Constants.ERR_NOT_ENOUGH_ENERGY;
        }
    };

// createLorry
StructureSpawn.prototype.createLorry =
    function (energy, role) {
        var body = [];
        var numberOfParts = Math.floor(energy / 150);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        role = role || 'lorry';
        
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }        
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }

        if (body.length) {
            var nextSerial = Roles.nextSerial(role);
            return this.createCreep(body, role + nextSerial,
                { 
                    role: role, 
                    working: false, 
                    serial: nextSerial,
                    roleType: Roles.lorry.roleType
                });
        }
        else {
            return Constants.ERR_NOT_ENOUGH_ENERGY;
        }
    };

// createAttacker
StructureSpawn.prototype.createAttacker =
    function (energy) {
        var body = [];
        var numberOfParts = Math.floor(energy / 210);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));

        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        } 
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(ATTACK);
        }       

        if (body.length) {
            var nextSerial = Roles.nextSerial('attacker');
            return this.createCreep(body, 'attacker' + nextSerial,
                { 
                    role: 'attacker', 
                    working: false, 
                    serial: nextSerial,
                    roleType: Roles.attacker.roleType
                });
        } 
        else {
            return Constants.ERR_NOT_ENOUGH_ENERGY;
        }
    };

// createMiner
StructureSpawn.prototype.createMiner =
    function (sourceId, containerId) {
        var nextSerial = Roles.nextSerial('miner');
        return this.createCreep(Roles.miner.body, 'miner' + nextSerial,
            { 
                role: 'miner', 
                working: false, 
                serial: nextSerial, 
                roleType: Roles.miner.roleType,
                sourceId: sourceId, 
                containerId: containerId 
            });
    };

// createClaimer
StructureSpawn.prototype.createClaimer = 
    function (target) {
        var nextSerial = Roles.nextSerial('claimer');
        return this.createCreep(Roles.claimer.body, 'claimer' + nextSerial,
            { 
                role: 'claimer', 
                working: false, 
                serial: nextSerial, 
                roleType: Roles.claimer.roleType,
                target: target
            });
    };

// newCreep 
// -- keeping this around for easy console use
StructureSpawn.prototype.newCreep =
    function (role, body) {
        body = body || Roles[role].body;
        var nextSerial = Roles.nextSerial(role);
        return this.createCreep(body, role + nextSerial,
            { 
                role: role, 
                working: false, 
                serial: nextSerial,
                roleType: Roles[role].roleType
            });
    };

// roleStatus
StructureSpawn.prototype.roleStatus =
    function (role) {
        var status = this.room + " " + this + " ";
        if (role != undefined) {
            status += Roles.status(role, this.room.name);
        } else {
            for (let r of primaryRoles) {
                status += Roles.status(r, this.room.name) + " | ";
            }
            for (let r of secondaryRoles) {
                status += Roles.status(r, this.room.name) + " | ";
            }
            for (let r of remoteRoles) {
                status += Roles.status(r, this.room.name) + " | ";
            }
            for (let r of specializedRoles) {
                status += Roles.status(r, this.room.name) + " | ";
            }
        }
        return status;
    };

// avgCreepSize
StructureSpawn.prototype.avgCreepSize = 
    function () {
        let totalSize = 0;
        let creeps = _.filter(Game.creeps, (c) => c);
        for (let creep of creeps) {
            for (let body of creep.body) {
                totalSize += Constants.BODYPART_COST[body.type];
            }
        }
        return "Average creep size: " + Math.floor(totalSize / creeps.length);
    };

// energyStatus
StructureSpawn.prototype.energyStatus = 
    function () {
        let level = this.room.energyAvailable;
        let capacity = this.room.energyCapacityAvailable;
        console.log("[" + level + "/" + capacity + "]");
    };
