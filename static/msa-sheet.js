import { importHtml } from "/msa/msa.js"
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

	getType(){
		return this.getAttribute("type")
	}
	getKey(){
		return this.getAttribute("key")
	}
	isEditable(){
		return (this.getAttribute("editable")=="true")
	}

	connectedCallback(){
		this.editing = false
		// dynamically import msa-sheet-menu
		if(this.isEditable())
			importHtml({ wel:'/sheet/msa-sheet-menu.js' }, this)
	}
}

// register elem
customElements.define("msa-sheet", HTMLMsaSheetElement)


// register editable element
export class HTMLMsaSheetTextElement extends HTMLElement {
	getMsaSheetEditor(){
		return { wel:'/sheet/msa-sheet-text-editor.js' }
	}
}
customElements.define("msa-sheet-text", HTMLMsaSheetTextElement)

export class HTMLMsaSheetBoxesElement extends HTMLElement {
	getMsaSheetEditor(){
		return { wel:'/sheet/msa-sheet-boxes-editor.js' }
	}
}
customElements.define("msa-sheet-boxes", HTMLMsaSheetBoxesElement)

