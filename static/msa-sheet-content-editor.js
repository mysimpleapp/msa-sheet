import { importHtml, Q } from "/utils/msa-utils.js"
import "/utils/msa-utils-dropdown-menu.js"
import "/sheet/msa-sheet-templates.js"
import { makeMovable } from "/utils/msa-utils-mover.js"
import { makeResizable } from "/utils/msa-utils-resizer.js"
import { popupFlexItemMenuFor } from "/utils/msa-utils-flex-item-menu.js"
import { importAsPopup, addConfirmPopup } from "/utils/msa-utils-popup.js"

// style
importHtml(`<style>
	msa-sheet-content-editor {
		position: absolute;
		white-space: nowrap;
		visibility: hidden;
	}
	.msa-sheet-content-editing.selected {
		box-shadow: 0pt 0pt 3pt 2pt #aaf;
	}
</style>`)

// SVGs
importHtml(`<svg id="msa-sheet-content-editor-svg" style="display:none">
	<!-- arrows -->
	<symbol id="msa-sheet-content-editor-arrows" viewBox="0 0 1024 1024" fill="#999">
		<path d="M512 0q18 0 30.333 12.333l150.667 151q12.667 12.667 12.667 30.333t-12.5 30.167-30.167 12.5-30.333-12.667l-78-78v323.667h323.667l-78-78q-12.667-12.667-12.667-30.333t12.5-30.167 30.167-12.5 30.333 12.667l151 150.667q12.333 12.333 12.333 30.333t-12.333 30l-151 151q-12.667 12.667-30.333 12.667t-30.167-12.5-12.5-30.167 12.667-30.333l78-78h-323.667v323.667l78-78q12.667-12.667 30.333-12.667t30.167 12.5 12.5 30.167-12.667 30.333l-150.667 151q-12.333 12.333-30.333 12.333-17.667 0-30-12.333l-151-151q-12.667-12.667-12.667-30.333t12.5-30.167 30.167-12.5 30.333 12.667l78 78v-323.667h-323.667l78 78q12.667 12.667 12.667 30.333t-12.5 30.167-30.167 12.5-30.333-12.667l-151-150.667q-12.333-12.333-12.333-30.333t12.333-30.333l151-150.667q12.667-12.667 30.333-12.667t30.167 12.5 12.5 30.167-12.667 30.333l-78 78h323.667v-323.667l-78 78q-12.667 12.667-30.333 12.667t-30.167-12.5-12.5-30.167 12.667-30.333l150.667-151q12.333-12.333 30.333-12.333z"></path>
	</symbol>
	<!-- gear -->
	<symbol id="msa-sheet-content-editor-gear" viewBox="0 0 32 32" fill="#999">
		<path d="M29.181 19.070c-1.679-2.908-0.669-6.634 2.255-8.328l-3.145-5.447c-0.898 0.527-1.943 0.829-3.058 0.829-3.361 0-6.085-2.742-6.085-6.125h-6.289c0.008 1.044-0.252 2.103-0.811 3.070-1.679 2.908-5.411 3.897-8.339 2.211l-3.144 5.447c0.905 0.515 1.689 1.268 2.246 2.234 1.676 2.903 0.672 6.623-2.241 8.319l3.145 5.447c0.895-0.522 1.935-0.82 3.044-0.82 3.35 0 6.067 2.725 6.084 6.092h6.289c-0.003-1.034 0.259-2.080 0.811-3.038 1.676-2.903 5.399-3.894 8.325-2.219l3.145-5.447c-0.899-0.515-1.678-1.266-2.232-2.226zM16 22.479c-3.578 0-6.479-2.901-6.479-6.479s2.901-6.479 6.479-6.479c3.578 0 6.479 2.901 6.479 6.479s-2.901 6.479-6.479 6.479z"></path>
	</symbol>
	<!-- trash -->
	<symbol id="msa-sheet-content-editor-trash" viewBox="0 0 1024 1024" fill="#999">
		<path d="M128 320v640c0 35.2 28.8 64 64 64h576c35.2 0 64-28.8 64-64v-640h-704zM320 896h-64v-448h64v448zM448 896h-64v-448h64v448zM576 896h-64v-448h64v448zM704 896h-64v-448h64v448z"></path>
		<path d="M848 128h-208v-80c0-26.4-21.6-48-48-48h-224c-26.4 0-48 21.6-48 48v80h-208c-26.4 0-48 21.6-48 48v80h832v-80c0-26.4-21.6-48-48-48zM576 128h-192v-63.198h192v63.198z"></path>
	</symbol>
</svg>`, document.body)

