const { ParamDict } = Msa.require("params")
const { SheetPerm } = require("./perm")

class SheetParamDict extends ParamDict {
    constructor(){
        super()
        this.perm = SheetPerm.newParam()
    }
}
 
module.exports = { SheetParamDict }
