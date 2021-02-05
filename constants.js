module.exports = {
    OK: 0,
    ERR_NOT_OWNER: -1,
    ERR_NO_PATH: -2,
    ERR_NAME_EXISTS: -3,
    ERR_BUSY: -4,
    ERR_NOT_FOUND: -5,
    ERR_NOT_ENOUGH_ENERGY: -6,
    ERR_NOT_ENOUGH_RESOURCES: -6,
    ERR_INVALID_TARGET: -7,
    ERR_FULL: -8,
    ERR_NOT_IN_RANGE: -9,
    ERR_INVALID_ARGS: -10,
    ERR_TIRED: -11,
    ERR_NO_BODYPART: -12,
    ERR_NOT_ENOUGH_EXTENSIONS: -6,
    ERR_RCL_NOT_ENOUGH: -14,
    ERR_GCL_NOT_ENOUGH: -15,
    returnCode: function (code) {
        switch (code) {
            case 0: return 'OK';
            case -1: return 'ERR_NOT_OWNER';
            case -2: return 'ERR_NO_PATH';
            case -3: return 'ERR_NAME_EXISTS';
            case -4: return 'ERR_BUSY';
            case -5: return 'ERR_NOT_FOUND';
            case -6: return 'ERR_NOT_ENOUGH_ENERGY';
            case -7: return 'ERR_INVALID_TARGET';
            case -8: return 'ERR_FULL';
            case -9: return 'ERR_NOT_IN_RANGE';
            case -10: return 'ERR_INVALID_ARGS';
            case -11: return 'ERR_TIRED';
            case -12: return 'ERR_NO_BODYPART';
            case -14: return 'ERR_RCL_NOT_ENOUGH';
            case -15: return 'ERR_GCL_NOT_ENOUGH';
            default: return 'Unknown code: ' + code;
        }
    },
    BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    },
    ROLE_TYPE: {
        "specialized": 0,
        "primary": 1,
        "secondary": 2,
        "remote": 3
    },
    roleType: function (type) {
        switch (type) {
            case 0: return 'specialized';
            case 1: return 'primary';
            case 2: return 'secondary';
            case 3: return 'remote';
            default: return 'Unknown core type: ' + type;
        }
    }
};