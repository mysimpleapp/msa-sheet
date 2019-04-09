const { ParamsDef } = Msa.require("params")
const { permPublic, permAdmin, PermParamDef } = Msa.require("user")

const sheetParamsDef = new ParamsDef()
sheetParamsDef.add("readPerm", new PermParamDef({
	defVal: permPublic
}))
sheetParamsDef.add("writePerm", new PermParamDef({
	defVal: permAdmin
}))
 
module.exports = { sheetParamsDef }
