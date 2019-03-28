// requires

const path = require("path")
const { SheetsDb } = require("./db")
//var msaDbFiles = Msa.require("msa-db", "files.js")
const { Perm, permAdmin } = Msa.require("user")
const perm = new Perm()
//const msaFs = Msa.require("fs")
const formatHtml = Msa.formatHtml, parseHtml = Msa.parseHtml
const { mdw:userMdw } = Msa.require("user")

// class
class MsaSheet extends Msa.Module {

	constructor(dbKey){
		super()
		this.dbKey = dbKey
		this.initDb()
		this.initApp()
	}

	initDb(){
		this.db = SheetsDb
	}

	getDbKey(key){
		return this.dbKey + '-' + key
	}

	getDefaultContent(){
		return {
			tag: "msa-sheet-boxes",
			content: {
				tag: "msa-sheet-text"
			}
		}
	}

	getUserKey(req){
		const user = req.session ? req.session.user : null
		return user ? user.name : req.connection.remoteAddress
	}

	getCreatePerm(){
		return permAdmin
	}
}
const MsaSheetPt = MsaSheet.prototype

// get sheet //////////////////////////////////////////////////////////////////

// get a sheet from DB
MsaSheetPt.getSheet = async function(req, key) {
	const dbKey = this.getDbKey(key)
	const dbSheet = await SheetsDb.findOne({ where:{ key:dbKey }})
	const sheet = (dbSheet !== null) ? {
			owner: dbSheet.owner,
			content: dbSheet.content,
			editable: ( this.getUserKey(req) == dbSheet.owner )
		} : {
			content: formatHtml(this.getDefaultContent()),
			editable: this.getCreatePerm().check(req.session.user)
		}
	return sheet
}
/*
MsaSheetPt.getSheet = function(key, args1, args2) {
	// args
	if(args2===undefined) var args = {}, next = args1
	else var args = args1, next = args2
	defArg(args, "checkUserPerms", args.hasOwnProperty("user"))
	defArg(args, "user", null)
	if(!next) next = emptyFun
	// get sheetType
//	var typeObj = SheetTypes[type]
//	if(!typeObj) return next("Unknown sheet type ["+type+"].")
	// select in DB
	const dbKey = this.getDbKey(key)
	SheetsDb.find({ where:{ key:dbKey }}).then(
		sheet => _getSheet1(this, key, sheet, args, next),
		err => next(err))
}
var _getSheet1 = function(self, key, sheet, args, next) {
	if(sheet) return _getSheet2(sheet, args, next)
	// sheet does not exist: use default content
	const defaultContent = self.getDefaultContent()
	if(defaultContent===null) return next(null, null)
	self.createSheet(key, args, (err, sheet) => {
		// convert "unauthorized" (to create sheet) to "page not found"
		if(err===401 || err===403) err=404
		next(err, sheet)
	})
}
var _getSheet2 = function(sheet, args, next) {
	// prepare and return sheet
	readSheetModel(sheet, args, err => {
		next(err, sheet)
	})
}
*/


