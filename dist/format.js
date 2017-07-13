"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libs = require("./libs");
let protocolType;
function start() {
    libs.protobuf.load("./static/protocol.proto").then(root => {
        protocolType = root.lookup("protocolPackage.Protocol");
    }, error => {
        // tslint:disable-next-line:no-console
        console.log(error);
    });
}
exports.start = start;
function encode(protocol, debug) {
    return debug ? JSON.stringify(protocol) : protocolType.encode(protocol).finish();
}
exports.encode = encode;
function decode(protocol) {
    if (typeof protocol === "string") {
        return JSON.parse(protocol);
    }
    return protocolType.decode(new Buffer(protocol)).toJSON();
}
exports.decode = decode;
