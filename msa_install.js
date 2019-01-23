const { promisify:prm } = require('util')
const msaUser = require('./index.js')

module.exports = async (itf, next) => {
	try {
		// create table in DB
		await itf.installMsaMod("db", "msa-db")
		const { SheetsDb } = require("./db")
		await SheetsDb.sync()
	} catch(err) { return next(err) }
	next()
}