// create sheet //////////////////////////////////////////////////////////////////
/*
// create a sheet (in DB or not)
MsaSheetPt.createSheet = function(key, args1, args2) {
	// determine args & next
	if(args2===undefined) var args = {}, next = args1
	else var args = args1, next = args2
	// default args
	defArg(args, "checkUserPerms", args.hasOwnProperty("user"))
	defArg(args, "user", null)
	defArg(args, "ifExist", "get")
	defArg(args, "insertInDb", true)
	if(!next) next = emptyFun
	// get sheetType
//	var typeObj = SheetTypes[type]
//	if(!typeObj) return next("Unknown sheet type ["+type+"].")
	// check if sheet already exists
	const dbKey = this.getDbKey(key)
	SheetsDb.find({ where:{ key:dbKey }}).then(
		sheet => _createSheet1(this, dbKey, sheet, args, next),
		err => next(err))
}
var _createSheet1 = function(self, dbKey, sheet, args, next) {
	// if sheet exists: apply args.ifExist action
	if(sheet) {
		var ifExist = args.ifExist
		if(ifExist=="null") return next(null, null)
		else if(ifExist=="error") return next(409) // CONFLICT
		else if(ifExist=="get") return _createSheet3(sheet, args, next)
		else if(ifExist!="overwrite") return next("Unknown ifExist ["+ifExist+"].")
		else if(typeof ifExist==="function") return ifExist(sheet)
		else return next("Unknown ifExist ["+ifExist+"].")
	}
	// check if user has permission to create this sheetType
	if(args.checkUserPerms)
		if(!self.getCreatePerm().check(args.user))
			return next(403)
	// create base sheet model
	createSheetModel(self, dbKey, args, (err, sheet)  => {
		if(err) return next(err)
		_createSheet2(self, sheet, args, next)
	})
}
var _createSheet2 = function(self, sheet, args, next) {
	// check if sheet has to be inserted in db
	if(!args.insertInDb) return _createSheet3(sheet, args, next)
	// insert sheet in db
	SheetsDb.upsert(
		{ key:sheet.key, content: sheet.content },
		{ where: { key:sheet.key }}).then(
			() => _createSheet3(sheet, args, next),
			err => next(err))
}
var _createSheet3 = function(sheet, args, next) {
	// prepare and return sheet
	readSheetModel(sheet, args, function(err){
		next(err, sheet)
	})
}
*/


// update sheet //////////////////////////////////////////////////////////////////

// update a sheet in DB with updates
MsaSheetPt.upsertSheet = async function(req, key, content) {
	const dbKey = this.getDbKey(key)
	const sheet = await SheetsDb.findOne({ where:{ key:dbKey }})
	if(!sheet) await this.createSheet(req, key, content)
	else await this.updateSheet(req, key, content)
}

MsaSheetPt.createSheet = async function(req, key, content) {
	const dbKey = this.getDbKey(key)
	const owner = this.getUserKey(req)
	await SheetsDb.create(
		{ key:dbKey, content:formatHtml(content), owner })
}

MsaSheetPt.updateSheet = async function(req, key, content) {
	const dbKey = this.getDbKey(key)
	await SheetsDb.update(
		{ content: formatHtml(content) },
		{ where: { key:dbKey }})
}


/*
MsaSheetPt.updateSheet = function(key, update, args1, args2) {
	// determine args
	if(args2===undefined) var args = {}, next = args1
	else var args = args1, next = args2
	// default args
	defArg(args, "checkUserPerms", args.hasOwnProperty("user"))
	defArg(args, "user", null)
	defArg(args, "ifNotExist", "create")
	defArg(args, "insertInDb", true)
	if(!next) next = emptyFun
	// get sheetType
//	var typeObj = SheetTypes[type]
//	if(!typeObj) return next("Unknown sheet type ["+type+"].")
	// select sheet to update in DB
	const dbKey = this.getDbKey(key)
	SheetsDb.find({ where:{ key:dbKey }}).then(
		sheet => _updateSheet1(this, key, update, sheet, args, next),
		err => next(err))
}
var _updateSheet1 = function(self, key, update, sheet, args, next) {
	if(sheet) return _updateSheet2(self, update, sheet, args, next)
	// sheet does not exist: apply args.ifNotExist action
	var ifNotExist = args.ifNotExist
	if(ifNotExist=="null") return next(null, null)
	else if(ifNotExist=="error") return next(404) // PAGE NOT FOUND
	else if(ifNotExist=="create") {
		// create sheet
		return self.createSheet(key, args, (err, sheet) => {
			if(err) return next(err)
			_updateSheet2(self, update, sheet, args, next)
		})
	} else if(typeof ifNotExist==="function") return ifNotExist()
	else return next("Unknown ifNotExist ["+ifNotExist+"].")
}
var _updateSheet2 = function(self, update, sheet, args, next) {
	// update sheet model
	updateSheetModel(sheet, update, args, (err, atLeastOneUpdate) => {
		if(err) return next(err)
		_updateSheet3(self, sheet, atLeastOneUpdate, args, next)
	})
}
var _updateSheet3 = function(self, sheet, atLeastOneUpdate, args, next) {
	// insert in DB (if requested & needed)
	if(!atLeastOneUpdate || !args.insertInDb) return _updateSheet4(sheet, args, next)
	SheetsDb.upsert(
		{ key:sheet.key, content:sheet.content },
		{ where:{ key:sheet.key }}).then(
			() => _updateSheet4(sheet, args, next),
			err => next(err))
}
var _updateSheet4 = function(sheet, args, next) {
	// prepare and return sheet
	readSheetModel(sheet, args, function(err){
		next(err, sheet)
	})
}
*/


