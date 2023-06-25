class Application{static #a=!1;static htmlCanvas=null;static gl=null;static targetFrameRate=-1;static get isLoaded(){return this.#a}static init(t,a){if(null==t||null==a)throw BlankEngine.Err(0);this.#a||(null!=this.gl&&document.querySelector("canvas").remove(),this.htmlCanvas=document.createElement("canvas"),this.htmlCanvas.width=t,this.htmlCanvas.height=a,this.htmlCanvas.style.margin="auto",this.htmlCanvas.style.objectFit="contain",this.gl=this.htmlCanvas.getContext("webgl2"),this.gl.clearColor(0,0,0,1),document.body.appendChild(this.htmlCanvas))}static Quit(){window.close()}static async Load(){this.#a||(Debug.Set(BlankEngine.Inner.buildData.debugMode),await SceneManager.Load(0),this.#a=!0)}}class Window{static #a=!1;static #b=!1;static #c=0;static data={title:"Untitled",width:0,height:0,marginX:0,marginY:0,resizable:!0,fillWindow:!0,icon:""};static fullScreen=!1;static OnFullscreenEnter=()=>{};static OnFullscreenExit=()=>{};static #d(){requestAnimationFrame(this.#e.bind(this))}static #e(){document.hasFocus()&&(document.fullscreenElement&&!this.fullScreen?(Window.OnFullscreenExit(),document.exitFullscreen()):!document.fullscreenElement&&this.fullScreen&&(Window.OnFullscreenEnter(),document.documentElement.requestFullscreen())),this.#f(),this.#d()}static #f(){if(this.data.fillWindow&&1!=this.#c&&(Application.htmlCanvas.width=window.innerWidth-this.data.marginX/100*window.innerWidth,Application.htmlCanvas.height=window.innerHeight-this.data.marginY/100*window.innerHeight,this.#c=1),this.data.fillWindow||2==this.#c||(Application.htmlCanvas.width=this.data.width,Application.htmlCanvas.height=this.data.height,this.#c=2),Application.htmlCanvas.style.width=`${100-2*this.data.marginX}%`,Application.htmlCanvas.style.height=`${100-2*this.data.marginY}%`,!this.#b||this.fullScreen)return;let t=this.data.width+(window.outerWidth-window.innerWidth)+this.data.width*(2*this.data.marginX/100),i=this.data.height+(window.outerHeight-window.innerHeight)+this.data.height*(2*this.data.marginY/100);window.resizeTo(t,i),this.#b=!1}static init(){this.#a||(Application.init(this.data.width,this.data.height),this.#b=!0,this.SetTitle(this.data.title),this.SetIcon(this.data.icon),this.#d(),window.onresize=()=>{this.data.resizable||(this.#b=!0)},this.#a=!0)}static SetBase(t,i,e,a,h,s){this.SetTitle(t),this.SetSize(i,e),this.SetMargin(a,h),this.SetIcon(s),this.#b=!0}static SetTitle(t){this.data.title=t??"Untitled",document.title=this.data.title}static SetSize(t,i){if(null==t||null==i)throw BlankEngine.Err(0);this.data.width=t,this.data.height=i,Application.htmlCanvas.width=this.data.width,Application.htmlCanvas.height=this.data.height,this.#b=!0}static SetMargin(t,i){this.data.marginX=t??0,this.data.marginY=i??0,this.#b=!0}static SetIcon(t){if(!t)return;this.data.icon=t;let i=document.querySelector("link[rel=icon]");null==i&&((i=document.createElement("link")).rel="icon",document.head.appendChild(i)),i.href=this.data.icon}}Object.prototype.name=null,Object.prototype.toString=function(){return this.name};class Resources{static #a=[];static #b=[];static #c(t){if(null==t.name||null==t.args)throw BlankEngine.Err(0);let e=t.args,n=null;switch(t.type){case"Texture":if(null==e.src)throw BlankEngine.Err(0);n=new Texture(e.src),null!=e.wrapMode&&(n.wrapMode=e.wrapMode),null!=e.filterMode&&(n.filterMode=e.filterMode);break;case"Material":var l=null,s=null;null!=e.vertexShader&&(l=Shader.Find(e.vertexShader,"VERTEX")),null!=e.fragmentShader&&(s=Shader.Find(e.fragmentShader,"FRAGMENT")),n=new Material(l,s);break;default:throw BlankEngine.Err(0)}return n.name=t.name,n}static #d(h,u){if(null==h||null==u)throw BlankEngine.Err(0);let r=[],o=[this.#b],$={final:[],sub:[]};for(let i=0;i<h.length-1&&0!=o[o.length-1].length&&1!=h.length;i++){if(0===i){for(let a=0;a<o[0].length;a++)"subpath"===o[0][a].type&&o[0][a].name===h[0]&&(r[0]=a,o.push(o[0][a]));continue}for(let g=0;g<o[i].content.length;g++)"subpath"===o[i].content[g].type&&o[i].content[g].name===h[i]&&(r.push(g),o.push(o[i].content[g]))}"subpath"===u.type?o.push({name:u.name,type:"subpath",content:[]}):o.push(u);for(let c=o.length-1;c>0;c--){if(0===$.sub.length?$.sub[0]=o[c]:$.sub.push({name:o[c].name,type:"subpath",content:[]}),c===o.length-1)continue;let f=!1;0===o[c].content.length&&($.sub[$.sub.length-1].content[0]=$.sub[$.sub.length-2]);for(let b=0;b<o[c].content.length;b++)(f||b!==r[c]&&null!=r[c]||(0===$.sub[$.sub.length-1].content.length?$.sub[$.sub.length-1].content[0]=$.sub[$.sub.length-2]:$.sub[$.sub.length-1].content.push($.sub[$.sub.length-2]),f=!0,b!==r[c]))&&(0===$.sub[$.sub.length-1].content.length?$.sub[$.sub.length-1].content[0]=o[c].content[b]:$.sub[$.sub.length-1].content.push(o[c].content[b]))}0===o[0].length&&($.final[0]=$.sub[$.sub.length-1]);let p=!1;for(let _=0;_<o[0].length;_++)(p||_!==r[0]&&0!==r.length||(0===$.final.length?$.final[0]=$.sub[$.sub.length-1]:$.final.push($.sub[$.sub.length-1]),p=!0,_!=r[0]))&&(0===$.final.length?$.final[0]=o[0][_]:$.final.push(o[0][_]));this.#b=$.final}static Set(t){if(null==t||!Array.isArray(t))throw BlankEngine.Err(0);this.UnloadAll(),this.#a=t}static Load(t){if(null==t)throw BlankEngine.Err(0);let e=[""],n=this.#a,l=[];for(let s=0;s<t.length;s++){if("/"===t[s]){e.push("");continue}e[e.length-1]+=t[s]}for(let h=0;h<e.length;h++){let u=this.#b;0===l.length?l[0]=e[h]:l.push(e[h]);for(let r=1;r<=h;r++)for(let o=0;o<u.length;o++)u[o].name===e[h-1]&&"subpath"===u[o].type&&(u=u[o].content);for(let $=0;$<n.length;$++){if(e[h]!==n[$].name)continue;let i=0;for(let a=0;a<u.length;a++)e[h]===u[a].name&&(i=0!==i?3:"subpath"===u[a].type?1:2);if(h===e.length-1){if(2===i||3===i)return;this.#d(l,this.#c(n[$]));return}if(1===i||3===i){n=n[$].content;break}this.#d(l,n[$]),n=n[$].content;break}}throw BlankEngine.Err(3)}static Unload(t){if(null==t)throw BlankEngine.Err(0);let e=[""],n=[],l=[this.#b],s={final:[],sub:[]};for(let h=0;h<t.length;h++){if("/"===t[h]){e.push("");continue}e[e.length-1]+=t[h]}for(let u=0;u<e.length;u++){if(0===u){if(0===l[0].length)return;for(let r=0;r<l[0].length;r++){if(u===e.length-1){if(r===l[0].length-1&&("subpath"===l[0][r].type||l[0][r].name!==e[0]))return;if("subpath"===l[0][r].type||l[0][r].name!==e[0])continue}else{if(r===l[0].length-1&&("subpath"!==l[0][r].type||l[0][r].name!==e[0]))return;if("subpath"!==l[0][r].type||l[0][r].name!==e[0])continue}n[0]=r,u!==e.length-1&&l.push(l[0][r])}continue}if(0===l[l.length-1].content.length)return;for(let o=0;o<l[u].content.length;o++){if(u===e.length-1){if(o===l[u].content.length-1&&("subpath"===l[u].content[o].type||l[u].content[o].name!==e[u]))return;if("subpath"===l[u].content[o].type||l[u].content[o].name!==e[u])continue}else{if(o===l[u].content.length-1&&("subpath"!==l[u].content[o].type||l[u].content[o].name!==e[u]))return;if("subpath"!==l[u].content[o].type||l[u].content[o].name!==e[u])continue}n.push(o),u!==s.length-1&&l.push(l[u].content[o])}}for(let $=l.length-2;$>0;$--){0===s.sub.length?s.sub[0]={name:l[$].name,type:"subpath",content:[]}:s.sub.push({name:l[$].name,type:"subpath",content:[]});for(let i=0;i<l[$].content.length;i++)if($!==l.length-2||i!==n[$]){if(i==n[$]){if(0===s.sub[s.sub.length-2].content.length)continue;0===s.sub[s.sub.length-1].content.length?s.sub[s.sub.length-1].content[0]=s.sub[s.sub.length-2]:s.sub[s.sub.length-1].content.push(s.sub[s.sub.length-2]);continue}0===s.sub[s.sub.length-1].content.length?s.sub[s.sub.length-1].content[0]=l[$].content[i]:s.sub[s.sub.length-1].content.push(l[$].content[i])}}for(let a=0;a<l[0].length;a++)if(1!==l.length||a!==n[0]){if(a==n[0]){if(0===s.sub[s.sub.length-1].content.length)continue;0===s.final.length?s.final[0]=s.sub[s.sub.length-1]:s.final.push(s.sub[s.sub.length-1]);continue}0===s.final.length?s.final[0]=l[0][a]:s.final.push(l[0][a])}this.#b=s.final}static UnloadAll(){this.#b=[]}static Find(t){if(null==t)throw BlankEngine.Err(0);let e=[""],n=this.#b;for(let l=0;l<t.length;l++){if("/"===t[l]){e.push("");continue}e[e.length-1]+=t[l]}for(let s=0;s<e.length;s++)for(let h=0;h<n.length;h++)if(n[h].name===e[s]){if(s===e.length-1){if("subpath"===n[h].type)throw BlankEngine.Err(3);return n[h]}n=n[h].content;break}throw BlankEngine.Err(3)}}class Debug{static #a=!1;static get isDebugMode(){return this.#a}static Set(t){this.#a=t}}class Time{static unscaledTime=0;static unscaledDeltaTime=0;static timeScale=1;static frameCount=0;static time=0;static deltaTime=0;static maximumDeltaTime=.3333333;static fixedUnscaledTime=0;static fixedUnscaledDeltaTime=0;static fixedTime=0;static fixedDeltaTime=.02}class Input{static #a=!1;static #b=[];static #c=class{name="";code="";active=!1;lastState=!1;constructor(t,e){this.name=t,this.code=e}};static #d(t){for(let e=0;e<this.#b.length;e++)if(this.#b[e].name===t)return e;return null}static #e(s){for(let i=0;i<this.#b.length;i++)if(this.#b[i].code===s)return i;return null}static init(){this.#b=[new this.#c("up","ArrowUp"),new this.#c("down","ArrowDown"),new this.#c("left","ArrowLeft"),new this.#c("right","ArrowRight"),new this.#c("shift","Shift")],document.addEventListener("keydown",t=>{let e=this.#e(t.key);null!=e&&(t.preventDefault(),this.#b[e].active=!0)}),document.addEventListener("keyup",t=>{let e=this.#e(t.key);null!=e&&(t.preventDefault(),this.#b[e].active=!1)})}static Update(){}static End(){for(let t=0;t<this.#b.length;t++)this.#b[t].lastState=this.#b[t].active}static GetKey(t){let e=t;if("string"==typeof t){if(null==(e=this.#d(t)))return!1}else if(t<0||t>=this.#b.length)return;return this.#b[e].active}static GetKeyDown(t){let e=t;if("string"==typeof t){if(null==(e=this.#d(t)))return!1}else if(t<0||t>=this.#b.length)return;return this.#b[e].active&&!this.#b[e].lastState}static GetKeyUp(t){let e=t;if("string"==typeof t){if(null==(e=this.#d(t)))return!1}else if(t<0||t>=this.#b.length)return;return!this.#b[e].active&&this.#b[e].lastState}}class KeyCode{static get ArrowUp(){return 0}static get ArrowDown(){return 1}static get ArrowLeft(){return 2}static get ArrowRight(){return 3}static get Shift(){return 4}}class Component{gameObject=null;get transform(){return this.gameObject.transform}set transform(e){this.gameObject.transform=e}BroadcastMessage(method,params,data){if(null==method)throw BlankEngine.Err(0);if(!gameObject.activeSelf)return;let components=this.gameObject.components,args="",dat=data??{};if(null==params||"string"==typeof params)args=params;else for(let i=0;i<params.length;i++)args+=`params[${i}]`,i!==params.length-1&&(args+=",");for(let i=0;i<components.length;i++){let validType=components[i]instanceof GameBehavior;components[i].enabled&&validType&&(eval(`components[i].${method}(${args})`),dat.clearAfter&&eval(`components[i].${method} = () => { }`),components[i].gameObject=this.gameObject,components[i].name=this.name)}}}class Behavior extends Component{enabled=!0;get isActiveAndEnabled(){return this.gameObject.activeSelf&&this.enabled}constructor(){super()}}class GameBehavior extends Behavior{constructor(){super()}Awake(){}OnEnable(){}Start(){}FixedUpdate(){}Update(){}LateUpdate(){}OnPreRender(){}OnRenderObject(){}OnPostRender(){}OnRenderImage(){}OnApplicationQuit(){}OnDisable(){}OnDestroy(){}}Math.clamp=function(n,r,a){var c=n;return c<r&&(c=r),c>a&&(c=a),c};class Matrix3x3{matrix=[[1,0,0],[0,1,0],[0,0,1]];static get zero(){let $=new Matrix3x3([0,0,0],[0,0,0],[0,0,0]);return $}static get identity(){let $=new Matrix3x3([1,0,0],[0,1,0],[0,0,1]);return $}get determinant(){let $=this.matrix,t=$[0][0]*($[1][1]*$[2][2]-$[2][1]*$[1][2]),_=$[1][0]*($[0][1]*$[2][2]-$[2][1]*$[0][2]),r=$[2][0]*($[0][1]*$[1][2]-$[1][1]*$[0][2]);return t-_+r}get transpose(){let $=this.matrix,t=new Matrix3x3([$[0][0],$[1][0],$[2][0]],[$[0][1],$[1][1],$[2][1]],[$[0][2],$[1][2],$[2][2]]);return t}get inverse(){let $=this.determinant;if(0===$)return Matrix3x3.zero;let t=this.transpose.matrix;return new Matrix3x3([(t[1][1]*t[2][2]-t[2][1]*t[1][2])/$,(t[1][2]*t[2][0]-t[2][2]*t[1][0])/$,(t[1][0]*t[2][1]-t[2][0]*t[1][1])/$],[(t[0][2]*t[2][1]-t[2][2]*t[0][1])/$,(t[0][0]*t[2][2]-t[2][0]*t[0][2])/$,(t[0][1]*t[2][0]-t[2][1]*t[0][0])/$],[(t[0][1]*t[1][2]-t[1][1]*t[0][2])/$,(t[0][2]*t[1][0]-t[1][2]*t[0][0])/$,(t[0][0]*t[1][1]-t[1][0]*t[0][1])/$])}constructor($,t,_){this.matrix=[$??[1,0,0],t??[0,1,0],_??[0,0,1]]}static Translate($){let t=new Matrix3x3([1,0,0],[0,1,0],[$.x,$.y,1]);return t}static Rotate($){let t=new Matrix3x3([Math.cos($),Math.sin($),0],[-Math.sin($),Math.cos($),0],[0,0,1]);return t}static Scale($){let t=new Matrix3x3([$.x,0,0],[0,$.y,0],[0,0,1]);return t}static TRS($,t,_){let r=new Matrix3x3([Math.cos(t)*_.x,Math.sin(t)*_.y,0],[-Math.sin(t)*_.x,Math.cos(t)*_.y,0],[$.x,$.y,1]);return r}static Ortho($,t,_,r){let e=new Matrix3x3([2/(t-$),0,0],[0,2/(r-_),0],[-(t+$)/(t-$),-(r+_)/(r-_),1]);return e}static Multiply($,t){if(null==$||null==t)throw BlankEngine.Err(0);let _=$.matrix,r=t.matrix,e=new Matrix3x3([_[0][0]*r[0][0]+_[1][0]*r[0][1]+_[2][0]*r[0][2],_[0][1]*r[0][0]+_[1][1]*r[0][1]+_[2][1]*r[0][2],_[0][2]*r[0][0]+_[1][2]*r[0][1]+_[2][2]*r[0][2]],[_[0][0]*r[1][0]+_[1][0]*r[1][1]+_[2][0]*r[1][2],_[0][1]*r[1][0]+_[1][1]*r[1][1]+_[2][1]*r[1][2],_[0][2]*r[1][0]+_[1][2]*r[1][1]+_[2][2]*r[1][2]],[_[0][0]*r[2][0]+_[1][0]*r[2][1]+_[2][0]*r[2][2],_[0][1]*r[2][0]+_[1][1]*r[2][1]+_[2][1]*r[2][2],_[0][2]*r[2][0]+_[1][2]*r[2][1]+_[2][2]*r[2][2]]);return e}GetValue($,t){if(null==$||null==t)throw BlankEngine.Err(0);return this.matrix[$][t]}SetValue($,t,_){if(null==$||null==t||null==_)throw BlankEngine.Err(0);this.matrix[$][t]=_}GetColumn($){if(null==$)throw BlankEngine.Err(0);let t=[0,0,0];for(let _=0;_<=2;_++)t[_]=this.GetValue($,_);return t}SetColumn($,t){if(null==$||null==t||null==t[0]||null==t[1]||null==t[2])throw BlankEngine.Err(0);for(let _=0;_<=2;_++)this.SetValue($,_,t[_])}GetRow($){if(null==$)throw BlankEngine.Err(0);let t=[0,0,0];for(let _=0;_<=2;_++)t[_]=this.GetValue(_,$);return t}SetRow($,t){if(null==$||null==t||null==t[0]||null==t[1]||null==t[2])throw BlankEngine.Err(0);for(let _=0;_<=2;_++)this.SetValue(_,$,t[_])}}class Vector2{static get zero(){return new Vector2(0,0)}static get one(){return new Vector2(1,1)}static get up(){return new Vector2(0,1)}static get down(){return new Vector2(0,-1)}static get left(){return new Vector2(-1,0)}static get right(){return new Vector2(1,0)}x=0;y=0;get magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y)}get sqrMagnitude(){return this.x*this.x+this.y*this.y}get normalized(){return new Vector2((this.x/this.magnitude)||0,(this.y/this.magnitude)||0)}constructor(t,r){this.x=t??0,this.y=r??0}static Distance(t,r){let e=t.x-r.x,i=t.y-r.y;return Math.sqrt(e*e+i*i)}static Dot(t,r){if(null==t||null==r)throw BlankEngine.Err(0);return t.x*r.x+t.y*r.y}static Min(t,r){if(null==t||null==r)throw BlankEngine.Err(0);return new Vector2(Math.min(t.x,r.x),Math.min(t.y,r.y))}static Max(t,r){if(null==t||null==r)throw BlankEngine.Err(0);return new Vector2(Math.max(t.x,r.x),Math.max(t.y,r.y))}static Scale(t,r){if(null==t||null==r)throw BlankEngine.Err(0);return new Vector2(t.x*r.x,t.y*r.y)}Set(t,r){if(null==t||null==r)throw BlankEngine.Err(0);this.x=t,this.y=r}toString(){return`(${this.x}, ${this.y})`}Equals(t){return this.x==t.x&&this.y==t.y}Normalize(){let t=this.magnitude;this.x=(this.x/t)||0,this.y=(this.y/t)||0}}class Color{r=0;g=0;b=0;a=1;get grayscale(){let t=.3*this.r+.59*this.g+.11*this.b;return new Color(t,t,t,this.a)}constructor(t,s,i,r){this.r=t??0,this.g=s??0,this.b=i??0,this.a=r??1}Set(t,s,i,r){if(null==t||null==s||null==i)throw BlankEngine.Err(0);this.r=t,this.g=s,this.b=i,null!=r&&(this.a=r)}toString(){return`${this.r}, ${this.g}, ${this.b}, ${this.a}`}}class Rect{x=0;y=0;width=1;height=1;xMin=0;yMin=0;center=new Vector2;get xMax(){return this.width}set xMax(t){this.width=t}get yMax(){return this.height}set yMax(t){this.height=t}get position(){return new Vector2(this.x,this.y)}set position(t){if(null==t)throw BlankEngine.ThrowError(0);this.x=t.x,this.y=t.y}get size(){return new Vector2(this.width,this.height)}set size(t){if(null==t)throw BlankEngine.ThrowError(0);this.width=t.x,this.height=t.y}constructor(t,h,i,s){this.x=t??0,this.y=h??0,this.width=i??1,this.height=s??1}Set(t,h,i,s){if(null==t||null==h||null==i||null==s)throw BlankEngine.ThrowError(0);this.x=t,this.y=h,this.width=i,this.height=s}toString(){return`${this.x}, ${this.y}, ${this.width}, ${this.height}`}}class Transform extends Component{position=new Vector2;rotation=0;scale=new Vector2;get localToWorldMatrix(){let t=Matrix3x3.TRS(this.position,this.rotation*Math.PI/180,this.scale);return t}get worldToLocalMatrix(){return localToWorldMatrix.inverse}constructor(t,o,s){super(),this.position=t??Vector2.zero,this.rotation=o??0,this.scale=s??Vector2.one}}class GameObject{#a="Empty Object";#b=!1;#c=[new Transform];get name(){return this.#a}set name(t){this.#a=t;let e=this.#c;for(let n=0;n<this.#c.length;n++)e[n].name=this.name}get activeSelf(){return this.#b}get components(){return this.#c}set components(t){let e=[this.#c[0]];for(let n=0;n<t.length;n++){let s=t[n]instanceof Component;if(!s)throw BlankEngine.Err(4);e.push(t[n])}this.#c=e;for(let o=0;o<this.#c.length;o++)this.#c[o].gameObject=this,this.#c[o].name=this.name}get transform(){return this.#c[0]}set transform(t){this.#c[0]=t,this.#c[0].gameObject=this,this.#c[0].name=this.name}constructor(t,e,n,s){if(null!=e&&!Array.isArray(e))throw BlankEngine.Err(0);this.name=t??"Empty Object",this.#b=n??!0,this.components=e??[],this.transform=s??new Transform}SetActive(t){this.#b=t}BroadcastMessage(method,params,data){if(null==method)throw BlankEngine.Err(0);if(!this.#b)return;let components=this.#c,args="",dat=data??{};if(null==params||"string"==typeof params)args=params;else for(let i=0;i<params.length;i++)args+=`params[${i}]`,i!==params.length-1&&(args+=",");for(let i=0;i<components.length;i++){let validType=components[i]instanceof GameBehavior;components[i].enabled&&validType&&(eval(`components[i].${method}(${args})`),dat.clearAfter&&eval(`components[i].${method} = () => { }`),components[i].gameObject=this,components[i].name=this.name)}}GetComponents(type){if(null==type)throw BlankEngine.Err(0);let components=this.#c,newComps=[];for(let i=0;i<components.length;i++){let validType=eval(`components[i] instanceof ${type}`);if(!validType)continue;let isBehavior=components[i]instanceof Behavior;(!isBehavior||components[i].enabled)&&(0===newComps.length?newComps[0]=components[i]:newComps(components[i]))}return newComps}}class SceneManager{static #a=[];static #b=null;static #c=!1;static #d=!1;static get sceneLoaded(){return this.#c}static get sceneUnloaded(){return this.#d}static GetActiveScene(){return this.#b??{isLoaded:!1}}static Set(e){if(null!=e&&!Array.isArray(e))throw BlankEngine.Err(0);this.#a=e}static Load(e){this.#b=new this.Scene(this.#a[e].name,{resources:this.#a[e].resources,gameObjects:this.#a[e].gameObjects,buildIndex:this.#a[e].buildIndex,path:this.#a[e].path})??new this.Scene,this.#c=!0}}SceneManager.Scene=class{#a=null;#b=!1;name="scene";gameObjects=[];get buildIndex(){return this.#a.buildIndex}get path(){return this.#a.path}get isLoaded(){return this.#b}constructor(t,e){this.name=t??"scene",this.#a=e??{},this.#c()}#d(type,data,constructData){if(null==type)throw BlankEngine.Err(0);let dat=data??{},constructDat=constructData??{},object=null;switch(type){case"GameObject":object=new GameObject(dat.name,dat.components,dat.active,this.#d("Transform",dat.transform));break;case"Vector2":object=new Vector2(dat.x,dat.y);break;case"Transform":var pos=dat.position??{},sca=dat.scale??{};object=new Transform(new Vector2(pos.x,pos.y),dat.rotation,new Vector2(sca.x??1,sca.y??1));break;case"Sprite":if(null==dat.texture)throw BlankEngine.Err(0);object=new Sprite(Resources.Find(dat.texture),dat.rect);break;case"Material":object="string"==typeof dat?Resources.Find(dat):new Material(Shader.Find(dat.vertexShader??"Default/Standard","VERTEX"),Shader.Find(dat.fragmentShader??"Default/Standard","FRAGMENT"));break;case"Camera":object=new Camera,null!=dat.orthographicSize&&(object.orthographicSize=dat.orthographicSize);break;case"SpriteRenderer":if(null==dat.sprite)throw BlankEngine.Err(0);object=new SpriteRenderer(this.#d("Sprite",dat.sprite),this.#d("Material",dat.material))}if(null==object){let libs=BlankEngine.Inner.compiledData.libs,scripts=BlankEngine.Inner.compiledData.scripts,foundClass=!1,construct=[],properties=[],cData="";for(let iA=0;iA<libs.length;iA++)for(let iB=0;iB<libs[iA].scripts.length;iB++)if(null!=libs[iA].scripts[iB].classes){for(let iC=0;iC<libs[iA].scripts[iB].classes.length;iC++)if(libs[iA].scripts[iB].classes[iC].name===type){construct=libs[iA].scripts[iB].classes[iC].construct,properties=libs[iA].scripts[iB].classes[iC].args,foundClass=!0;break}}for(let iA=0;iA<scripts.length;iA++)if(null!=scripts[iA].classes){for(let iB=0;iA<scripts[iA].classes.length;iB++)if(scripts[iA].classes[iB].name===type){construct=scripts[iA].classes[iB].construct,properties=scripts[iA].classes[iB].args,foundClass=!0;break}}if(!foundClass)throw BlankEngine.Err(3);for(let i=0;i<construct.length;i++){let subObj=null;"string"==typeof(subObj=null==eval(`constructDat.${construct[i]}`)?eval(`constructDat.${construct[i]}`):Array.isArray(eval(`consturctDat.${properties[i]}`))?this.#e(eval(`consturctDat.${properties[i]}`)):"object"==typeof eval(`constructDat.${construct[i]}`)&&eval(`constructDat.${construct[i]}.__compiled`)?eval(`this.#toObject(constructDat.${construct[i]}.type, constructDat.${construct[i]}.args, constructDat.${construct[i]}.construct)`):eval(`constructDat.${construct[i]}`))?cData+=`"${subObj}"`:cData+=`${subObj}`,i!==construct.length-1&&(cData+=",")}object=eval(`new ${type}(${cData})`);for(let i=0;i<properties.length;i++){if(void 0===eval(`dat.${properties[i]}`))continue;let subObj=null;subObj=null==eval(`dat.${properties[i]}`)?eval(`dat.${properties[i]}`):Array.isArray(eval(`dat.${properties[i]}`))?this.#e(eval(`dat.${properties[i]}`)):"object"==typeof eval(`dat.${properties[i]}`)&&eval(`dat.${properties[i]}.__compiled`)?eval(`this.#toObject(dat.${properties[i]}.type, dat.${properties[i]}.args, dat.${properties[i]}.construct)`):eval(`dat.${properties[i]}`),eval(`object.${properties[i]} = subObj`)}}return null!=dat.name&&(!0==("Material"===type)||(object.name=dat.name)),object}#e(t){let e=[];for(let a=0;a<t.length;a++){let s=null;s=Array.isArray(t[a])?this.#e(t[a]):"object"==typeof t[a]&&t[a].__compiled?this.#d(t[a].type,t[a].args,t[a].construct):t[a],0===e.length?e[0]=s:e.push(s)}return e}#c(){this.#f(),this.#g(),this.#b=!0}#f(){null==this.#a.resources&&(this.#a.resources=[]);for(let t=0;t<this.#a.resources.length;t++)Resources.Load(this.#a.resources[t])}#g(){null==this.#a.gameObjects&&(this.#a.gameObjects=[]);let t=[];for(let e=0;e<this.#a.gameObjects.length;e++){let a=[];for(let s=0;s<this.#a.gameObjects[e].components.length;s++){let r=this.#d(this.#a.gameObjects[e].components[s].type,this.#a.gameObjects[e].components[s].args,this.#a.gameObjects[e].components[s].construct);0==a.length?a[0]=r:a.push(r)}let c=this.#d("GameObject",{name:this.#a.gameObjects[e].name,components:a,active:this.#a.gameObjects[e].active,transform:this.#a.gameObjects[e].transform});0==t.length?t[0]=c:t.push(c)}this.gameObjects=t}};class PlayerLoop{static #a=!1;static #b=[];static #c(){requestAnimationFrame(this.#d.bind(this))}static async #d(){if(this.#a||Application.isLoaded||(Application.Load(),this.#a=!0),!Application.isLoaded||!SceneManager.GetActiveScene().isLoaded)return this.#c();let e=this.#b;for(let t=0;t<e.length;t++)e[t].updateFunction();this.#c()}static init(){if(this.#a)return;let e=!1;this.#b=[new PlayerLoopSystem("Initialization",{subSystemList:[new PlayerLoopSystem("ScriptRunBehaviorStart",{loopConditionFunction:()=>document.hasFocus(),updateDelegate(){for(let e=0;e<SceneManager.GetActiveScene().gameObjects.length;e++)SceneManager.GetActiveScene().gameObjects[e].BroadcastMessage("Start",null,{clearAfter:!0})}})]}),new PlayerLoopSystem("TimeUpdate",{updateFunction:function(){let e=1/Application.targetFrameRate-.005,t=performance.now()/1e3-Time.unscaledTime;for(;t>=e;){Time.unscaledDeltaTime=performance.now()/1e3-Time.unscaledTime,Time.unscaledTime+=Time.unscaledDeltaTime;let a=Time.unscaledDeltaTime;a>Time.maximumDeltaTime&&(a=Time.maximumDeltaTime),Time.deltaTime=a*Time.timeScale,Time.time+=Time.deltaTime,Time.frameCount+=Time.timeScale,this.updateDelegate();let i=this.subSystemList;for(let n=0;n<i.length;n++)i[n].updateFunction();t-=e}},updateDelegate(){e=!0}}),new PlayerLoopSystem("EarlyUpdate",{loopConditionFunction:()=>e,subSystemList:[new PlayerLoopSystem("UpdateMainGameViewRect",{loopConditionFunction:()=>document.hasFocus()&&0!==Time.timeScale,updateDelegate(){Application.gl.viewport(0,0,Application.htmlCanvas.width,Application.htmlCanvas.height),Application.gl.clear(Application.gl.COLOR_BUFFER_BIT|Application.gl.DEPTH_BUFFER_BIT),Application.gl.enable(Application.gl.BLEND),Application.gl.blendFunc(Application.gl.SRC_ALPHA,Application.gl.ONE_MINUS_SRC_ALPHA)}}),new PlayerLoopSystem("UpdateInputManager",{loopConditionFunction:()=>document.hasFocus()&&0!==Time.timeScale,updateDelegate(){Input.Update()}})]}),new PlayerLoopSystem("FixedUpdate",{updateFunction:function(){for(Time.fixedDeltaTime;Time.fixedTime<Time.time;){Time.fixedUnscaledDeltaTime=performance.now()/1e3-Time.fixedUnscaledTime,Time.fixedUnscaledTime+=Time.fixedUnscaledDeltaTime,Time.fixedTime+=Time.fixedDeltaTime*Time.timeScale;let e=this.subSystemList;for(let t=0;t<e.length;t++)e[t].updateFunction()}},subSystemList:[new PlayerLoopSystem("ScriptRunBehaviorFixedUpdate",{loopConditionFunction:()=>document.hasFocus()&&0!==Time.timeScale,updateDelegate(){for(let e=0;e<SceneManager.GetActiveScene().gameObjects.length;e++)SceneManager.GetActiveScene().gameObjects[e].BroadcastMessage("FixedUpdate")}})]}),new PlayerLoopSystem("Update",{loopConditionFunction:()=>e,subSystemList:[new PlayerLoopSystem("ScriptRunBehaviorUpdate",{loopConditionFunction:()=>document.hasFocus()&&0!==Time.timeScale,updateDelegate(){for(let e=0;e<SceneManager.GetActiveScene().gameObjects.length;e++)SceneManager.GetActiveScene().gameObjects[e].BroadcastMessage("Update")}})]}),new PlayerLoopSystem("PreLateUpdate",{loopConditionFunction:()=>e,subSystemList:[new PlayerLoopSystem("ScriptRunBehaviorLateUpdate",{loopConditionFunction:()=>document.hasFocus()&&0!==Time.timeScale,updateDelegate(){for(let e=0;e<SceneManager.GetActiveScene().gameObjects.length;e++)SceneManager.GetActiveScene().gameObjects[e].BroadcastMessage("LateUpdate")}})]}),new PlayerLoopSystem("PostLateUpdate",{loopConditionFunction:()=>!!e&&(e=!1,!0),subSystemList:[new PlayerLoopSystem("UpdateAllRenderers",{loopConditionFunction:()=>document.hasFocus()&&0!==Time.timeScale,updateDelegate(){for(let e=0;e<SceneManager.GetActiveScene().gameObjects.length;e++){let t=SceneManager.GetActiveScene().gameObjects[e].GetComponents("Camera");for(let a=0;a<t.length;a++)t[a].Render()}Application.gl.flush()}}),new PlayerLoopSystem("UpdateAllRenderers",{loopConditionFunction:()=>document.hasFocus()&&0!==Time.timeScale,updateDelegate(){Application.gl.flush()}}),new PlayerLoopSystem("InputEndFrame",{updateDelegate(){Input.End()}})]})],this.#c()}}class PlayerLoopSystem{name="";loopConditionFunction=()=>!0;subSystemList=[];updateDelegate=()=>{};updateFunction=()=>{if(!this.loopConditionFunction())return;this.updateDelegate();let t=this.subSystemList;for(let e=0;e<t.length;e++)t[e].updateFunction()};constructor(t,e){this.name=t;let n=e??{};null!=n.loopConditionFunction&&(this.loopConditionFunction=n.loopConditionFunction),null!=n.subSystemList&&(this.subSystemList=n.subSystemList),null!=n.updateDelegate&&(this.updateDelegate=n.updateDelegate),null!=n.updateFunction&&(this.updateFunction=n.updateFunction)}}class Shader{static #a=[];static #b=!1;static get isLoaded(){return this.#b}#c=null;#d=null;get type(){return this.#c}get shader(){return this.#d}constructor(e,t,r){if(!e)throw BlankEngine.Err(2,"Shader Data: Shader name is undefined");if(!t)throw BlankEngine.Err(2,"Shader Data: Shader is undefined");if(!r)throw BlankEngine.Err(2,"Shader Data: Shader type is undefined");this.name=e,this.#c=r;let s=Application.gl,h;switch(this.#c){case"VERTEX":h=s.VERTEX_SHADER;break;case"FRAGMENT":h=s.FRAGMENT_SHADER}if(null==h)throw BlankEngine.Err(2,`Shader Data: Type "${this.#c}" doesn't exist`);if(this.#d=s.createShader(h),s.shaderSource(this.#d,t),s.compileShader(this.#d),!s.getShaderParameter(this.#d,s.COMPILE_STATUS))throw BlankEngine.Err(2,s.getShaderInfoLog(this.#d))}static Set(e){if(null==e||!Array.isArray(e))throw BlankEngine.Err(0);for(let t=0;t<e.length;t++){if(""===e[t])continue;let r=0,s="",h=["",""],i=0,a=!1,d="";for(let n=0;n<e[t].length;n++){if("/"===e[t][n]&&"/"===e[t][n+1]){r++,i=0,n++;continue}if(r>=4)break;if("\n"!==e[t][n]){if("'"===e[t][n]||'"'===e[t][n]){if(a&&e[t][n]===d){a=!1,d="";continue}a=!0,d=e[t][n];continue}if(a||" "!==e[t][n]){if(":"===e[t][n]){switch(i=-1,s){case"NAME":i=1;break;case"TYPE":i=2}if(-1===i)throw BlankEngine.Err(3,`Shader Data: Keyword "${s}" doesn't exist`);s="";continue}if(0!==i){h[i-1]+=e[t][n];continue}s+=e[t][n]}}}let o=new Shader(h[0],e[t],h[1]);0===this.#a.length?this.#a[0]=o:this.#a.push(o)}this.#b=!0}static Find(e,t){if(null==e)throw BlankEngine.Err(0);for(let r=0;r<this.#a.length;r++)if((null==t||this.#a[r].type===t)&&this.#a[r].name===e)return this.#a[r];throw BlankEngine.Err(3)}}class Material{#a=null;#b=null;get gl(){return this.#a}get program(){return this.#b}constructor(r,t){this.#a=Application.gl;let a=r??Shader.Find("Default/Standard","VERTEX"),g=t??Shader.Find("Default/Standard","FRAGMENT");if(this.#b=this.#a.createProgram(),this.#a.attachShader(this.#b,a.shader),this.#a.attachShader(this.#b,g.shader),this.#a.linkProgram(this.#b),!this.#a.getProgramParameter(this.#b,this.#a.LINK_STATUS))throw BlankEngine.Err(2,this.#a.getProgramInfoLog(this.#b));this.#a.detachShader(this.#b,a.shader),this.#a.detachShader(this.#b,g.shader)}getAttribLocation(r){if(null==r)throw BlankEngine.Err(0);return this.#a.getAttribLocation(this.#b,r)}getUniformLocation(r){if(null==r)throw BlankEngine.Err(0);return this.#a.getUniformLocation(this.#b,r)}}class Texture{#a=!1;#b=null;wrapMode=0;filterMode=0;get isLoaded(){return this.#a}get img(){return this.#b}constructor(i){if(null==i)throw BlankEngine.Err(0);this.#b=new Image,this.#b.src=`../img/${i}`,this.#b.sprite=this,this.#b.onload=()=>{this.#a=!0}}}class Sprite{texture=null;rect=new Rect;constructor(t,r){if(null==t)throw BlankEngine.Err(0);this.texture=t,this.rect=r??new Rect}}class Camera extends Behavior{#a=!0;#b=new Matrix3x3;orthographic=!0;orthographicSize=1;get projectionMatrix(){return this.#b}set projectionMatrix(t){this.#a=!1,this.projMatrix=t}get worldToCameraMatrix(){let t=this.gameObject.transform,e=Matrix3x3.TRS(t.position,-t.rotation*Math.PI/180,t.scale);return e}get cameraToWorldMatrix(){return this.worldToCameraMatrix.inverse}constructor(){super()}Render(){let t=this.worldToCameraMatrix;this.#a&&this.orthographic&&(this.#b=Matrix3x3.Ortho(0,this.orthographicSize,0,this.orthographicSize));let e=new Vector2(1/(Application.htmlCanvas.width/Application.htmlCanvas.height),-1),r=Matrix3x3.TRS(e,0,e);for(let i=0;i<SceneManager.GetActiveScene().gameObjects.length;i++){if(!SceneManager.GetActiveScene().gameObjects[i].activeSelf)continue;let a=SceneManager.GetActiveScene().gameObjects[i].GetComponents("SpriteRenderer");for(let o=0;o<a.length;o++){let h=a[o].gameObject.transform.localToWorldMatrix;h.matrix[2][1]*=-1,h.matrix[2][0]*=-1;let l=Matrix3x3.Multiply(Matrix3x3.Multiply(Matrix3x3.Multiply(r,this.#b),t),h);l.matrix[2][0]*=-1,a[o].localSpaceMatrix=l,a[o].render()}}}}class SpriteRenderer extends Component{#a=!1;#b=null;#c=null;#d=new Material;#e=new Material;#f=null;#g=null;#h=null;#i=null;#j=null;#k=null;#l=null;#m=null;localSpaceMatrix=new Matrix3x3;get isLoaded(){return this.#a}get sprite(){return this.#c}set sprite(t){this.#b=t,this.checkImg()}get material(){return this.#e}set material(t){this.#d=t,this.checkImg()}constructor(t,e){if(null==t)throw BlankEngine.Err(0);super(),this.#b=t,this.#d=e??new Material,this.checkImg()}checkImg(){requestAnimationFrame(()=>{if(this.#b.texture.isLoaded)return this.load();this.checkImg()})}load(){let t=this.#b.texture;if(isNaN(t.filterMode)||t.filterMode<0||t.filterMode>1||isNaN(t.wrapMode)||t.wrapMode<0||t.wrapMode>2)throw BlankEngine.Err(0);let e=this.#d.gl,i=this.#b.rect,r=i.x,a=i.y,s=i.width,l=i.height,o=i.xMin,h=i.yMin,u=[r+o,a+h,r+s,a+h,r+s,a+l,r+o,a+h,r+o,a+l,r+s,a+l],n,x;switch(n=1===t.filterMode?e.NEAREST:e.LINEAR,t.wrapMode){case 1:x=e.REPEAT;break;case 2:x=e.MIRRORED_REPEAT;break;default:x=e.CLAMP_TO_EDGE}e.useProgram(this.#d.program),this.#f=e.createTexture(),this.#g=e.createBuffer(),this.#h=e.createBuffer(),this.#i=this.#d.getUniformLocation("uSampler"),this.#j=this.#d.getUniformLocation("uLocalMatrix"),this.#k=this.#d.getUniformLocation("uVertexPositionOffset"),this.#l=this.#d.getAttribLocation("aVertexPosition"),this.#m=this.#d.getAttribLocation("aTexturePosition"),e.bindTexture(e.TEXTURE_2D,this.#f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,x),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,x),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t.img),e.bindTexture(e.TEXTURE_2D,null),e.bindBuffer(e.ARRAY_BUFFER,this.#h),e.bufferData(e.ARRAY_BUFFER,new Float32Array(u),e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,this.#g),e.bufferData(e.ARRAY_BUFFER,new Float32Array(u),e.STATIC_DRAW),e.useProgram(null),this.#c=this.#b,this.#e=this.#d,this.#a=!0}render(){if(!this.#a||!this.gameObject.activeSelf)return;let t=this.#e.gl,e=[this.localSpaceMatrix.matrix[0][0],this.localSpaceMatrix.matrix[0][1],this.localSpaceMatrix.matrix[0][2],this.localSpaceMatrix.matrix[1][0],this.localSpaceMatrix.matrix[1][1],this.localSpaceMatrix.matrix[1][2],this.localSpaceMatrix.matrix[2][0],this.localSpaceMatrix.matrix[2][1],this.localSpaceMatrix.matrix[2][2]];t.useProgram(this.#e.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.#f),t.uniform1i(this.#i,0),t.bindBuffer(t.ARRAY_BUFFER,this.#h),t.enableVertexAttribArray(this.#l),t.vertexAttribPointer(this.#l,2,t.FLOAT,!1,0,0),t.uniformMatrix3fv(this.#j,!1,new Float32Array(e));let i=this.#c.rect.center;t.uniform2fv(this.#k,new Float32Array([-.5*(i.x+1),-.5*(i.y+1)])),t.bindBuffer(t.ARRAY_BUFFER,this.#g),t.enableVertexAttribArray(this.#m),t.vertexAttribPointer(this.#m,2,t.FLOAT,!1,0,0),t.drawArrays(t.TRIANGLE_STRIP,0,6),t.useProgram(null)}}