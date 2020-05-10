const mod = require("./module")
module.exports = {
    installMsaModule: async itf => {
        await require("./install")(itf)
    },
    startMsaModule: () => new mod.MsaSheet(""),
    ...mod
}