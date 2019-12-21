const { ParamsDef } = Msa.require("params")
const { SheetPerm } = require("./perm")

const sheetParamsDef = new ParamsDef()
sheetParamsDef.add("perm", SheetPerm.newPermParamDef({ group:"all", value:SheetPerm.READ }))
 
module.exports = { sheetParamsDef }
