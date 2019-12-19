// DB model
const { orm, Orm } = Msa.require("db")
const { sheetParamsDef } = require("./params")

const SheetsDb = orm.define('msa_sheets', {
	id: { type: Orm.STRING, primaryKey: true },
	contentBody: Orm.TEXT,
	contentHead: Orm.TEXT,
	createdBy: Orm.STRING,
	updatedBy: Orm.STRING,
	params: { type: Orm.TEXT,
		get() { return sheetParamsDef.deserialize(this.getDataValue('params')) },
		set(val) { this.setDataValue('params', sheetParamsDef.serialize(val)) }
	}
})

module.exports = { SheetsDb }
