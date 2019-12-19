import { importHtml, Q } from "/utils/msa-utils.js"
import "/sheet/msa-sheet-generic-editor.js"
import { addPopup, addInputPopup } from "/utils/msa-utils-popup.js"
//import { postFile } from "/fs/msa-fs.js"
//import "/fs/msa-fs-explorer.js"
//import "/img/msa-img-selector.js"

// SVGs
importHtml(`<svg id="msa-sheet-text-editor-svg" style="display:none">
	<!-- pen -->
	<symbol id="msa-sheet-text-editor-pen" viewBox="0 0 1024 1024">
		<path d="M864 0c88.364 0 160 71.634 160 160 0 36.020-11.91 69.258-32 96l-64 64-224-224 64-64c26.742-20.090 59.978-32 96-32zM64 736l-64 288 288-64 592-592-224-224-592 592zM715.578 363.578l-448 448-55.156-55.156 448-448 55.156 55.156z"/>
	</symbol>
	<!-- copy -->
	<symbol id="msa-sheet-text-editor-copy" viewBox="0 0 1024 1024">
		<path d="M640 256v-256h-448l-192 192v576h384v256h640v-768h-384zM192 90.51v101.49h-101.49l101.49-101.49zM64 704v-448h192v-192h320v192l-192 192v256h-320zM576 346.51v101.49h-101.49l101.49-101.49zM960 960h-512v-448h192v-192h320v640z"></path>
	</symbol>
	<!-- cut -->
	<symbol id="msa-sheet-text-editor-cut" viewBox="0 0 1024 1024">
		<path d="M913.826 679.694c-66.684-104.204-181.078-150.064-255.51-102.434-6.428 4.116-12.334 8.804-17.744 13.982l-79.452-124.262 183.462-287.972c15.016-27.73 20.558-60.758 13.266-93.974-6.972-31.75-24.516-58.438-48.102-77.226l-12.278-7.808-217.468 340.114-217.47-340.114-12.276 7.806c-23.586 18.79-41.13 45.476-48.1 77.226-7.292 33.216-1.75 66.244 13.264 93.974l183.464 287.972-79.454 124.262c-5.41-5.178-11.316-9.868-17.744-13.982-74.432-47.63-188.826-1.77-255.51 102.434-66.68 104.2-60.398 227.286 14.032 274.914 74.43 47.632 188.824 1.77 255.508-102.432l164.286-257.87 164.288 257.872c66.684 104.202 181.078 150.064 255.508 102.432 74.428-47.63 80.71-170.716 14.030-274.914zM234.852 800.43c-30.018 46.904-68.534 69.726-94.572 75.446-0.004 0-0.004 0-0.004 0-8.49 1.868-20.294 3.010-28.324-2.128-8.898-5.694-14.804-20.748-15.8-40.276-1.616-31.644 9.642-68.836 30.888-102.034 30.014-46.906 68.53-69.726 94.562-75.444 8.496-1.866 20.308-3.010 28.336 2.126 8.898 5.694 14.802 20.75 15.798 40.272 1.618 31.65-9.64 68.84-30.884 102.038zM480 512c-17.672 0-32-14.328-32-32s14.328-32 32-32 32 14.328 32 32-14.328 32-32 32zM863.85 833.47c-0.996 19.528-6.902 34.582-15.8 40.276-8.030 5.138-19.834 3.996-28.324 2.128 0 0 0 0-0.004 0-26.040-5.718-64.554-28.542-94.572-75.446-21.244-33.198-32.502-70.388-30.884-102.038 0.996-19.522 6.9-34.578 15.798-40.272 8.028-5.136 19.84-3.992 28.336-2.126 26.034 5.716 64.548 28.538 94.562 75.444 21.246 33.198 32.502 70.39 30.888 102.034z"></path>
	</symbol>
	<!-- paste -->
	<symbol id="msa-sheet-text-editor-paste" viewBox="0 0 1024 1024">
		<path d="M704 128h-128v-64c0-35.2-28.8-64-64-64h-128c-35.204 0-64 28.8-64 64v64h-128v128h512v-128zM512 128h-128v-63.886c0.034-0.038 0.072-0.078 0.114-0.114h127.768c0.042 0.036 0.082 0.076 0.118 0.114v63.886zM832 320v-160c0-17.6-14.4-32-32-32h-64v64h32v128h-192l-192 192v256h-256v-576h32v-64h-64c-17.602 0-32 14.4-32 32v640c0 17.6 14.398 32 32 32h288v192h640v-704h-192zM576 410.51v101.49h-101.49l101.49-101.49zM960 960h-512v-384h192v-192h320v576z"></path>
	</symbol>
	<!-- undo -->
	<symbol id="msa-sheet-text-editor-undo" viewBox="0 0 1024 1024">
		<path d="M761.862 1024c113.726-206.032 132.888-520.306-313.862-509.824v253.824l-384-384 384-384v248.372c534.962-13.942 594.57 472.214 313.862 775.628z"></path>
	</symbol>
	<!-- redo -->
	<symbol id="msa-sheet-text-editor-redo" viewBox="0 0 1024 1024">
		<path d="M576 248.372v-248.372l384 384-384 384v-253.824c-446.75-10.482-427.588 303.792-313.86 509.824-280.712-303.414-221.1-789.57 313.86-775.628z"></path>
	</symbol>
	<!-- text -->
	<symbol id="msa-sheet-text-editor-text" viewBox="0 0 1024 1024">
		<path d="M896 0h-768c-17.664 0-32 14.336-32 32v192c0 17.664 14.336 32 32 32h32c17.664 0 32-14.336 32-32l64-96h192v768l-160 64c-17.664 0-32 14.304-32 32s14.336 32 32 32h448c17.696 0 32-14.304 32-32s-14.304-32-32-32l-160-64v-768h192l64 96c0 17.664 14.304 32 32 32h32c17.696 0 32-14.336 32-32v-192c0-17.664-14.304-32-32-32z"></path>
	</symbol>
	<!-- bold -->
	<symbol id="msa-sheet-text-editor-bold" viewBox="0 0 32 32">
		<path d="M22.121 15.145c1.172-1.392 1.879-3.188 1.879-5.145 0-4.411-3.589-8-8-8h-10v28h12c4.411 0 8-3.589 8-8 0-2.905-1.556-5.453-3.879-6.855zM12 6h3.172c1.749 0 3.172 1.794 3.172 4s-1.423 4-3.172 4h-3.172v-8zM16.969 26h-4.969v-8h4.969c1.827 0 3.313 1.794 3.313 4s-1.486 4-3.313 4z"/>
	</symbol>
	<!-- italic -->
	<symbol id="msa-sheet-text-editor-italic" viewBox="0 0 32 32">
		<path d="M28 2v2h-4l-10 24h4v2h-14v-2h4l10-24h-4v-2z"/>
	</symbol>
	<!-- underline -->
	<symbol id="msa-sheet-text-editor-underline" viewBox="0 0 32 32">
		<path d="M22 2h4v13c0 4.971-4.477 9-10 9s-10-4.029-10-9v-13h4v13c0 1.255 0.57 2.459 1.605 3.391 1.153 1.038 2.714 1.609 4.395 1.609s3.242-0.572 4.395-1.609c1.035-0.931 1.605-2.136 1.605-3.391v-13zM6 26h20v4h-20z"/>
	</symbol>
	<!-- strikethrough -->
	<symbol id="msa-sheet-text-editor-strikethrough" viewBox="0 0 32 32">
		<path d="M32 16v2h-7.328c0.86 1.203 1.328 2.584 1.328 4 0 2.215-1.146 4.345-3.143 5.843-1.855 1.391-4.29 2.157-6.857 2.157s-5.002-0.766-6.857-2.157c-1.998-1.498-3.143-3.628-3.143-5.843h4c0 2.168 2.748 4 6 4s6-1.832 6-4c0-2.168-2.748-4-6-4h-16v-2h9.36c-0.073-0.052-0.146-0.104-0.217-0.157-1.998-1.498-3.143-3.628-3.143-5.843s1.146-4.345 3.143-5.843c1.855-1.391 4.29-2.157 6.857-2.157s5.002 0.766 6.857 2.157c1.997 1.498 3.143 3.628 3.143 5.843h-4c0-2.168-2.748-4-6-4s-6 1.832-6 4c0 2.168 2.748 4 6 4 2.468 0 4.814 0.709 6.64 2h9.36z"/>
	</symbol>
	<!-- remove format -->
	<symbol id="msa-sheet-text-editor-remove-format" viewBox="0 0 32 32">
		<path d="M0 28h18v4h-18zM28 4h-9.455l-5.743 22h-4.134l5.743-22h-8.411v-4h22zM29.055 32l-4.055-4.055-4.055 4.055-1.945-1.945 4.055-4.055-4.055-4.055 1.945-1.945 4.055 4.055 4.055-4.055 1.945 1.945-4.055 4.055 4.055 4.055z"/>
	</symbol>
	<!-- link -->
	<symbol id="msa-sheet-text-editor-link" viewBox="0 0 951 1024">
		<path d="M832 694.857q0-22.857-16-38.857l-118.857-118.857q-16-16-38.857-16-24 0-41.143 18.286 1.714 1.714 10.857 10.571t12.286 12.286 8.571 10.857 7.429 14.571 2 15.714q0 22.857-16 38.857t-38.857 16q-8.571 0-15.714-2t-14.571-7.429-10.857-8.571-12.286-12.286-10.571-10.857q-18.857 17.714-18.857 41.714 0 22.857 16 38.857l117.714 118.286q15.429 15.429 38.857 15.429 22.857 0 38.857-14.857l84-83.429q16-16 16-38.286zM430.286 292q0-22.857-16-38.857l-117.714-118.286q-16-16-38.857-16-22.286 0-38.857 15.429l-84 83.429q-16 16-16 38.286 0 22.857 16 38.857l118.857 118.857q15.429 15.429 38.857 15.429 24 0 41.143-17.714-1.714-1.714-10.857-10.571t-12.286-12.286-8.571-10.857-7.429-14.571-2-15.714q0-22.857 16-38.857t38.857-16q8.571 0 15.714 2t14.571 7.429 10.857 8.571 12.286 12.286 10.571 10.857q18.857-17.714 18.857-41.714zM941.714 694.857q0 68.571-48.571 116l-84 83.429q-47.429 47.429-116 47.429-69.143 0-116.571-48.571l-117.714-118.286q-47.429-47.429-47.429-116 0-70.286 50.286-119.429l-50.286-50.286q-49.143 50.286-118.857 50.286-68.571 0-116.571-48l-118.857-118.857q-48-48-48-116.571t48.571-116l84-83.429q47.429-47.429 116-47.429 69.143 0 116.571 48.571l117.714 118.286q47.429 47.429 47.429 116 0 70.286-50.286 119.429l50.286 50.286q49.143-50.286 118.857-50.286 68.571 0 116.571 48l118.857 118.857q48 48 48 116.571z"></path>
	</symbol>
	<!-- unlink -->
	<symbol id="msa-sheet-text-editor-unlink" viewBox="0 0 951 1024">
		<path d="M250.857 726.286l-146.286 146.286q-5.714 5.143-13.143 5.143-6.857 0-13.143-5.143-5.143-5.714-5.143-13.143t5.143-13.143l146.286-146.286q5.714-5.143 13.143-5.143t13.143 5.143q5.143 5.714 5.143 13.143t-5.143 13.143zM347.429 749.714v182.857q0 8-5.143 13.143t-13.143 5.143-13.143-5.143-5.143-13.143v-182.857q0-8 5.143-13.143t13.143-5.143 13.143 5.143 5.143 13.143zM219.429 621.714q0 8-5.143 13.143t-13.143 5.143h-182.857q-8 0-13.143-5.143t-5.143-13.143 5.143-13.143 13.143-5.143h182.857q8 0 13.143 5.143t5.143 13.143zM941.714 694.857q0 68.571-48.571 116l-84 83.429q-47.429 47.429-116 47.429-69.143 0-116.571-48.571l-190.857-191.429q-12-12-24-32l136.571-10.286 156 156.571q15.429 15.429 38.857 15.714t38.857-15.143l84-83.429q16-16 16-38.286 0-22.857-16-38.857l-156.571-157.143 10.286-136.571q20 12 32 24l192 192q48 49.143 48 116.571zM589.143 281.143l-136.571 10.286-156-156.571q-16-16-38.857-16-22.286 0-38.857 15.429l-84 83.429q-16 16-16 38.286 0 22.857 16 38.857l156.571 156.571-10.286 137.143q-20-12-32-24l-192-192q-48-49.143-48-116.571 0-68.571 48.571-116l84-83.429q47.429-47.429 116-47.429 69.143 0 116.571 48.571l190.857 191.429q12 12 24 32zM950.857 329.143q0 8-5.143 13.143t-13.143 5.143h-182.857q-8 0-13.143-5.143t-5.143-13.143 5.143-13.143 13.143-5.143h182.857q8 0 13.143 5.143t5.143 13.143zM640 18.286v182.857q0 8-5.143 13.143t-13.143 5.143-13.143-5.143-5.143-13.143v-182.857q0-8 5.143-13.143t13.143-5.143 13.143 5.143 5.143 13.143zM872.571 104.571l-146.286 146.286q-6.286 5.143-13.143 5.143t-13.143-5.143q-5.143-5.714-5.143-13.143t5.143-13.143l146.286-146.286q5.714-5.143 13.143-5.143t13.143 5.143q5.143 5.714 5.143 13.143t-5.143 13.143z"></path>
	</symbol>
	<!-- justify left -->
	<symbol id="msa-sheet-text-editor-justify-left" viewBox="0 0 32 32">
		<path d="M0 2h32v4h-32zM0 8h20v4h-20zM0 20h20v4h-20zM0 14h32v4h-32zM0 26h32v4h-32z"/>
	</symbol>
	<!-- justify center -->
	<symbol id="msa-sheet-text-editor-justify-center" viewBox="0 0 32 32">
		<path d="M0 2h32v4h-32zM6 8h20v4h-20zM6 20h20v4h-20zM0 14h32v4h-32zM0 26h32v4h-32z"/>
	</symbol>
	<!-- justify right -->
	<symbol id="msa-sheet-text-editor-justify-right" viewBox="0 0 32 32">
		<path d="M0 2h32v4h-32zM12 8h20v4h-20zM12 20h20v4h-20zM0 14h32v4h-32zM0 26h32v4h-32z"/>
	</symbol>
	<!-- justify full -->
	<symbol id="msa-sheet-text-editor-justify-full" viewBox="0 0 1024 1024">
		<path d="M0 64h1024v128h-1024zM0 256h1024v128h-1024zM0 448h1024v128h-1024zM0 640h1024v128h-1024zM0 832h1024v128h-1024z"></path>
	</symbol>
	<!-- indent -->
	<symbol id="msa-sheet-text-editor-indent" viewBox="0 0 32 32">
		<path d="M0 2h32v4h-32zM12 8h20v4h-20zM12 14h20v4h-20zM12 20h20v4h-20zM0 26h32v4h-32zM0 22v-12l8 6z"/>
	</symbol>
	<!-- outdent -->
	<symbol id="msa-sheet-text-editor-outdent" viewBox="0 0 32 32">
		<path d="M0 2h32v4h-32zM12 8h20v4h-20zM12 14h20v4h-20zM12 20h20v4h-20zM0 26h32v4h-32zM8 10v12l-8-6z"/>
	</symbol>
	<!-- unordered list -->
	<symbol id="msa-sheet-text-editor-unordered-list" viewBox="0 0 32 32">
		<path d="M12 2h20v4h-20v-4zM12 14h20v4h-20v-4zM12 26h20v4h-20v-4zM0 4c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM0 16c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM0 28c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4z"/>
	</symbol>
	<!-- ordered list -->
	<symbol id="msa-sheet-text-editor-ordered-list" viewBox="0 0 32 32">
		<path d="M12 26h20v4h-20zM12 14h20v4h-20zM12 2h20v4h-20zM6 0v8h-2v-6h-2v-2zM4 16.438v1.563h4v2h-6v-4.563l4-1.875v-1.563h-4v-2h6v4.563zM8 22v10h-6v-2h4v-2h-4v-2h4v-2h-4v-2z"/>
	</symbol>
	<!-- color palette -->
	<symbol id="msa-sheet-text-editor-color-palette" viewBox="0 0 1024 1024">
		<path d="M746 512q26 0 45-18t19-46-19-46-45-18-45 18-19 46 19 46 45 18zM618 342q26 0 45-19t19-45-19-45-45-19-45 19-19 45 19 45 45 19zM406 342q26 0 45-19t19-45-19-45-45-19-45 19-19 45 19 45 45 19zM278 512q26 0 45-18t19-46-19-46-45-18-45 18-19 46 19 46 45 18zM512 128q158 0 271 100t113 242q0 88-63 150t-151 62h-74q-28 0-46 19t-18 45q0 22 16 42t16 44q0 28-18 46t-46 18q-160 0-272-112t-112-272 112-272 272-112z"></path>
	</symbol>
	<!-- A -->
	<symbol id="msa-sheet-text-editor-A" viewBox="0 0 32 32">
		<path d="M10.063 26l1.8-6h8.274l1.8 6h3.551l-6-20h-6.976l-6 20h3.551zM14.863 10h2.274l1.8 6h-5.874l1.8-6z"/>
	</symbol>
	<!-- image -->
	<symbol id="msa-sheet-text-editor-img" viewBox="0 0 32 32">
		<path d="M29.996 4c0.001 0.001 0.003 0.002 0.004 0.004v23.993c-0.001 0.001-0.002 0.003-0.004 0.004h-27.993c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993zM30 2h-28c-1.1 0-2 0.9-2 2v24c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-24c0-1.1-0.9-2-2-2v0z"></path>
		<path d="M26 9c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
		<path d="M28 26h-24v-4l7-12 8 10h2l7-6z"></path>
	</symbol>
	<!-- attach -->
	<symbol id="msa-sheet-text-editor-attach" viewBox="0 0 32 32">
		<path d="M20.807 10.22l-2.030-2.029-10.15 10.148c-1.682 1.681-1.682 4.408 0 6.089s4.408 1.681 6.090 0l12.18-12.178c2.804-2.802 2.804-7.346 0-10.148-2.802-2.803-7.347-2.803-10.149 0l-12.788 12.787c-0.009 0.009-0.019 0.018-0.027 0.026-3.909 3.909-3.909 10.245 0 14.153 3.908 3.908 10.246 3.908 14.156 0 0.009-0.009 0.016-0.018 0.026-0.027l0.001 0.001 8.729-8.728-2.031-2.029-8.729 8.727c-0.009 0.008-0.018 0.018-0.026 0.026-2.784 2.783-7.312 2.783-10.096 0-2.783-2.783-2.783-7.31 0-10.093 0.010-0.009 0.019-0.018 0.028-0.026l-0.001-0.002 12.79-12.786c1.678-1.679 4.411-1.679 6.090 0s1.678 4.411 0 6.089l-12.18 12.178c-0.56 0.56-1.47 0.56-2.030 0-0.559-0.559-0.559-1.47 0-2.029l10.15-10.149z"></path>
	</symbol>
	<!-- source -->
	<symbol id="msa-sheet-text-editor-source" viewBox="0 0 1280 1024">
		<path d="M832 736l96 96 320-320-320-320-96 96 224 224z"></path>
		<path d="M448 288l-96-96-320 320 320 320 96-96-224-224z"></path>
		<path d="M701.298 150.519l69.468 18.944-191.987 704.026-69.468-18.944 191.987-704.026z"></path>
	</symbol>
</svg>`, document.body)

