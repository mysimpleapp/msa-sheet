import { Q, importHtml } from "/msa/msa.js"
import "/sheet/msa-sheet-generic-editor.js"
import "/sheet/msa-sheet-templates.js"
import { addPopup } from "/utils/msa-utils-popup.js"

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
	<msa-sheet-generic-editor>
		<ul>
			<li><svg class="actInsertNewContent"><use xlink:href="#msa-sheet-boxes-editor-add"></use></svg></li>
			<li><svg><use xlink:href="#msa-sheet-boxes-editor-columns"></use></svg>
				<ul>
					<li><svg class="actRangeSubBoxesAsColumns"><use xlink:href="#msa-sheet-boxes-editor-columns"></use></svg></li>
					<li><svg class="actRangeSubBoxesAsRows"><use xlink:href="#msa-sheet-boxes-editor-rows"></use></svg></li>
				</ul>
			</li>
	  </ul>
	</msa-sheet-generic-editor>`

export class HTMLMsaSheetBoxesEditorElement extends HTMLElement {

	connectedCallback(){
		this.Q = Q
		this.initContent()
		this.initActions()
		this.target = this.parentNode.target
	}

	disconnectedCallback() {
		delete this.target
	}

	initContent(){
		this.innerHTML = content
	}

	insertNewContent(boxes, sheetTemplate) {
		importHtml(sheetTemplate.html, boxes).then(newContents => {
			MsaSheetEdition.editSheetContent(newContents)
		})
	}

	initActions(){

		this.Q(".actInsertNewContent").onclick = () => {
			var menu = this
			var popup = addPopup(this, "msa-sheet-templates")
			popup.onSelect = function(sheetTemplate) {
				menu.insertNewContent(menu.target, sheetTemplate)
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
