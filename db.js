// DB model
const { orm, Orm } = Msa.require("db")
const { sheetParamsDef } = require("./params")

const SheetsDb = orm.define('msa_sheets', {
	key: { type: Orm.STRING, primaryKey: true },
	contentBody: Orm.TEXT,
	contentHead: Orm.TEXT,
	createdBy: Orm.STRING,
	updatedBy: Orm.STRING,
	params: { type: Orm.TEXT,
		get() { const val = this.getDataValue('params'); return val ? sheetParamsDef.deserialize(val) : null },
		set(val) { if(val) val = sheetParamsDef.serialize(val); this.setDataValue('params', val) }
	}
})

module.exports = { SheetsDb }