// readSheetModel //////////////////////////////////////////////////////////////////
/*
var readSheetModel = function(sheet, args, next) {
	// read callbacks
	var readCallbacks = sheet.readCallbacks
	if(!readCallbacks) return _readSheetModel2(sheet, args, next)
	_readSheetModel1(sheet, readCallbacks, 0, readCallbacks.length, args, next)
}
var _readSheetModel1 = function(sheet, readCallbacks, i, len, args, next) {
	// TODO: read callbacks
	_readSheetModel2(sheet, args, next)
}
var _readSheetModel2 = function(sheet, args, next) {
	// set editable
	sheet.editable = checkEditable(sheet, args.user)
	// remove mongoDB id
	delete sheet._id
	next()
}
var checkEditable = function(sheet, user) {
	// check sheet owner
	if(perm.exprCheck(sheet.owner, user)) return true
	// TODO: check content edit perms
	return false
}



// createSheetModel //////////////////////////////////////////////////////////////////

var createSheetModel = function(mod, dbKey, args, next) {
	// create sheet object
	var user = args.user
	var sheet = {
		key: dbKey,
		owner: user ? {or: [{name: user.name}, {group: "admin"}]} : {group: "admin"}
	}
	// apply sheet type content
//	var typeObj = SheetTypes[type]
//	if(!typeObj) return next('Unknown sheet type ['+type+'].')
	var content = args.content || mod.getDefaultContent()
	if(typeof content==="string")
		content = parseHtml(content).body[0]
	sheet.content = content
	// apply write callbacks (if exist)
	var writeCallbacks = getSheetWriteCallbacks(content, sheet)
	if(!writeCallbacks) return _createSheetModel1(this, sheet, args, next)
	applySheetCallbacks(writeCallbacks, err => {
		if(err) return next(err)
		_createSheetModel1(mod, sheet, args, next)
	})
}
var _createSheetModel1 = function(mod, sheet, args, next) {
	// call sheetType onCreate callback (if exist)
	var onCreate = mod.onCreate
	if(!onCreate) return _createSheetModel2(sheet, next)
	onCreate(sheet, args, err => {
		if(err) return next(err)
		_createSheetModel2(sheet, next)
	})
}
var _createSheetModel2 = function(sheet, next) {
	// prepare sheet
	prepareSheetForWrite(sheet)
	next(null, sheet)
}

var prepareSheetForWrite = function(sheet) {
	// format html
	var content = sheet.content
	var formattedContent = formatHtml(content)
	// add heads
	formattedContent.head += getHeads(content)
	// update content
	sheet.content = formattedContent
}



// updateSheetModel //////////////////////////////////////////////////////////////////

var updateSheetModel = function(sheet, update, args, next) {
	// parse sheet & new html
	var newContent = update.content
	if(!newContent) return next(null, false)
	var sheetContent = parseHtml(sheet.content).body
	if(typeof newContent==="string")
		newContent = parseHtml(newContent).body
	// check edit permission
	var updKey = (newContent.length===1 && newContent.attrs) ? newContent.attrs['msa-sheet-key'] : null
	if(args.checkUserPerms)
		if(!checkEditSheetPerm(args.user, sheet, updKey, next))
			return
	// update all content
	if(!updKey) var updatedHtml = sheet.content = newContent
	else {
		// find content to content
		var htmlByKey = getHtmlByKey(sheetContent)
		var updatedHtml = htmlByKey[updKey]
		if(updatedHtml===undefined)
			return next("Box key ["+ updKey +"] does not exist in sheet key ["+sheet.key+"].")
		// update content object
		for(var a in updatedHtml) delete updatedHtml[a]
		for(var a in newContent) updatedHtml[a] = newContent[a]
		sheet.content = sheetContent
	}
	// update new keys
	determineNewKeys(updatedHtml)
	// call write callbacks (if exist)
	var writeCallbacks = getSheetWriteCallbacks(updatedHtml)
	if(!writeCallbacks) return _updateSheetModel1(sheet, next)
	applySheetCallbacks(writeCallbacks, err => {
		if(err) return next(err)
		_updateSheetModel1(sheet, next)
	})
}
var _updateSheetModel1 = function(sheet, next) {
	// prepare
	prepareSheetForWrite(sheet)
	next(null, sheet)
}

var checkEditSheetPerm = function(user, sheet, updKey) {
	return perm.exprCheck(sheet.owner, user)
	// TODO: check sheet edit perm from updKey
	// TODO: harmonize code with readSheet
}
*/


