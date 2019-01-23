import { importHtml } from "/msa/msa.js"

importHtml(`<style>
	msa-sheet-templates .button {
		display: inline-block;
		width: 100px;
		height: 100px;
		margin: 10px;
		text-align: center;
		vertical-align: middle;
		border: 1px solid #aaa;
		border-radius: 10px;
		cursor: pointer;
	}
	msa-sheet-templates .button:hover {
		box-shadow: 2px 2px 5px 2px #aaa;
	}
	msa-sheet-templates .img {
		padding: 10px 0px 5px 20px;
		width: 60px;
		height: 60px;
	}
	msa-sheet-templates .img img {
		max-width: 60px;
		max-height: 60px;
	}
</style>`)


export class HTMLMsaSheetTemplatesElement extends HTMLElement {

	connectedCallback(){
		this.renderSheetTemplates()
	}

	renderSheetTemplates(){
		var templates = MsaSheetEdition.templates
		for(var i=0, len=templates.length; i<len; ++i) {
			var template = templates[i]
			var button = document.createElement("span")
			button.classList.add("button")
			button.innerHTML = "<div class='img'>" + template.img + "</div>"
			button.innerHTML += "<div class='title'>" + template.title + "</div>"
			button.holder = this
			button.template = template
			button.addEventListener("click", () => {
				var menu=this.holder, template=this.template
				if(menu.onSelect) menu.onSelect(template)
			})
			this.appendChild(button)
		}
	}
}

customElements.define("msa-sheet-templates", HTMLMsaSheetTemplatesElement)

