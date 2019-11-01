const { ParamsDef } = Msa.require("params")
const { SheetPerm } = require("./perm")

const sheetParamsDef = new ParamsDef()
sheetParamsDef.add("perm", SheetPerm.newPermParamDef(SheetPerm.READ))
 
module.exports = { sheetParamsDef }