// renderSheetAsHtml //////////////////////////////////////////////////////////////////

var sheetHead = formatHtml({ wel:"/sheet/msa-sheet.js" }).head

MsaSheetPt.renderSheetAsHtml = function(sheet, baseUrl, key) {
	const content = sheet.content
	return {
		head: sheetHead + content.head,
		body: "<msa-sheet base-url='"+baseUrl+"' key='"+key+"' editable='"+sheet.editable+"'>"+content.body+"</msa-sheet>"
	}
}



// Read & Write callbacks ////////////////////////////////////
/*
var ReadCallbacks = []
var getSheetReadCallbacks = function(html, sheet) {
	var readCallbacks = []
	getSheetCallbacks(html, sheet, ReadCallbacks, readCallbacks)
	return readCallbacks
}
var WriteCallbacks = []
var getSheetWriteCallbacks = function(html, sheet) {
	var writeCallbacks = []
	getSheetCallbacks(html, sheet, WriteCallbacks, writeCallbacks)
	return writeCallbacks
}
var getSheetCallbacks = function(html, sheet, Callbacks, sheetCallbacks) {
	var type = typeof html
	if(type==="object") {
		// case array: recursive call on array elements
		var len = html.length
		if(len!==undefined) {
			for(var i=0; i<len; ++i)
				getSheetCallbacks(html[i], sheet, Callbacks, sheetCallbacks)
			return
		}
		// case object: check that a callback exists for this tag
		var tag = html.tag
		if(tag) {
			var callback = Callbacks[tag]
			if(callback) {
				// if so, push callback in result list
				sheetCallbacks.push({
					fun: callback.fun,
					args: [ html, { sheet:sheet } ]
				})
			}
		}
		// recursive call on content
		getSheetCallbacks(html.content, sheet, Callbacks, sheetCallbacks)
	}
}

var applySheetCallbacks = function(callbacks, next) {
	_applySheetCallbacks1(callbacks, 0, callbacks.length, next)
}
var _applySheetCallbacks1 = function(callbacks, i, len, next) {
	if(i>=len) return next()
	var callback = callbacks[i]
	var fun = callback.fun, args = callback.args
	args.push(function(err){
		if(err) return next(err)
		_applySheetCallbacks1(callbacks, i+1, len, next)
	})
	fun.apply(null, args)
}
*/

// perms /////////////////////////////////////////////////
/*
var checkSheetWritePerm = function(type, key, user, next){
	// get sheetType
//	var typeObj = SheetTypes[type]
//	if(!typeObj) return next("Unknown sheet type ["+type+"].")
	// select in DB
	SheetsDb.find({ type:type, key:key }).then(
		sheet => next(checkEditable(sheet, user) ? undefined : 403),
		err => next(err))
}

var checkSheetWritePermMdw = function(req, res, next){
	var params = req.params
	checkSheetWritePerm(params.type, params.key, req.session.user, next)
}
*/

// register ///////////////////////////////////////////////////////////////////

