"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services = require("./services");
const common = require("./common");
const core = require("./core");
function check(u) {
    const x = u.x;
    const y = u.y + common.userHeight * 2 / 3;
    const f = u.faceing;
    for (const user of core.users) {
        let uh = common.userHeight;
        if (user.crawl) {
            uh /= 2;
        }
        if (f < 0 && x > user.x && user.y <= y && user.y + uh >= y) {
            services.user.killed(user, 2 /* gun */, u);
            user.vx = 6 * f;
        }
        if (f > 0 && x < user.x && user.y <= y && user.y + uh >= y) {
            services.user.killed(user, 2 /* gun */, u);
            user.vx = 6 * f;
        }
    }
}
exports.check = check;
