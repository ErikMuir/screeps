module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // get source
        let source = Game.getObjectById(creep.memory.sourceId);
        if (source == undefined) {
            console.log(`${creep.name} could not find his source!`);
            return;
        }

        // get container
        let container = Game.getObjectById(creep.memory.containerId);
        if (container == undefined) {
            console.log(`${creep.name} could not find his container!`);
            return;
        }

        // if creep is on top of the container
        if (creep.pos.isEqualTo(container.pos)) {
            // harvest
            creep.harvest(source);
        }
        // if creep is not on top of the container
        else {
            // move toward it
            creep.moveTo(container);
        }
    }
};