// sheet
/*
var SheetTypes = {}
var registerType = MsaSheetPt.registerType = function(type, args) {
	if(!type) return
	var typeObj = {}
	// clone args into typeObj
	if(args) for(var a in args) typeObj[a] = args[a]
	// default values
	defArg(typeObj, "perms", {})
	defArg(typeObj.perms, "create", { group:"admin" })
	if(typeObj.perms.create instanceof Perm === false)
		typeObj.perms.create = new Perm(typeObj.perms.create)
	// default content
	defArg(typeObj, "content", {
		tag: "msa-sheet-boxes",
		content: {
			tag: "msa-sheet-text"
		}
	})
	// db collection
//	defArg(typeObj, "dbCollection", type+"s")
//	if(typeof typeObj.dbCollection==="string") {
//		typeObj.dbCollection = msaDb.collection(typeObj.dbCollection)
//	}
	// insert in SheetTypes map
	SheetTypes[type] = typeObj
}
*/
// templates
var Templates = []
var registerTemplate = MsaSheetPt.registerTemplate = function(title, html, args) {
	if(!title || !html) return
	var template = { html: formatHtml(html) }
	// clone args into template
	template.title = title
	if(args) for(var a in args) template[a] = args[a]
	// default args
	defArg(template, "img", defaultTemplateImg)
	// insert in global map
	Templates.push(template)
	// register head (if some, or if html is webelement)
	var wel = (typeof html==="object") && (html.webelement || html.wel)
	if(wel){
		var head = template.head || html
		var tag = path.basename(wel, '.html')
		registerHead(tag, head)
	}
}
var defaultTemplateImg = "<img src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201024%201024%22%3E%3Cpath%20d%3D%22M896%200h-768c-70.4%200-128%2057.6-128%20128v768c0%2070.4%2057.6%20128%20128%20128h768c70.4%200%20128-57.6%20128-128v-768c0-70.4-57.6-128-128-128zM896%20896h-768v-768h768v768z%22%2F%3E%3C%2Fsvg%3E'>"


// head
var Heads = {}
var registerHead = MsaSheetPt.registerHead = function(tag, head) {
	Heads[tag] = formatHtml({ head:head }).head
}
// browse html to determine associated heads
var getHeads = function(htmlObj) {
	var heads = ""
	var type = typeof htmlObj
	if(type==="object") {
		// array
		var len = htmlObj.length
		if(len!==undefined) {
			for(var i=0; i<len; ++i)
				heads += getHeads(htmlObj[i])
			return heads
		}
		// object
		var tag = htmlObj.tag
		if(tag) {
			var head = Heads[tag]
			if(head) heads += head
		}
		// recursive call on content
		heads += getHeads(htmlObj.content)
	}
	return heads
}


// routes ////////////////////////////////////////////////////////////

MsaSheetPt.initApp = function(){

	this.app.get('/_sheet/:key', userMdw, async (req, res, next) => {
		try {
			const { key } = req.params
			const sheet = await this.getSheet(req, key)
			res.json(sheet)
		} catch(err) { next(err) }
	})

	this.app.post('/_sheet/:key', userMdw, async (req, res, next) => {
		try {
			const { key } = req.params
			const { update } = req.body
		//if(!checkArgs(body, ['update'], next)) return
			await this.upsertSheet(req, key, { body: update.content })
			res.sendStatus(200)
		} catch(err) { next(err) }
	})

	this.app.get('/templates', (req, res, next) => {
		res.json(Templates)
	})
}

// attachs
/*
sheetApp.get('/:type/:key/attach/*', function(req, res, next){
	var params=req.params, type=params.type, key=params.key, path=params[0]
	// build fullPath & update req
	var fullPath = getAttachPath(type, key, path)
	params[0] = fullPath
	// get file
	msaDbFiles.getMdw(req, res, function(err){
		// if not found, try to find it in drafts
		if(err==404) _getDraftAttach(type, key, path, req, res, next)
		else if(err) next(err)
	})
})
var _getDraftAttach = function(type, key, path, req, res, next){
	var params=req.params
	// build draftPath & update req
	var draftPath = getAttachPath(type, key, 'drafts/'+path)
	params[0] = draftPath
	// get file
	msaDbFiles.getMdw(req, res, next)
}

sheetApp.post('/:type/:key/attach/*', checkSheetWritePermMdw, function(req, res, next){
	var params=req.params, type=params.type, key=params.key, path=params[0]
	// build fullPath & update req
	var fullPath = getAttachPath(type, key, path)
	params[0] = fullPath
	// post file
	msaDbFiles.postMdw(req, res, next)
})

sheetApp.delete('/:type/:key/attach/*', checkSheetWritePermMdw, function(req, res, next){
	var params=req.params, type=params.type, key=params.key, path=params[0]
	// build fullPath & update req
	var fullPath = getAttachPath(type, key, path)
	params[0] = fullPath
	// delete file
	msaDbFiles.deleteMdw(req, res, next)
})

var getAttachPath = function(type, key, file){
	return '/sheet_attachs/'+type+'/'+key+'/'+file
}
*/
// common //////////////////////////////////////////

