module.exports = async itf => {
	// create table in DB
	const { SheetsDb } = require("./db")
	await SheetsDb.sync()
}