const content = `
	<msa-utils-dropdown-menu>
		<ul>
			<li><input type="image" src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201024%201024%22%3E%3Cpath%20d%3D%22M896%200h-768c-70.4%200-128%2057.6-128%20128v768c0%2070.4%2057.6%20128%20128%20128h768c70.4%200%20128-57.6%20128-128v-768c0-70.4-57.6-128-128-128zM896%20896h-768v-768h768v768z%22%2F%3E%3C%2Fsvg%3E'>
				<ul>
					<li><input class="actTemplate" type="image" src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cpath%20class%3D%22path1%22%20d%3D%22M14%2022h4v4h-4zM22%208c1.105%200%202%200.895%202%202v6l-6%204h-4v-2l6-4v-2h-10v-4h12zM16%203c-3.472%200-6.737%201.352-9.192%203.808s-3.808%205.72-3.808%209.192c0%203.472%201.352%206.737%203.808%209.192s5.72%203.808%209.192%203.808c3.472%200%206.737-1.352%209.192-3.808s3.808-5.72%203.808-9.192c0-3.472-1.352-6.737-3.808-9.192s-5.72-3.808-9.192-3.808zM16%200v0c8.837%200%2016%207.163%2016%2016s-7.163%2016-16%2016c-8.837%200-16-7.163-16-16s7.163-16%2016-16z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E'></li>
					<li><input type="image" src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cpath%20class%3D%22path1%22%20d%3D%22M22%200c-5.523%200-10%204.477-10%2010%200%200.626%200.058%201.238%200.168%201.832l-12.168%2012.168v6c0%201.105%200.895%202%202%202h2v-2h4v-4h4v-4h4l2.595-2.595c1.063%200.385%202.209%200.595%203.405%200.595%205.523%200%2010-4.477%2010-10s-4.477-10-10-10zM24.996%2010.004c-1.657%200-3-1.343-3-3s1.343-3%203-3%203%201.343%203%203-1.343%203-3%203z%22%3E%3C%2Fpath%3E%0A%3C%2Fsvg%3E'></li>
					<li><input class="actBackgroundColor" type="image" src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201024%201024%22%3E%3Cpath%20class%3D%22path1%22%20d%3D%22M1024%20576v-384h-192v-64c0-35.2-28.8-64-64-64h-704c-35.2%200-64%2028.8-64%2064v192c0%2035.2%2028.8%2064%2064%2064h704c35.2%200%2064-28.8%2064-64v-64h128v256h-576v128h-32c-17.674%200-32%2014.326-32%2032v320c0%2017.674%2014.326%2032%2032%2032h128c17.674%200%2032-14.326%2032-32v-320c0-17.674-14.326-32-32-32h-32v-64h576zM768%20192h-704v-64h704v64z%22%2F%3E%3C%2Fsvg%3E'></li>
					<li><input class="actStyle" type="image" src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201280%201024%22%3E%3Cpath%20class%3D%22path1%22%20d%3D%22M832%20736l96%2096%20320-320-320-320-96%2096%20224%20224z%22%3E%3C%2Fpath%3E%3Cpath%20class%3D%22path2%22%20d%3D%22M448%20288l-96-96-320%20320%20320%20320%2096-96-224-224z%22%3E%3C%2Fpath%3E%3Cpath%20class%3D%22path3%22%20d%3D%22M701.298%20150.519l69.468%2018.944-191.987%20704.026-69.468-18.944%20191.987-704.026z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E'></li>
					<li><svg><use xlink:href="#msa-sheet-content-editor-arrows"></use></svg>
						<ul>
							<li><svg class="actPositionInline"><use xlink:href="#msa-edition-flex-item-menu-row-inline"></use></svg></li>
							<li><svg class="actPositionFloat"><use xlink:href="#msa-edition-flex-item-menu-row-float"></use></svg></li>
							<li><svg class="actFlexItemMenu"><use xlink:href="#msa-sheet-content-editor-gear"></use></svg></li>
						</ul>
					</li>
					<li><svg class="actRemove"><use xlink:href="#msa-sheet-content-editor-trash"></use></svg></li>
			  </ul>
			</li>
		</ul>
	</msa-utils-dropdown-menu>`