// get arg, with default value
const getArg = function(args, attr, defaultVal) {
	var val = args[attr]
	return (val===undefined) ? val : defaultVal
}

// set arg if not already defined
const defArg = function(args, attr, val) {
	if(args[attr]===undefined) args[attr] = val
}

// check if args are defined
const checkArgs = function(args, mandatoryArgs, next) {
	for(var i=0, len=mandatoryArgs.length; i<len; ++i) {
		var key = mandatoryArgs[i]
		if(args[key]===undefined) {
			var err = 'Missing mandatory argument "'+key+'"'
			if(next) next(err)
			else throw new Error(err)
			return false
		}
	}
	return true
}

const emptyFun = function(){}

const replyJson = function(res, next){
	return function(err, data){
		if(err) return next(err)
		res.json(data)
	}
}

const getHtmlByKey = function(html) {
	var keys = {}
	_getHtmlByKey1(html, keys)
	return keys
}
const _getHtmlByKey1 = function(html, keys) {
	var type = typeof html
	if(type==="object") {
		// array
		var len = html.length
		if(len!==undefined) {
			for(var i=0; i<len; ++i)
				_getHtmlByKey1(html[i], keys)
			return
		}
		// object
		var key = html.attrs && html.attrs['msa-sheet-key']
		if(key) keys[key] = html
		// content
		_getHtmlByKey1(html.content, keys)
	}
}

// transform keys starting with "new" by true value
const determineNewKeys = function(html) {
	var idx = 0
	var htmlByKey = getHtmlByKey(html)
	for(var key in htmlByKey) {
		if(key.substring(0, 3)!=="new") continue
		var htmlWithKey = htmlByKey[key]
		while(htmlByKey[idx.toString()]!==undefined)
			++idx
		if(!newBox.attrs) newBox.attrs = {}
		newBox.attrs['msa-sheet-key'] = idx.toString()
	}
}



// default templates

// no need to register the head of these web elements, as they are imported directly in msa-sheet.html
registerTemplate("Text", {tag:"msa-sheet-text"}, {
	img: "<img src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201024%201024%22%3E%3Cpath%20class%3D%22path1%22%20d%3D%22M896%200h-768c-17.664%200-32%2014.336-32%2032v192c0%2017.664%2014.336%2032%2032%2032h32c17.664%200%2032-14.336%2032-32l64-96h192v768l-160%2064c-17.664%200-32%2014.304-32%2032s14.336%2032%2032%2032h448c17.696%200%2032-14.304%2032-32s-14.304-32-32-32l-160-64v-768h192l64%2096c0%2017.664%2014.304%2032%2032%2032h32c17.696%200%2032-14.336%2032-32v-192c0-17.664-14.304-32-32-32z%22%3E%3C%2Fpath%3E%0A%3C%2Fsvg%3E'>"
})
registerTemplate("Boxes", {tag:"msa-sheet-boxes"}, {
	img: "<img src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201024%201024%22%3E%3Cpath%20d%3D%22M896%200h-768c-70.4%200-128%2057.6-128%20128v768c0%2070.4%2057.6%20128%20128%20128h768c70.4%200%20128-57.6%20128-128v-768c0-70.4-57.6-128-128-128zM896%20896h-768v-768h768v768z%22%2F%3E%3C%2Fsvg%3E'>"
})

// export
module.exports = MsaSheet

