import { Q, importHtml, importRef } from "/utils/msa-utils.js"
import "/utils/msa-utils-dropdown-menu.js"
import { importAsPopup } from "/utils/msa-utils-popup.js"
import "/sheet/msa-sheet-templates.js"
import { findParentSheet, editSheetBox } from "/sheet/msa-sheet-edition.js"

// SVGs
importHtml(`<svg id="msa-sheet-boxes-editor-svg" style="display:none">
	<!-- add -->
	<symbol id="msa-sheet-boxes-editor-add" viewBox="0 0 1024 1024" fill="#999">
		<path class="path1" d="M992 384h-352v-352c0-17.672-14.328-32-32-32h-192c-17.672 0-32 14.328-32 32v352h-352c-17.672 0-32 14.328-32 32v192c0 17.672 14.328 32 32 32h352v352c0 17.672 14.328 32 32 32h192c17.672 0 32-14.328 32-32v-352h352c17.672 0 32-14.328 32-32v-192c0-17.672-14.328-32-32-32z"></path>
	</symbol>
	<!-- rows -->
	<symbol id="msa-sheet-boxes-editor-rows" viewBox="0 0 100 100" fill="none" stroke="#999" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">
		<path d="m5 5h20v90h-20v-90m35 0h20v90h-20v-90m35 0h20v90h-20v-90" />
	</symbol>
	<!-- columns -->
	<symbol id="msa-sheet-boxes-editor-columns" viewBox="0 0 100 100">
		<use xlink:href="#msa-sheet-boxes-editor-rows" transform="matrix(0 1 1 0 0 0)"></use>
	</symbol>
</svig>`, document.body)

// content
const content = `
	<msa-utils-dropdown-menu>
		<ul>
			<li><svg class="actInsertNewContent"><use xlink:href="#msa-sheet-boxes-editor-add"></use></svg></li>
			<li><svg><use xlink:href="#msa-sheet-boxes-editor-columns"></use></svg>
				<ul>
					<li><svg class="actRangeSubBoxesAsColumns"><use xlink:href="#msa-sheet-boxes-editor-columns"></use></svg></li>
					<li><svg class="actRangeSubBoxesAsRows"><use xlink:href="#msa-sheet-boxes-editor-rows"></use></svg></li>
				</ul>
			</li>
	  </ul>
	</msa-utils-dropdown-menu>`

export class HTMLMsaSheetBoxesEditorElement extends HTMLElement {

	connectedCallback() {
		this.Q = Q
		this.initContent()
		this.initActions()
		this.target = this.parentNode.target
	}

	disconnectedCallback() {
		delete this.target
	}

	initContent() {
		this.innerHTML = content
	}

	async insertNewContent(template) {
		let html, createSheetBox
		if (template.editionSrc) {
			const editObj = await importRef(template.editionSrc)
			createSheetBox = editObj.createSheetBox
		}
		if (createSheetBox) {
			const sheet = findParentSheet(this.target)
			html = createSheetBox(sheet)
		} else if (template.html) {
			html = template.html
		}
		if (!html) {
			console.warn("Could create sheet box")
			return
		}
		const newContent = (await importHtml(html, this.target))[0]
		editSheetBox(newContent)
	}

	initActions() {

		this.Q(".actInsertNewContent").onclick = async () => {
			const popup = await importAsPopup(this, { wel: "/sheet/msa-sheet-templates.js" })
			popup.content.onSelect = sheetTemplate => {
				this.insertNewContent(sheetTemplate)
				popup.remove()
			}
		}

		this.Q(".actRangeSubBoxesAsColumns").onclick = () => {
			var target = this.target
			target.style.position = "flex"
			target.style.flexDirection = "column"
		}

		this.Q(".actRangeSubBoxesAsRows").onclick = () => {
			var target = this.target
			target.style.position = "flex"
			target.style.flexDirection = "row"
		}
	}
}

// register element
customElements.define("msa-sheet-boxes-editor", HTMLMsaSheetBoxesEditorElement)