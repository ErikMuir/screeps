module.exports = {
  // a function to run the logic for this role
  run: function (creep) {
    if (creep.memory.target != undefined) {
      if (creep.room.name != creep.memory.target) {
        // find exit to target room
        var exit = creep.room.findExitTo(creep.memory.target);
        // move to exit
        creep.moveTo(creep.pos.findClosestByRange(exit));
        return;
      } else if (creep.pos.x === 0 || creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
        creep.moveTo(new RoomPosition(25, 25, creep.memory.target));
      }
    }

    ////////////////////////////////////////////////////////////////////
    ///////////////////////// OVERRIDE SECTION /////////////////////////
    // if (creep.name == 'attacker2' || creep.name == 'attacker3') {
    //     var enemy = Game.getObjectById('596bbcf20c3cb05f4556abf3');
    //     if (enemy != undefined) {
    //         if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(enemy);
    //             return;
    //         }
    //     }
    // }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length) {
      if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(enemies[0]);
      } else {
        console.log(`${creep.name} just attacked enemy creep: ${enemies[0]}`);
      }
    }
  },
};