// msa-sheet-text-editor

importHtml(`<style>
	msa-sheet-text-editor svg {
		fill: #999;
	}
	msa-sheet-text .content:focus {
		outline: 0;
	}
</style>`)

const content = `
	<msa-sheet-generic-editor>
		<ul>
			<li><svg><use xlink:href="#msa-sheet-text-editor-pen"></use></svg>
				<ul>
					<li><svg class="actCopy"><use xlink:href="#msa-sheet-text-editor-copy"></use></svg></li>
					<li><svg class="actCut"><use xlink:href="#msa-sheet-text-editor-cut"></use></svg></li>
					<li><svg class="actPaste separator"><use xlink:href="#msa-sheet-text-editor-paste"></use></svg></li>
					<li><svg class="actUndo"><use xlink:href="#msa-sheet-text-editor-undo"></use></svg></li>
					<li><svg class="actRedo"><use xlink:href="#msa-sheet-text-editor-redo"></use></svg></li>
				</ul>
			</li>
			<li><svg><use xlink:href="#msa-sheet-text-editor-text"></use></svg>
				<ul>
					<li><svg class="actBold"><use xlink:href="#msa-sheet-text-editor-bold"></use></svg></li>
					<li><svg class="actItalic"><use xlink:href="#msa-sheet-text-editor-italic"></use></svg></li>
					<li><svg class="actUnderline"><use xlink:href="#msa-sheet-text-editor-underline"></use></svg></li>
					<li><svg class="actStrikethrough"><use xlink:href="#msa-sheet-text-editor-strikethrough"></use></svg></li>
					<li><svg class="actRemoveFormat separator"><use xlink:href="#msa-sheet-text-editor-remove-format"></use></svg></li>
					<li><svg class="actLink"><use xlink:href="#msa-sheet-text-editor-link"></use></svg></li>
					<li><svg class="actUnlink"><use xlink:href="#msa-sheet-text-editor-unlink"></use></svg></li>
				</ul>
			</li>
			<li><svg><use xlink:href="#msa-sheet-text-editor-justify-full"></use></svg>
				<ul>
					<li><svg class="actJustifyLeft"><use xlink:href="#msa-sheet-text-editor-justify-left"></use></svg></li>
					<li><svg class="actJustifyCenter"><use xlink:href="#msa-sheet-text-editor-justify-center"></use></svg></li>
					<li><svg class="actJustifyRight"><use xlink:href="#msa-sheet-text-editor-justify-right"></use></svg></li>
					<li><svg class="actJustifyFull separator"><use xlink:href="#msa-sheet-text-editor-justify-full"></use></svg></li>
					<li><svg class="actIndent"><use xlink:href="#msa-sheet-text-editor-indent"></use></svg></li>
					<li><svg class="actOutdent separator"><use xlink:href="#msa-sheet-text-editor-outdent"></use></svg></li>
					<li><svg class="actUnorderedList"><use xlink:href="#msa-sheet-text-editor-unordered-list"></use></svg></li>
					<li><svg class="actOrderedList"><use xlink:href="#msa-sheet-text-editor-ordered-list"></use></svg></li>
				</ul>
			</li>
			<li><svg><use xlink:href="#msa-sheet-text-editor-color-palette"></use></svg>
				<ul>
					<li><svg class="actForeColor" style="fill:red"><use xlink:href="#msa-sheet-text-editor-A"></use></svg></li>
					<li><svg class="actBackColor" style="background-color:red; fill:white"><use xlink:href="#msa-sheet-text-editor-A"></use></svg></li>
				</ul>
			</li>
			<li><svg class="actInsertImg"><use xlink:href="#msa-sheet-text-editor-img"></use></svg></li>
			<li><svg class="actShowAttachs"><use xlink:href="#msa-sheet-text-editor-attach"></use></svg></li>
			<li><svg class="actHtml"><use xlink:href="#msa-sheet-text-editor-source"></use></svg></li>
		</ul>
	</msa-sheet-generic-editor>`

