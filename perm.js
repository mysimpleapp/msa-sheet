const { PermNum } = Msa.require("user/perm")

const labels = [
	{ name: "None" },
	{ name: "Read" },
	{ name: "Write" }]

class SheetPerm extends PermNum {
	getMaxVal() { return 2 }
	getLabels() { return labels }
	getDefaultValue() { return 1 }
}
SheetPerm.NONE = 0
SheetPerm.READ = 1
SheetPerm.WRITE = 2

module.exports = { SheetPerm }