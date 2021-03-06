[![Dependency Status](https://david-dm.org/plantain-00/baogame.svg)](https://david-dm.org/plantain-00/baogame)
[![devDependency Status](https://david-dm.org/plantain-00/baogame/dev-status.svg)](https://david-dm.org/plantain-00/baogame#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/baogame.svg?branch=master)](https://travis-ci.org/plantain-00/baogame)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/baogame?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/baogame/branch/master)

# baogame

a html5 mutiplayer game

![demo](https://raw.githubusercontent.com/plantain-00/baogame/master/doc/demo1.gif)

#### install

```bash
git clone https://github.com/plantain-00/baogame-release.git . --depth=1 && npm i --production
```

```bash
node dist/app.js
```

Then open http://localhost:8030 in your browser.

#### CLI parameters

key | default value | description
--- | --- | ---
-p | 8030 | port
-h | localhost | host
--debug | false | when true, send json rather than protobuf

#### docker

```bash
docker run -d -p 8030:8030 plantain/baogame
```