// global input color
const inputColor = document.createElement("input")
inputColor.type = "color"
inputColor.style.position = "absolute"
inputColor.style.left = "-1000px"
inputColor.style.top = "-1000px"
document.body.appendChild(inputColor)

// various ////////////////////////////

// get target content (and create it if needed)
function getTargetContent(target) {
	// find content
	var content = null
	for(var i=0, children=target.children, len=children.length; i<len; ++i) {
		var child=children[i]
		if(child.classList.contains("content")) {
			content = child
			break
		}
	}
	// if not exists, create content
	if(content===null) {
		content = document.createElement("div")
		content.classList.add("content")
		content.style.flex = 1
		target.appendChild(content)
	}
	return content
}

// make SVG button not focusable
function makeNotFocusable(el) {
	el.addEventListener("mousedown", function(e){
		e.stopImmediatePropagation()
		e.preventDefault()
	})
}

// get & restore selection
function getSelection() {
	return window.getSelection().getRangeAt(0)
}
function restoreSelection(sel) {
	var selection = window.getSelection()
	selection.removeAllRanges()
	selection.addRange(sel)
}

// msa-sheet-text-editor ///////////////////////////////////////////////////////////////////////

export class HTMLMsaSheetTextEditor extends HTMLElement {

	connectedCallback(){
		this.Q = Q
		this.initContent()
		this.initActions()
		// make svg buttons not focusable (hack to make them work with document.execCommand)
		const svgs = this.querySelectorAll("svg")
		for(var i=0, len=svgs.length; i<len; ++i)
			makeNotFocusable(svgs[i])
		// target link
		const target = this.target = this.parentNode.target
		// make target content editable
		const targetContent = getTargetContent(target)
		targetContent.setAttribute("contenteditable","true")
	}

