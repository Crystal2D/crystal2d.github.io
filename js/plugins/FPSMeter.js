/*

Plugin that adds a simple FPS meter.

Version : 1f


Copyright (c) 2024 Desert Lake

Licensed under MIT (https://github.com/crystal2d/extras/blob/main/LICENSE.md)

*/


class FPSMeter{static #a=!1;static #b=!1;static #c=0;static #d=null;static get enabled(){return this.#a}static set enabled(t){this.SetActive(t)}static get msMode(){return this.#b}static set msMode(t){this.#b=t,this.#c=.5}static SetActive(t){t!==this.#a&&(null==this.#d?(this.#d=document.createElement("div"),this.#d.style.position="absolute",this.#d.style.background="#ffffff7f",this.#d.style.margin="4px",this.#d.style.fontSize="20px",this.#d.style.minWidth="67px",this.#d.style.height="24px",this.#d.style.padding="8px 6px",this.#d.style.whiteSpace="pre-wrap",document.body.append(this.#d)):this.#d.style.display=t?"block":"none",t&&(this.#c=.5),this.#a=t)}static Update(){if(!this.#a)return;if(this.#c<.5){this.#c+=Time.deltaTime;return}if(this.#c=0,this.#b){let t=parseInt(1e3*Math.max(Time.deltaTime||Time.maximumDeltaTime,1/Application.targetFrameRate));this.#d.textContent=`ms  ${t}`;return}let e=Math.min(parseInt(1/(Time.deltaTime||Time.maximumDeltaTime)),Application.targetFrameRate);this.#d.textContent=`FPS ${e}`}}