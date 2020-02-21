import { importHtml, ajax, importObj } from "/utils/msa-utils.js"
import "/sheet/msa-sheet-content-editor.js"

const MsaSheetEdition = window.MsaSheetEdition = {}

importHtml(`<style>
	.msa-sheet-content-editing {
		outline: 1px dashed grey;
	}
</style>`)

// edit sheet
export async function editSheet(sheet) {
	// save original html & css
	saveOriginalHtmlAndCss(sheet)

	const [data, templates] = await Promise.all([
		getSheet(sheet.getBaseUrl(), sheet.getId()),
		getSheetBoxTemplates()])
	await updateSheetDomFromData(sheet, data)
	// activate edition mode
	sheet.editing = true
	sheet.classList.add("editing")
	// content
	editSheetContent(sheet)
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
export async function saveSheet(sheet) {
	// remove edition mode
	_stopEditSheet(sheet)
	// clear original html & css
	clearOriginalHtmlAndCss(sheet)

	// export content
	const tmpl = document.createElement("template")
	tmpl.innerHTML = sheet.innerHTML
	const content = await _exportChildBoxes(tmpl.content)

	// POST update
	var baseUrl = sheet.getBaseUrl()
	var id = sheet.getId()
	var body = { content }
	ajax('POST', baseUrl + '/_sheet/' + id, { body: body })
		.then(res => {
			// on update, rebuild sheet
			updateSheetDomFromData(sheet, res)
		})
}
MsaSheetEdition.saveSheet = saveSheet

async function _exportChildBoxes(el) {
	const templates = await getSheetBoxTemplates()
	const res = []
	for (const c of el.children) {
		const tagName = c.tagName.toLowerCase()
		const template = templates[tagName.toLowerCase()]
		if (template) {
			let exportSheetBox
			if (template.editionSrc)
				exportSheetBox = (await importObj(template.editionSrc)).exportSheetBox
			const r = exportSheetBox ? await asPrm(exportSheetBox(c)) : c.outerHTML
			if (r) res.push(r)
		}
	}
	return res
}

// editing
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
		if (el.createMsaSheetEditor) {
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
function getSheet(baseUrl, id) {
	return ajax('GET', baseUrl + '/_sheet/' + id)
}

// get box types from server
let SheetBoxTemplatesPrm
export async function getSheetBoxTemplates() {
	if (SheetBoxTemplatesPrm === undefined) {
		SheetBoxTemplatesPrm = ajax('GET', '/sheet/templates')
	}
	return SheetBoxTemplatesPrm
}

// update sheet dom from server data
async function updateSheetDomFromData(sheet, data) {
	// innerHtml
	if (data && data.innerHtml)
		await updateSheetHtml(sheet, data.innerHtml)
}

async function updateSheetHtml(sheet, html) {
	// duplicate children array, as it will be modified
	var children = Array.prototype.slice.call(sheet.children)
	// remove all sheet childs (except menu)
	for (var i = 0, len = children.length; i < len; ++i) {
		var child = children[i]
		if (child.tagName.toLowerCase() !== "msa-sheet-menu")
			child.remove()
	}
	// import new innerHtml
	await importHtml(html, sheet)
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

// native boxes edition

export const MsaSheetBoxesEdition = {
	exportSheetBox: async function (el) {
		const attrs = {}
		for (let a of el.attributes) if (a.nodeValue) attrs[a.nodeName] = a.nodeValue
		return {
			tag: "msa-sheet-boxes",
			attrs,
			content: await _exportChildBoxes(el)
		}
	}
}

// utils

function asPrm(a) {
	if (typeof a === "object" && a.then) return a
	return new Promise((ok, ko) => ok(a))
}