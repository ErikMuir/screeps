module.exports = {
    tickMessages: [],
    logMessage: function(logType, text) { 
        switch (logType) {
            case "spawn attempt":
                return `attempting to create a new ${text} creep ... `; 
            default: 
                return "Invalid log type";
        }
    }
};