	disconnectedCallback(){
		// make target content not editable
		const targetContent = getTargetContent(this.target)
		targetContent.removeAttribute("contenteditable")
		// remove target link
		delete this.target
	}

	initContent() {
		this.innerHTML = content
	}

	initActions() {

		this.Q(".actCopy").onclick = () => { document.execCommand('copy', false) }
		this.Q(".actCut").onclick = () => { document.execCommand('cut', false) }
		this.Q(".actPaste").onclick = () => { document.execCommand('paste', false) }
		this.Q(".actUndo").onclick = () => { document.execCommand('undo', false) }
		this.Q(".actRedo").onclick = () => { document.execCommand('redo', false) }

		// text actions
		this.Q(".actBold").onclick = () => { document.execCommand('bold', false) }
		this.Q(".actItalic").onclick = () => { document.execCommand('italic', false) }
		this.Q(".actUnderline").onclick = () => { document.execCommand('underline', false) }
		this.Q(".actStrikethrough").onclick = () => { document.execCommand('strikethrough', false) }
		this.Q(".actRemoveFormat").onclick = () => { document.execCommand('formatBlock', false, 'div') }
		this.Q(".actLink").onclick = () => {
			var target = this.target
			var sel = getSelection()
			addInputPopup(this, "Enter an URL:")
			.then(val => {
				restoreSelection(sel)
				document.execCommand("createLink", false, val)
			})
		}
		this.Q(".actUnlink").onclick = () => { document.execCommand('unlink', false) }
//		this.Q(".actFormatP").onclick = () => { document.execCommand('formatBlock', false, 'p') }
//		this.Q(".actFormatH1").onclick = () => { document.execCommand('formatBlock', false, 'h1') }
//		this.Q(".actFormatH2").onclick = () => { document.execCommand('formatBlock', false, 'h2') }

		// indent actions
		this.Q(".actJustifyLeft").onclick = () => { document.execCommand('justifyLeft', false) }
		this.Q(".actJustifyCenter").onclick = () => { document.execCommand('justifyCenter', false) }
		this.Q(".actJustifyRight").onclick = () => { document.execCommand('justifyRight', false) }
		this.Q(".actJustifyFull").onclick = () => { document.execCommand('justifyFull', false) }
		this.Q(".actUnorderedList").onclick = () => { document.execCommand('insertUnorderedList', false) }
		this.Q(".actOrderedList").onclick = () => { document.execCommand('insertOrderedList', false) }
		this.Q(".actIndent").onclick = () => { document.execCommand('indent', false) }
		this.Q(".actOutdent").onclick = () => { document.execCommand('outdent', false) }

		// color actions
		this.Q(".actForeColor").onclick = () => {
			inputColor.onchange = foreColorOnchange
			inputColor.click()
		}
		var foreColorOnchange = function(){ document.execCommand('foreColor', false, this.value) }
		this.Q(".actBackColor").onclick = () => {
			inputColor.onchange = backColorOnchange
			inputColor.click()
		}
		var backColorOnchange = function(){ document.execCommand('backColor', false, this.value) }

		// html
		this.Q(".actHtml").onclick = () => { createShowHtmlPopup() }

		// image
		this.Q(".actInsertImg").onclick = () => {
			var editor = this
			var sel = getSelection()
			var imageSelector = MsaImg.popupImgSelector(function(imgSelection){
				imgSelectorOnSelect(editor, imgSelection, sel)
			})
		}
		var getParentSheet = function(el){
			var parent = el
			do {
				var parent = parent.parentNode
			} while(parent && parent.tagName!="MSA-SHEET")
			return parent
		}
		var imgSelectorOnSelect = function(editor, imgSelection, selection){
			restoreSelection(selection)
//		var selection = window.getSelection().getRangeAt(0)
			var img = document.createElement("img")
			var src = imgSelection.src, file = imgSelection.file
			if(src) {
				img.src = src
				selection.insertNode(img)
			} else if(file) {
				var sheet = getParentSheet(editor.target)
				var sheetType = sheet.getAttribute('type'), sheetId = sheet.getAttribute('sheet-id')
				postFile(file, '/sheet/'+sheetType+'/'+sheetId+'/attach/drafts/', function(metadatas) {
					var filename = metadatas[0].name
					img.src = '/sheet/'+sheetType+'/'+sheetId+'/attach/'+filename
					selection.insertNode(img)
				})
			}
		}

		// attach
		this.Q(".actShowAttachs").onclick = () => {
			var sheet = getParentSheet(this.target)
			var type = sheet.getAttribute('type'), id = sheet.getAttribute('sheet-id')
			var explorer = document.createElement("msa-fs-explorer")
			explorer.setAttribute("base-url", "/sheet/"+type+'/'+id+'/attach')
			addPopup(this, explorer)
		}
	}
}