const showStyleContent = `
	cssText:<br>
	<textarea class='cssText' style='width:500px; height:100px'></textarea>̀`

// msa-sheet-content-editor /////////////////////////////////////////////

// input color
const inputColor = document.createElement("input")
inputColor.type = "color"
inputColor.style.position = "absolute"
inputColor.style.left = "-1000px"
inputColor.style.top = "-1000px"
document.body.appendChild(inputColor)

export class HTMLMsaSheetContentEditorElement extends HTMLElement {

	connectedCallback() {
		this.Q = Q
		this.initContent()
		this.initActions()
		makeMovable(this)
	}

	disconnectedCallback() {
		this.unlink()
	}

	initContent() {
		this.innerHTML = content
	}

	linkTo(target) {
		this.unlink()
		if (!target) return
		this.target = target
		// set this position
		var pos = target.getBoundingClientRect()
		this.style.top = max(10, (pos.top - 50)) + "px"
		this.style.left = max(10, (pos.left + 30)) + "px"
		// check if target has a specific edition menu
		target.createMsaSheetEditor(this)
		// on target click
		target.addEventListener("mousedown", mouseDownSheetContentListener)
		target.addEventListener("mouseup", mouseUpSheetContentListener)
		// add mover & resizer
		makeMovableIfApplicable(target)
		makeResizable(target)
		// add (de)select callbacks
		target.addEventListener("select", selectCallback)
		target.addEventListener("deselect", deselectCallback)
		if (MsaSheetEdition.selectedBox !== target) deselectCallback.call(target)
		//		target.addEventListener("move", moveCallback)
	}

	unlink() {
		var target = this.target
		if (!target) return
		delete this.target
		// remove target click listener
		target.removeEventListener("mousedown", mouseDownSheetContentListener)
		target.removeEventListener("mouseup", mouseUpSheetContentListener)
		// deselect
		deselect(target)
		// remove mover & resizer
		makeMovable(target, false)
		makeResizable(target, false)
		// remove target callbacks
		target.removeEventListener("select", selectCallback)
		target.removeEventListener("deselect", deselectCallback)
		//		target.removeEventListener("move", moveCallback)
	}

	show() {
		this.style.visibility = "visible"
	}

	hide() {
		this.style.visibility = "hidden"
	}

