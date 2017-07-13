"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("./common");
const core = require("./core");
function create() {
    const w = common.tw;
    const h = common.th;
    const floor = [];
    const ladders = [];
    for (let i = 0; i < h; i++) {
        floor[i] = [];
        let on = Math.random() > .5 ? 1 : 0;
        if (i % 2 === 1 && i < h - 2) {
            for (let j = 0; j < w; j++) {
                if (i < 2 || i === h - 1 || j === 0 || j === w - 1) {
                    floor[i][j] = 0;
                }
                else {
                    floor[i][j] = on;
                    if (Math.random() > .8) {
                        on = 1 - on;
                    }
                }
            }
        }
    }
    ladders.push({
        x: 4.5,
        y1: 1,
        y2: h - 1,
    });
    ladders.push({
        x: w - 3.5,
        y1: 1,
        y2: h - 1,
    });
    for (let j = 6; j < w - 6; j++) {
        let start = 0;
        let end = 0;
        for (let i = 0; i < 4; i++) {
            if (floor[i][j]) {
                start = i;
                break;
            }
        }
        if (start) {
            for (let i = start + 1; i < h; i++) {
                if (floor[i][j]) {
                    end = i;
                }
            }
            if (end) {
                ladders.push({
                    x: j + .5,
                    y1: start,
                    y2: end + 1,
                });
            }
            j += 3;
        }
    }
    floor[1][3] = 1;
    floor[1][4] = 1;
    floor[1][5] = 1;
    floor[1][w - 3] = 1;
    floor[1][w - 4] = 1;
    floor[1][w - 5] = 1;
    floor[3][2] = 1;
    floor[3][3] = 1;
    floor[3][4] = 1;
    floor[3][5] = 1;
    floor[3][w - 2] = 1;
    floor[3][w - 3] = 1;
    floor[3][w - 4] = 1;
    floor[3][w - 5] = 1;
    floor[h - 2][3] = 1;
    floor[h - 2][4] = 1;
    floor[h - 2][5] = 1;
    floor[h - 2][w - 3] = 1;
    floor[h - 2][w - 4] = 1;
    floor[h - 2][w - 5] = 1;
    const borns = [];
    for (let i = 0; i < 20; i++) {
        const x = Math.floor(Math.random() * (common.tw - 2)) + 1;
        const y = Math.floor(Math.random() * (common.th - 2)) + 1;
        if (floor[y][x]) {
            borns.push({ x, y });
        }
    }
    for (const f of floor) {
        for (let i = 0; i < common.tw; i++) {
            if (f[i] !== 0 && f[i] !== 1) {
                f[i] = 0;
            }
        }
    }
    const itemGates = [];
    itemGates.push({ x: 0, y: common.th / 2 });
    itemGates.push({ x: common.tw - 1, y: common.th / 2 });
    itemGates.push({ x: common.tw / 2, y: common.th - 1 });
    return {
        w: common.tw,
        h: common.th,
        floor,
        ladders,
        borns,
        doors: [],
        itemGates,
    };
}
exports.create = create;
function born() {
    const i = Math.floor(Math.random() * core.map.borns.length);
    const { x, y } = core.map.borns[i];
    return {
        x: (x + .5) * common.tileWidth,
        y: y * common.tileHeight,
    };
}
exports.born = born;
function onFloor(x, y) {
    x = Math.floor(x / common.tileWidth);
    if (y % common.tileHeight !== 0) {
        return undefined;
    }
    y = y / common.tileHeight;
    if (x < 0 || y < 0 || x >= core.map.w || y >= core.map.h || !core.map.floor[y]) {
        return undefined;
    }
    return core.map.floor[y][x];
}
exports.onFloor = onFloor;
function nearLadder(u) {
    if (onFloor(u.x, u.y) === undefined) {
        return undefined;
    }
    if (Math.abs(u.vx) > 1 || Math.abs(u.vy) > 1 || u.dieing) {
        return undefined;
    }
    const x = u.x;
    const y = u.y;
    for (const ladder of core.map.ladders) {
        if (Math.abs(x - ladder.x * common.tileWidth) < 8 && y >= ladder.y1 * common.tileHeight && y <= ladder.y2 * common.tileHeight) {
            return ladder;
        }
    }
    return undefined;
}
exports.nearLadder = nearLadder;
function onLadder(x, y) {
    for (const ladder of core.map.ladders) {
        if (Math.abs(x - ladder.x * common.tileWidth) < 8 && y >= ladder.y1 * common.tileHeight && y <= ladder.y2 * common.tileHeight) {
            return true;
        }
    }
    return false;
}
exports.onLadder = onLadder;
