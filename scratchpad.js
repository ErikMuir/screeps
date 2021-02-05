
creep.room.find(FIND_STRUCTURES, {
    filter: function(structure) {
        return (structure.structureType == STRUCTURE_CONTROLLER);
    }
})


// E65N99

_.forEach(Game.creeps, (c) => {
    switch (c.memory.role) {
        case 'janitor':
        case 'attacker':
        case 'miner':
        case 'lorry':
            c.memory.roleType = 0;
            break;
        case 'harvester':
        case 'upgrader':
        case 'builder':
        case 'repairer':
            c.memory.roleType = 1;
            break;
        case 'wallRepairer':
        case 'rampartRepairer':
            c.memory.roleType = 2;
            break;
        case 'claimer':
        case 'removeHarvester':
        case 'remoteBuilder':
            c.memory.roleType = 3;
            break;
        default:
            c.memory.roleType = -1;
            break;
    }
});

_.forEach(Game.creeps, (c) => console.log(c.name + ": " + c.memory.roleType));