const mod = require("./module")
module.exports = {
    startMsaModule: () => new mod.MsaSheet(""),
    ...mod
}