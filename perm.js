const { PermNum } = Msa.require("user/perm")

class SheetPerm extends PermNum {
	getMaxVal(){ return 2 }
}
SheetPerm.NONE = 0
SheetPerm.READ = 1
SheetPerm.WRITE = 2

module.exports = { SheetPerm }