// register element
customElements.define("msa-sheet-text-editor", HTMLMsaSheetTextEditor)


// msa-sheet-show-html-popup //////////////////////////////////////

const showHtmlPopupContent = `
	innerHTML:<br>
	<textarea class='innerHTML' style='width:500px; height:400px'></textarea>
	<div style="text-align:right">
		<button class="ok">Ok</button> 
		<button class="cancel">Cancel</button>
	</div>`


class HTMLMsaSheetShowHtmlPopupElement extends HTMLElement {

	connectedCallback(){
		this.Q = Q
		this.initContent()
	}

	initContent(){
		this.innerHTML = showHtmlPopupContent
	}

	initActions(){
		this.Q("button.ok").onclick = () => {
			this.updateTarget()
			this.remove()
		}
		this.Q("button.cancel").onclick = () => this.cancel()
	}

	linkTo(target) {
		this.target = target
		var content = getTargetContent(target)
		this.Q(".innerHTML").value = content.innerHTML
	}

	updateTarget() {
		var target = this.target
		if(target) {
			var content = getTargetContent(target)
			content.innerHTML = this.Q(".innerHTML").value
		}
	}
}

customElements.define("msa-sheet-show-html-popup", HTMLMsaSheetShowHtmlPopupElement)

// popup
function createShowHtmlPopup() {
	var target = MsaSheetEdition.selectedContent
	const popup = document.createElement("msa-sheet-show-html-popup")
	document.body.appendChild(popup)
}
