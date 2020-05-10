module.exports = itf => Msa.require('db').withDb(async db => {
	await db.run(
	`CREATE TABLE IF NOT EXISTS msa_sheets (
		id VARCHAR(255) PRIMARY KEY,
		contentBody TEXT,
		contentHead TEXT,
		createdBy VARCHAR(255),
		updatedBy VARCHAR(255),
		params TEXT
	)`)
})
