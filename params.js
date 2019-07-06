const { ParamsDef } = Msa.require("params")
const { newPermParamDef } = Msa.require("user")
const { SheetPerm } = require("./perm")

const sheetParamsDef = new ParamsDef()
sheetParamsDef.add("perm", newPermParamDef(SheetPerm, SheetPerm.READ))
 
module.exports = { sheetParamsDef }
