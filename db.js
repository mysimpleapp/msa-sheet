// DB model
const { orm, Orm } = Msa.require("db")
const { SheetParamDict } = require("./params")

const SheetsDb = orm.define('msa_sheets', {
	id: { type: Orm.STRING, primaryKey: true },
	contentBody: Orm.TEXT,
	contentHead: Orm.TEXT,
	createdBy: Orm.STRING,
	updatedBy: Orm.STRING,
	params: { type: Orm.TEXT,
		get() { return SheetParamDict.newFromDbVal(this.getDataValue('params')) },
		set(val) { console.log("TMP", val); if(val) this.setDataValue('params', val.getAsDbVal()) }
	}
})

module.exports = { SheetsDb }
