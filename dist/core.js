"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("./common");
const services = require("./services");
let items = [];
exports.users = [];
exports.grenades = [];
exports.mines = [];
let debug = false;
function init(debugMode) {
    debug = debugMode;
    setInterval(() => {
        for (const itemGate of exports.map.itemGates) {
            if (items.length < exports.users.length) {
                const type = Math.floor(Math.random() * common.itemCounts.length);
                const item = {
                    type,
                    count: common.itemCounts[type],
                    lifetime: 3000,
                    slowdown: 0,
                    vx: Math.random() + .5,
                    vy: Math.random() + .5,
                    dead: false,
                    x: 0,
                    y: 0,
                };
                items.push(item);
                item.x = (itemGate.x + .5) * common.tileWidth;
                item.y = (itemGate.y + .5) * common.tileHeight;
            }
        }
        for (const item of items) {
            item.slowdown++;
            if (item.x >= common.w - common.itemSize || item.x <= common.itemSize) {
                item.vx *= -1;
            }
            if (item.y >= common.h - common.itemSize || item.y <= common.itemSize) {
                item.vy *= -1;
            }
            item.lifetime--;
            if (item.lifetime < 0) {
                item.dead = true;
            }
            if (item.slowdown < 100) {
                item.x += item.vx * item.slowdown / 100;
                item.y += item.vy * item.slowdown / 100;
            }
            else {
                item.x += item.vx;
                item.y += item.vy;
            }
        }
        for (const grenade of exports.grenades) {
            grenade.x += grenade.vx;
            grenade.r += grenade.vx / 5;
            if (grenade.x < 0 || grenade.x > common.w) {
                grenade.vx *= -1;
            }
            grenade.vy -= .2;
            grenade.vy = Math.max(grenade.vy, -6);
            if (grenade.vy > 0) {
                grenade.y += Math.floor(grenade.vy);
            }
            else {
                for (let i = 0; i < -grenade.vy; i++) {
                    if (services.map.onFloor(grenade.x, grenade.y)) {
                        if (services.map.onLadder(grenade.x, grenade.y)) {
                            grenade.vx *= .7;
                        }
                        else {
                            grenade.vy *= -.85;
                            break;
                        }
                    }
                    grenade.y--;
                }
            }
            if (grenade.y < 0) {
                grenade.dead = true;
            }
            grenade.life--;
            if (grenade.life < 0) {
                grenade.dead = true;
                services.grenade.explode(grenade.x, grenade.y, grenade.creater, 100);
            }
        }
        for (let i = 0; i < exports.users.length; i++) {
            for (let j = i + 1; j < exports.users.length; j++) {
                services.user.collide(exports.users[i], exports.users[j]);
            }
            for (const item of items) {
                if (exports.users[i].dead || item.dead) {
                    continue;
                }
                if (exports.users[i].itemType === 5 /* bomb */) {
                    continue;
                }
                if ((exports.users[i].x - item.x) * (exports.users[i].x - item.x) + (exports.users[i].y + common.userHeight / 2 - item.y) * (exports.users[i].y + common.userHeight / 2 - item.y) >
                    (common.userWidth + common.itemSize) * (common.userWidth + common.itemSize) / 4) {
                    continue;
                }
                item.dead = true;
                if (item.type === 3 /* drug */) {
                    services.user.killed(exports.users[i], 1 /* drug */);
                }
                else {
                    exports.users[i].itemType = item.type;
                    exports.users[i].itemCount = item.count;
                }
            }
        }
        for (const user of exports.users) {
            services.user.update(user);
        }
        const itemdata = items.map(item => ({
            x: Math.round(item.x),
            y: Math.round(item.y),
            type: item.type,
            dead: item.dead,
        }));
        const userdata = exports.users.map(user => services.user.getData(user));
        const grenadedata = exports.grenades.map(e => ({
            x: e.x,
            y: e.y,
            r: e.r,
        }));
        for (const user of exports.users) {
            if (user.ws) {
                const minedata = exports.mines.filter(mine => mine.creater.id === user.id || mine.dead).map(mine => ({
                    x: mine.x,
                    y: mine.y,
                    dead: mine.dead,
                }));
                emit(user.ws, {
                    kind: 0 /* tick */,
                    tick: {
                        users: userdata,
                        items: itemdata,
                        mines: minedata,
                        grenades: grenadedata,
                    },
                });
            }
        }
        items = items.filter(item => !item.dead);
        exports.mines = exports.mines.filter(mine => !mine.dead);
        exports.grenades = exports.grenades.filter(grenade => !grenade.dead);
        exports.users = exports.users.filter(user => !user.dead);
    }, 17);
    exports.map = services.map.create();
    exports.mapData = {
        w: exports.map.w,
        h: exports.map.h,
        floors: exports.map.floor.reduce((acc, f) => acc.concat(f), []),
        ladders: exports.map.ladders,
        doors: exports.map.doors,
        itemGates: exports.map.itemGates.map(itemGate => ({
            x: itemGate.x,
            y: itemGate.y,
        })),
    };
}
exports.init = init;
function printInConsole(message) {
    // tslint:disable-next-line:no-console
    console.log(message);
}
exports.printInConsole = printInConsole;
function emit(ws, protocol) {
    try {
        ws.send(services.format.encode(protocol, debug), { binary: !debug });
    }
    catch (e) {
        printInConsole(e);
    }
}
exports.emit = emit;
function announce(protocol) {
    for (const user of exports.users) {
        if (user.ws) {
            emit(user.ws, protocol);
        }
    }
}
exports.announce = announce;
