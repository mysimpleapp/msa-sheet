const { PermNum } = Msa.require("user/perm")

const labels = [
	{ name: "None" },
	{ name: "Read" },
	{ name: "Write" }]

const defExpr = { group:"all", value:1 }

class SheetPerm extends PermNum {
	getMaxVal(){ return 2 }
	getLabels(){ return labels }
	getDefaultExpr(){ return defExpr }
}
SheetPerm.NONE = 0
SheetPerm.READ = 1
SheetPerm.WRITE = 2

module.exports = { SheetPerm }
