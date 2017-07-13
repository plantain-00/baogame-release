"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services = require("./services");
const core = require("./core");
function lay(user) {
    const x = user.x + user.faceing * 40;
    if (services.map.onFloor(x, user.y)) {
        core.mines.push({
            x,
            y: user.y,
            creater: user,
        });
        user.itemCount--;
    }
}
exports.lay = lay;
function check(user) {
    for (let i = core.mines.length - 1; i >= 0; i--) {
        const mine = core.mines[i];
        if (Math.abs(user.x - mine.x) < 10 && Math.abs(user.y - mine.y) < 5) {
            services.user.killed(user, 3 /* mine */, mine.creater);
            mine.dead = true;
            return true;
        }
    }
    return false;
}
exports.check = check;
