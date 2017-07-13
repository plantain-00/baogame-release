"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services = require("./services");
const common = require("./common");
const core = require("./core");
function throwGrenade(user) {
    const grenade = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 100,
        r: 0,
        dead: false,
        creater: user,
    };
    const vx = user.faceing * (15 + user.grenadeing) / 5;
    let vy = user.grenadeing / 3;
    if (user.crawl) {
        vy = 0;
    }
    grenade.x = user.x - user.faceing * 20;
    grenade.y = user.y + common.userHeight;
    grenade.vx = user.vx + vx;
    grenade.vy = user.vy + vy;
    core.grenades.push(grenade);
}
exports.throwGrenade = throwGrenade;
function explode(x, y, byUser, power) {
    for (const user of core.users) {
        const ux = user.x;
        const uy = user.y + common.userHeight;
        const distance = (ux - x) ** 2 + (uy - y) ** 2;
        if (distance < power * power) {
            services.user.killed(user, 4 /* bomb */, byUser);
        }
        else if (distance < 2.25 * power * power) {
            const r = Math.atan2(uy - y, ux - x);
            const force = 450 * power / (distance + 2500);
            user.vx += force * Math.cos(r);
            user.vy += force * Math.sin(r);
            user.danger = true;
        }
    }
    core.announce({ kind: 5 /* explode */, explode: { x, y, power } });
}
exports.explode = explode;
