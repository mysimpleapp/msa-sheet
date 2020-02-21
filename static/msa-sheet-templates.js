import { importHtml } from "/utils/msa-utils.js"
import { getSheetBoxTemplates } from "/sheet/msa-sheet-edition.js"

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

	connectedCallback() {
		this.renderSheetBoxTemplates()
	}

	async renderSheetBoxTemplates() {
		const templates = await getSheetBoxTemplates()
		for (let key in templates) {
			const but = this.newTemplateButton(templates[key])
			this.appendChild(but)
		}
	}

	newTemplateButton(template) {
		const button = document.createElement("span")
		button.classList.add("button")
		button.innerHTML = "<div class='img'>" + template.img + "</div>"
		button.innerHTML += "<div class='title'>" + template.title + "</div>"
		button.template = template
		button.addEventListener("click", () => this.onSelect(template))
		return button
	}
}

customElements.define("msa-sheet-templates", HTMLMsaSheetTemplatesElement)

