import { importHtml, ajax } from "/utils/msa-utils.js"
//import { HTMLMsaSheetMenuElement } from "/sheet/msa-sheet-menu.js"

importHtml(`<style>
	msa-sheet {
		position: relative;
		display: flex;
		flex: 1;
	}
	msa-sheet-text, msa-sheet-boxes, .msa-sheet-box {
		display:flex;
		flex-direction:column;
		flex:1;
		padding:3px;
		margin:3px;
	}
</style>`)


export class HTMLMsaSheetElement extends HTMLElement {

	getBaseUrl() {
		return this.getAttribute("base-url")
	}
	getId() {
		return this.getAttribute("sheet-id")
	}
	isEditable() {
		return (this.getAttribute("editable") == "true")
	}
	toFetch() {
		return (this.getAttribute("fetch") == "true")
	}

	async connectedCallback() {
		this.editing = false
		if (this.toFetch()) {
			const sheet = await ajax("GET", `${this.getBaseUrl()}/_sheet/${this.getId()}`)
			importHtml(sheet.content, this)
			this.setAttribute("editable", sheet.editable)
		}
		// dynamically import msa-sheet-menu
		if (this.isEditable())
			importHtml({ wel: '/sheet/msa-sheet-menu.js' }, this)
	}
}

// register elem
customElements.define("msa-sheet", HTMLMsaSheetElement)


// register editable element
export class HTMLMsaSheetTextElement extends HTMLElement {
	initContent() {
		for (let c of this.children)
			if (c.classList.contains("content"))
				return c
		const res = document.createElement("div")
		res.classList.add("content")
		res.style.flex = 1
		this.appendChild(res)
		return res
	}
	createMsaSheetEditor(editorParent) {
		import('/utils/msa-utils-text-editor.js').then(mod => {
			mod.makeTextEditable(this.initContent(), { editor: editorParent })
		})
	}
}
customElements.define("msa-sheet-text", HTMLMsaSheetTextElement)

export class HTMLMsaSheetBoxesElement extends HTMLElement {
	createMsaSheetEditor(editorParent) {
		importHtml({ wel: '/sheet/msa-sheet-boxes-editor.js' }, editorParent)
	}
}
customElements.define("msa-sheet-boxes", HTMLMsaSheetBoxesElement)

