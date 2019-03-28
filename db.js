// DB model
const { orm, Orm } = Msa.require("db")
const SheetsDb = orm.define('msa_sheets', {
	key: { type: Orm.STRING, primaryKey: true },
	owner: Orm.STRING,
	content: { type: Orm.TEXT,
		get() { const val = this.getDataValue('content'); return (val == "") ? "" : JSON.parse(val) },
		set(val) { this.setDataValue('content', (val === "") ? "" : JSON.stringify(val)) }
	}
})

module.exports = { SheetsDb }
