var roleHarvester = require('role.harvester');

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                filter: (cs) => cs.structureType == STRUCTURE_SPAWN // || cs.structureType == STRUCTURE_ROAD
            });
            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite);
                }
            }
            // if no constructionSite is found
            else {
                roleHarvester.run(creep);
            }
        }
        // if creep is supposed to get energy
        else {
            if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
                return;
            }
            else {
                const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: (r) => r.resourceType == RESOURCE_ENERGY
                });

                if (droppedEnergy != undefined) {
                    if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy);
                    } else {
                        console.log(`${creep.name} found ${droppedEnergy.energy} energy at ${droppedEnergy.pos}`);
                    }
                }
                else {
                    creep.getEnergy(["source"]);
                }
            }
        }
    }
};