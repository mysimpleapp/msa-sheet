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
	// (box templates are get here only for a performance reason)
	const [data, _] = await Promise.all([
		getSheet(sheet.getBaseUrl(), sheet.getId()),
		getSheetBoxTemplates()])
	await updateSheetDomFromData(sheet, data)
	// activate edition mode
	sheet.editing = true
	sheet.classList.add("editing")
	// content
	for (let el of sheet.children)
		editSheetBox(el)
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
	ajax('POST', baseUrl + '/' + id, { body: body })
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
export async function editSheetBox(el) {
	const templates = await getSheetBoxTemplates()
	if (!(el.tagName.toLowerCase() in templates)) return
	let editor = el._msaSheetEditor || null
	if (editor) return editor
	editor = document.createElement("msa-sheet-content-editor")
	document.body.appendChild(editor)
	// link edition menu to dom
	editor.linkTo(el)
	el._msaSheetEditor = editor
	el.classList.add('msa-sheet-content-editing')
	return editor
}
MsaSheetEdition.editSheetBox = editSheetBox

function _stopEditSheet(sheet) {
	sheet.editing = false
	sheet.classList.remove("editing")
	// content
	stopEditSheetContent(sheet)
}
export function stopEditSheetContent(el) {
	// remove edition menu, if exists
	if (el._msaSheetEditor) {
		el._msaSheetEditor.remove()
		delete el._msaSheetEditor
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
	return ajax('GET', baseUrl + '/' + id)
}

// get box types from server
let SheetBoxTemplatesPrm
export async function getSheetBoxTemplates() {
	if (SheetBoxTemplatesPrm === undefined) {
		SheetBoxTemplatesPrm = ajax('GET', '/sheet/_templates')
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

// utils

export function findParentSheet(el) {
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

export const MsaSheetTextEdition = {
	editSheetBox: function (el, boxEditor) {
		import('/utils/msa-utils-text-editor.js').then(mod => {
			mod.makeTextEditable(el.initContent(), { editor: boxEditor })
		})
	}
}

export const MsaSheetBoxesEdition = {
	editSheetBox: function (el, boxEditor) {
		importHtml({ wel: '/sheet/msa-sheet-boxes-editor.js' }, boxEditor)
		for (let c of el.children) editSheetBox(c)
	},
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