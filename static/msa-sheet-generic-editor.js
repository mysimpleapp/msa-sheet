import { importHtml } from "/utils/msa-utils.js"

importHtml(`<style>
	msa-sheet-generic-editor ul {
		position: relative;
		line-height: 0;
		background-color: white;
		padding: 0;
		margin: 0;
		box-shadow: 1pt 1pt 2pt 1pt #aaa;
		display: inline-block;
		white-space: nowrap;
	}
	msa-sheet-generic-editor li {
		display: inline-block;
		cursor: pointer;
	}
	msa-sheet-generic-editor ul li ul {
		position: absolute;
		top: 41px;
		left: 0;
		display: none;
		min-width: 100%;
	}
	msa-sheet-generic-editor ul li:hover > ul {
		display: inline-block;
	}
	msa-sheet-generic-editor li > *:first-child {
		padding: 5px;
		margin: 3px;
		outline: 0;
		width: 24px;
		height: 24px;
	}
	msa-sheet-generic-editor li:hover > *:first-child {
		box-shadow: 1pt 1pt 3pt 1pt #aaa;
		border-radius: 3pt;
		background: #eee;
	}
</style>`)
