/*

Plugin that adds a simple FPS meter.

Version : 1.2f


Copyright (c) 2024 Desert Lake

Licensed under MIT (https://github.com/crystal2d/extras/blob/main/LICENSE.md)

*/


class FPSMeter{static#t=!1;static#e=!1;static#i=0;static#s=null;static get enabled(){return this.#t}static set enabled(t){this.SetActive(t)}static get msMode(){return this.#e}static set msMode(t){this.#e=t,this.#i=.5}static SetActive(t){t!==this.#t&&(null==this.#s?(this.#s=document.createElement("div"),this.#s.style.position="absolute",this.#s.style.background="#ffffff7f",this.#s.style.margin="4px",this.#s.style.fontSize="20px",this.#s.style.minWidth="67px",this.#s.style.height="24px",this.#s.style.padding="8px 6px",this.#s.style.whiteSpace="pre-wrap",document.body.append(this.#s)):this.#s.style.display=t?"block":"none",t&&(this.#i=.5),this.#t=t)}static Update(){if(!this.#t)return;if(this.#i<.5)return void(this.#i+=Time.deltaTime);this.#i=0;const t=Application.targetFrameRate>0&&0===Application.vSyncCount;if(this.#e){const e=parseInt(1e3*Math.max((Time.deltaTime||Time.maximumDeltaTime)-(t?1/Application.targetFrameRate:5e-3),0));return void(this.#s.textContent=`ms  ${e}`)}const e=t?Math.min(parseInt(1/(Time.deltaTime||Time.maximumDeltaTime)),Application.targetFrameRate):parseInt(1/(Time.deltaTime||Time.maximumDeltaTime));this.#s.textContent=`FPS ${e}`}}