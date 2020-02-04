import { importHtml, ajax } from "/utils/msa-utils.js"
import "/sheet/msa-sheet-content-editor.js"

const MsaSheetEdition = window.MsaSheetEdition = {}

importHtml(`<style>
	.msa-sheet-content-editing {
		outline: 1px dashed grey;
	}
</style>`)

// edit sheet
export function editSheet(sheet) {
	// save original html & css
	saveOriginalHtmlAndCss(sheet)
	// waiter
	var data = null, nbLoading = 0
	var next = function (idata) {
		if (idata) data = idata
		if (--nbLoading > 0) return
		editCallback(sheet, data)
	}
	// get sheet details
	++nbLoading
	getSheet(sheet.getBaseUrl(), sheet.getId(), next)
	// get box types
	++nbLoading
	getSheetTemplates(next)
}
var editCallback = function (sheet, data) {
	updateSheetDomFromData(sheet, data, function () {
		// activate edition mode
		_editSheet(sheet)
	})
}
MsaSheetEdition.editSheet = editSheet

// cancel sheet
export function cancelSheet(sheet) {
	// remove edition mode
	_stopEditSheet(sheet)
	// restore original html & css
	restoreOriginalHtmlAndCss(sheet)
}
MsaSheetEdition.cancelSheet = cancelSheet

// save sheet
export function saveSheet(sheet) {
	// remove edition mode
	_stopEditSheet(sheet)
	// clear original html & css
	clearOriginalHtmlAndCss(sheet)

	// rebuild innerHTML, by removing msa-editors (in template to avoid triggering element callbacks)
	var template = document.createElement("template")
	template.innerHTML = sheet.innerHTML
	removeEditors(template.content)
	// POST update
	var baseUrl = sheet.getBaseUrl()
	var id = sheet.getId()
	var body = {
		update: {
			content: template.innerHTML
		}
	}
	ajax('POST', baseUrl + '/_sheet/' + id, { body: body })
		.then(res => {
			// on update, rebuild sheet
			updateSheetDomFromData(sheet, res)
		})
}
MsaSheetEdition.saveSheet = saveSheet

function removeEditors(el) {
	// if editor remove
	if (el.getAttribute && el.getAttribute("msa-editor") === "true") el.remove()
	else {
		// recursive call on children (clone to array, as some of element will be removed)
		var children = Array.prototype.slice.call(el.children)
		for (var i = 0, len = children.length; i < len; ++i)
			removeEditors(children[i])
	}
}

// editing
function _editSheet(sheet) {
	sheet.editing = true
	sheet.classList.add("editing")
	// content
	editSheetContent(sheet)
}
export function editSheetContent(el) {
	if (!el) return
	// case array
	var len = el.length
	if (len !== undefined) {
		for (var i = 0; i < len; ++i) editSheetContent(el[i])
		return
	}
	// case dom
	var editor = el.msaSheetEditor_el || null
	if (!editor) {
		if (el.getMsaSheetEditor) {
			editor = document.createElement("msa-sheet-content-editor")
			document.body.appendChild(editor)
			// link edition menu to dom
			editor.linkTo(el)
			el.msaSheetEditor_el = editor
			el.classList.add('msa-sheet-content-editing')
		}
		// recursive call to children
		editSheetContent(el.children)
	}
	return editor
}
MsaSheetEdition.editSheetContent = editSheetContent

function _stopEditSheet(sheet) {
	sheet.editing = false
	sheet.classList.remove("editing")
	// content
	stopEditSheetContent(sheet)
}
export function stopEditSheetContent(el) {
	// remove edition menu, if exists
	if (el.msaSheetEditor_el) {
		el.msaSheetEditor_el.remove()
		delete el.msaSheetEditor_el
		el.classList.remove('msa-sheet-content-editing')
	}
	// recursive call to children
	var children = el.children
	for (var i = 0, len = children.length; i < len; ++i) {
		stopEditSheetContent(children[i])
	}
}
MsaSheetEdition.stopEditSheetContent = stopEditSheetContent

// original html & css
function saveOriginalHtmlAndCss(sheet) {
	// save original html (if needed)
	if (sheet.originalHtml === undefined)
		sheet.originalHtml = { body: sheet.innerHTML }
	// save original style (if needed)
	if (sheet.originalCssText === undefined)
		sheet.originalCssText = sheet.style.cssText || ""
}
function clearOriginalHtmlAndCss(sheet) {
	delete sheet.originalHtml
	delete sheet.originalCssText
}
function restoreOriginalHtmlAndCss(sheet) {
	// restore original html (if needed)
	if (sheet.originalHtml !== undefined)
		updateSheetHtml(sheet, sheet.originalHtml)
	// restore original style (if any)
	if (sheet.originalCssText !== undefined)
		sheet.style.cssText = sheet.originalCssText
	clearOriginalHtmlAndCss(sheet)
}

// get sheet from server
function getSheet(baseUrl, id, next) {
	ajax('GET', baseUrl + '/_sheet/' + id).then(next)
}

// get box types from server
function getSheetTemplates(next) {
	if (MsaSheetEdition.templates) return next && next()
	ajax('GET', '/sheet/templates')
		.then(res => {
			MsaSheetEdition.templates = res
			next && next()
		})
}

// update sheet dom from server data
function updateSheetDomFromData(sheet, data, next) {
	// innerHtml
	if (data && data.innerHtml)
		updateSheetHtml(sheet, data.innerHtml, next)
	else
		next && next()
}

function updateSheetHtml(sheet, html, next) {
	// duplicate children array, as it will be modified
	var children = Array.prototype.slice.call(sheet.children)
	// remove all sheet childs (except menu)
	for (var i = 0, len = children.length; i < len; ++i) {
		var child = children[i]
		if (child.tagName.toLowerCase() !== "msa-sheet-menu")
			child.remove()
	}
	// import new innerHtml
	importHtml(html, sheet).then(next)
}


function findParentSheet(el) {
	while (true) {
		const parentEl = el.parentNode
		if (!parentEl) return null
		if (parentEl.tagName === "MSA-SHEET") {
			return parentEl
		}
		el = parentEl
	}
}
MsaSheetEdition.findParentSheet = findParentSheet
