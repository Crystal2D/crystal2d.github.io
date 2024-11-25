/*

Plugin that lets you make the pixels in the screen crispier.

Version : 1f


Copyright (c) 2024 Desert Lake

Licensed under MIT (https://github.com/crystal2d/extras/blob/main/LICENSE.md)

*/


class Crispixels{static#e=!1;static#t=null;static get effect(){return this.#e}static set effect(e){this.#e=e,this.#i()}static#i(){const e=Application.htmlCanvas;if(null==e)throw BlankEngine.Err(1);return null==this.#t&&(this.#t=null!=window.getComputedStyle(e).msInterpolationMode),this.#e?this.#t?e.style.msInterpolationMode="nearest-neighbor":(e.style.imageRendering="pixelated","auto"===window.getComputedStyle(e).imageRendering&&(e.style.imageRendering="crisp-edges"),"auto"===window.getComputedStyle(e).imageRendering&&(e.style.imageRendering="optimize-contrast"),"auto"===window.getComputedStyle(e).imageRendering&&(e.style.imageRendering="-webkit-optimize-contrast"),"auto"===window.getComputedStyle(e).imageRendering&&(e.style.imageRendering="-o-crisp-edges"),"auto"===window.getComputedStyle(e).imageRendering&&(e.style.imageRendering="-moz-crisp-edges"),void("auto"===window.getComputedStyle(e).imageRendering&&(e.style.imageRendering="optimizeSpeed"))):this.#t?e.style.msInterpolationMode="auto":void(e.style.imageRendering="auto")}}