	initActions() {

		this.Q(".actBackgroundColor").onclick = (evt, input) => {
			var target = this.target
			inputColor.oninput = function () {
				target.style.background = this.value
			}
			inputColor.click()
		}

		this.Q(".actTemplate").onclick = async () => {
			const popup = await importAsPopup(this, { wel: "/sheet/msa-sheet-templates.js" })
			popup.content.onSelect = async template => {
				const newContent = (await importHtml(template.html))[0]
				this.target.parentNode.replaceChild(newContent, this.target)
				MsaSheetEdition.editSheetContent(newContent)
				popup.remove()
			}
		}

		this.Q(".actStyle").onclick = () => {
			createShowStylePopup()
		}

		this.Q(".actRemove").onclick = () => {
			var target = this.target
			addConfirmPopup(this, "Are you sure to remove this element ?")
				.then(() => {
					if (target.msaSheetEditor_el) target.msaSheetEditor_el.remove()
					target.remove()
				})
		}

		this.Q(".actFlexItemMenu").onclick = () => {
			var target = this.target
			if (target) popupFlexItemMenuFor(target)
		}

		this.Q(".actPositionInline").onclick = () => {
			var target = this.target
			if (target) MsaEdition.setPositionInline(target)
		}

		this.Q(".actPositionFloat").onclick = () => {
			var target = this.target
			if (target) MsaEdition.setPositionFloat(target)
		}
	}
}

// callbacks

function selectCallback() {
	var mover = this.msaEditionMover
	if (mover) mover.show()
	var resizer = this.msaEditionResizer
	if (resizer) resizer.show()
	var flexItemMenu = this.msaEditionFlexItemMenu
	if (flexItemMenu) flexItemMenu.show()
}

function deselectCallback() {
	var mover = this.msaEditionMover
	if (mover) mover.hide()
	var resizer = this.msaEditionResizer
	if (resizer) resizer.hide()
	var flexItemMenu = this.msaEditionFlexItemMenu
	if (flexItemMenu) flexItemMenu.hide()
}

// various

function makeMovableIfApplicable(target) {
	var computedStyle = window.getComputedStyle(target)
	var pos = (computedStyle.position == "absolute") ? "float" : "inline"
	makeMovable(target, pos == "float")
}

customElements.define("msa-sheet-content-editor", HTMLMsaSheetContentEditorElement)



// msa-box-show-style-popup //////////////////////////////////////

export class HTMLMsaSheetShowStyleElement extends HTMLElement {

	connectedCallback() {
		this.Q = Q
	}

	linkTo(target) {
		this.target = target
		this.Q('.cssText').value = target.style.cssText
	}

	updateTarget() {
		var target = this.target
		if (target)
			target.style.cssText = this.Q('.cssText').value
	}
}

customElements.define("msa-sheet-show-style", HTMLMsaSheetShowStyleElement)

// popup
function createShowStylePopup() {
	var target = MsaSheetEdition.selectedContent
	var popup = importAsPopup(this, { wel: "msa-sheet-show-style" }, {
		buttons: [{
			text: "OK",
			act: function () {
				this.updateTarget()
			}
		}, {
			text: "Cancel"
		}]
	})
	popup.linkTo(target)
}

// box selection //////////////////////////////////

var mouseDownSheetContent = null, mouseUpSheetContent = null
var mouseDownSheetContentListener = function () {
	if (mouseDownSheetContent === null)
		mouseDownSheetContent = this
}
var mouseUpSheetContentListener = function () {
	if (mouseUpSheetContent === null)
		mouseUpSheetContent = this
	else return
	if (mouseDownSheetContent === mouseUpSheetContent)
		select(this)
}
document.addEventListener("click", function () {
	mouseDownSheetContent = null
	mouseUpSheetContent = null
})
var select = function (target) {
	if (MsaSheetEdition.selectedContent == target) return
	deselect()
	MsaSheetEdition.selectedContent = target
	target.msaSheetEditor_el.show()
	target.classList.add("selected")
	target.dispatchEvent(new Event("select"))
}
var deselect = function (target) {
	if (target === undefined) target = MsaSheetEdition.selectedContent
	if (!target) return
	if (target != MsaSheetEdition.selectedContent) return
	MsaSheetEdition.selectedContent = null
	var editor = target.msaSheetEditor_el
	if (editor) editor.hide()
	target.classList.remove("selected")
	target.dispatchEvent(new Event("deselect"))
}

// various

const max = Math.max
