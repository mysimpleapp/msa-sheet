import { importHtml, importOnCall, Q } from "/msa/msa.js"

const editionSrc = "/sheet/msa-sheet-edition.js"
const editSheet = importOnCall(editionSrc, "editSheet")
const saveSheet = importOnCall(editionSrc, "saveSheet")
const cancelSheet = importOnCall(editionSrc, "cancelSheet")

importHtml(`<style>
	msa-sheet-menu .buttons {
		position: absolute;
		top: 5px;
		right: 5px;
		z-index: 100;
	}
	msa-sheet-menu .icon {
		padding: 5px;
		outline: 0;
		width: 24px;
		height: 24px;
		border-radius: 3pt;
	}
	msa-sheet-menu .icon:hover {
		background: white;
		box-shadow: 1pt 1pt 3pt 1pt #aaa;
		border-radius: 3pt;
	}
</style>`)

const content = `
	<span class="buttons not-editing">
		<input class="icon edit" type="image" src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201024%201024%22%3E%3Cpath%20d%3D%22M864%200c88.364%200%20160%2071.634%20160%20160%200%2036.020-11.91%2069.258-32%2096l-64%2064-224-224%2064-64c26.742-20.090%2059.978-32%2096-32zM64%20736l-64%20288%20288-64%20592-592-224-224-592%20592zM715.578%20363.578l-448%20448-55.156-55.156%20448-448%2055.156%2055.156z%22%2F%3E%3C%2Fsvg%3E'>
	</span>
	<span class="buttons editing">
		<input class="icon save" type="image" src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201024%201024%22%3E%3Cpath%20d%3D%22M896%200h-896v1024h1024v-896l-128-128zM512%20128h128v256h-128v-256zM896%20896h-768v-768h64v320h576v-320h74.978l53.022%2053.018v714.982z%22%2F%3E%3C%2Fsvg%3E'>
		<input class="icon cancel" type="image" src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23999%22%20viewBox%3D%220%200%201024%201024%22%3E%3Cpath%20d%3D%22M0%20779.247l279.279%20-279.279%20-279.279%20-279.279%20220.689%20-220.689%20279.279%20279.279%20279.279%20-279.279%20220.689%20220.689%20-279.279%20279.279%20279.279%20279.279%20-220.689%20220.689%20-279.279%20-279.279%20-279.279%20279.279z%22%2F%3E%3C%2Fsvg%3E'>
	</span>`

export class HTMLMsaSheetMenuElement extends HTMLElement {

	connectedCallback() {
		this.Q = Q
		this.setAttribute("msa-editor", true)
		this.initContent()
		this.initActions()
		this.sheet = this.parentNode
		this.sync()
	}

	initContent() {
		this.innerHTML = content
	}

	sync() {
		const sheet = this.sheet
		this.Q(".buttons.editing").style.display = (sheet.isEditable() && sheet.editing) ? "" : "none"
		this.Q(".buttons.not-editing").style.display = (sheet.isEditable() && !sheet.editing) ? "" : "none"
	}

	initActions() {

		this.Q("input.edit").onclick = () => {
			var menu = this, sheet = menu.sheet
			sheet.editing = true
			menu.sync()
			editSheet(sheet)
		}

		this.Q("input.cancel").onclick = () => {
			var menu = this, sheet = menu.sheet
			sheet.editing = false
			menu.sync()
			cancelSheet(sheet)
		}

		this.Q("input.save").onclick = () => {
			var menu = this, sheet = menu.sheet
			sheet.editing = false
			menu.sync()
			saveSheet(sheet)
		}
	}
}

customElements.define("msa-sheet-menu", HTMLMsaSheetMenuElement)

