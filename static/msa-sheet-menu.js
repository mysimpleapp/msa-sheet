import { importHtml, importOnCall, Q } from "/utils/msa-utils.js"

const addPopup = importOnCall("/utils/msa-utils-popup.js", "addPopup")

const editionSrc = "/sheet/msa-sheet-edition.js"
const editSheet = importOnCall(editionSrc, "editSheet")
const saveSheet = importOnCall(editionSrc, "saveSheet")
const cancelSheet = importOnCall(editionSrc, "cancelSheet")


importHtml(`<style>
	msa-sheet-menu > .inline-menu {
		position: absolute;
		top: 5px;
		right: 5px;
		z-index: 100;
	}
	msa-sheet-menu > .inline-menu input.icon {
		padding: 5px;
		outline: 0;
		width: 24px;
		height: 24px;
		border-radius: 3pt;
	}
	msa-sheet-menu > .inline-menu input.icon:hover {
		background: white;
		box-shadow: 1pt 1pt 3pt 1pt #aaa;
		border-radius: 3pt;
	}
</style>`)


const template = `
	<span class="inline-menu not-editing">
		<input class="icon edit" type="image" src='/utils/img/edit'>
		<input class="icon config" type="image" src='/utils/img/config'>
		</span>
	<span class="inline-menu editing">
		<input class="icon save" type="image" src='/utils/img/save'>
		<input class="icon cancel" type="image" src='/utils/img/cancel'>
	</span>`


export class HTMLMsaSheetMenuElement extends HTMLElement {

	connectedCallback() {
		this.Q = Q
		this.setAttribute("msa-editor", true)
		this.innerHTML = this.getTemplate()
		this.initActions()
		this.sheet = this.parentNode
		this.sync()
	}

	getTemplate() {
		return template
	}

	sync() {
		const sheet = this.sheet
		this.Q(".inline-menu.editing").style.display = (sheet.isEditable() && sheet.editing) ? "" : "none"
		this.Q(".inline-menu.not-editing").style.display = (sheet.isEditable() && !sheet.editing) ? "" : "none"
	}

	initActions() {
		this.Q("input.edit").onclick = () => this.edit()
		this.Q("input.config").onclick = () => this.popupConfig()
		this.Q("input.save").onclick = () => this.save()
		this.Q("input.cancel").onclick = () => this.cancel()
	}

	edit(){
		this.sheet.editing = true
		this.sync()
		editSheet(this.sheet)
	}

	popupConfig(){
		import("/params/msa-params-admin.js")
		const paramsEl = document.createElement("msa-params-admin")
		const id = this.sheet.getAttribute("sheet-id")
		paramsEl.setAttribute("base-url", `/sheet/_params/${id}`)
		addPopup(this, paramsEl)
	}

	save(){
		this.sheet.editing = false
		this.sync()
		saveSheet(this.sheet)
	}

	cancel(){
		this.sheet.editing = false
		this.sync()
		cancelSheet(this.sheet)
	}
}

customElements.define("msa-sheet-menu", HTMLMsaSheetMenuElement)