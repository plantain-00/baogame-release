"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libs = require("./libs");
const core = require("./core");
let requestProtocolType;
let responseProtocolType;
function start() {
    libs.protobuf.load("./static/protocol.proto").then(root => {
        requestProtocolType = root.lookup("RequestProtocol");
        responseProtocolType = root.lookup("ResponseProtocol");
    }, error => {
        core.printInConsole(error);
    });
}
exports.start = start;
function encode(protocol, debug) {
    return debug ? JSON.stringify(protocol) : responseProtocolType.encode(protocol).finish();
}
exports.encode = encode;
function decode(protocol) {
    if (typeof protocol === "string") {
        return JSON.parse(protocol);
    }
    return requestProtocolType.toObject(requestProtocolType.decode(new Buffer(protocol)));
}
exports.decode = decode;
