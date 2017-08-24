"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libs = require("./libs");
const common = require("./common");
const services = require("./services");
const core = require("./core");
const app = libs.express();
const server = libs.http.createServer(app);
const wss = new libs.WebSocketServer({ server });
const argv = libs.minimist(process.argv.slice(2));
const port = argv.p || 8030;
const host = argv.h || "localhost";
const debug = argv.debug;
server.listen(port || 8030, () => {
    core.printInConsole(`Listening on ${host}:${port}${debug ? "(debug)" : "(production)"}`);
});
app.use(libs.express.static(libs.path.resolve(__dirname, "../static")));
services.format.start();
core.init(debug);
wss.on("connection", ws => {
    core.emit(ws, {
        kind: 1 /* initSuccess */,
        initSuccess: {
            map: core.mapData,
        },
    });
    let user;
    ws.on("message", message => {
        const protocol = services.format.decode(message);
        if (protocol.kind === 2 /* join */) {
            if (protocol.join && typeof protocol.join.userName === "string") {
                user = services.user.create(protocol.join.userName.trim().substring(0, 8), ws);
                core.users.push(user);
                core.emit(ws, { kind: 3 /* joinSuccess */, joinSuccess: { userId: user.id } });
            }
        }
        else if (protocol.kind === 4 /* control */) {
            if (user && protocol.control) {
                user.control = protocol.control;
            }
        }
    });
});
