window.onload = () => {
    Data.Set();
    
    screenTrans.Start();
    
    Header.SetData();
    Menu.SetData();
};


// ----------Screen Transition
function screenTrans ()
{
    ThrowError(1);
}

screenTrans.Start = function ()
{
    this.body = document.body;
    this.fadeEl = document.querySelector(".fadeObject");
    this.fadeTime = 1;
    
    this.fadeEl.style.opacity = "0.0";
    this.fadeEl.style.transition = `opacity ${0.25 * this.fadeTime}s`;
    
    setTimeout(() => {
        this.fadeEl.style.pointerEvents = "none";
        this.fadeEl.style.transition = "none";
        
        this.body.style.overflowY = "visible";
    }, (250 * this.fadeTime));
    
    setInterval(() => { this.ScanAnchors(); }, 16.67);
};

screenTrans.ScanAnchors = function ()
{
    let pageAnc = document.querySelectorAll("a:not([target='_blank'])");
    
    for (let i = 0; i < pageAnc.length; i++)
    {
        let anchor = pageAnc[i];
        
        anchor.onclick = e => {
            e.preventDefault();
            let target = anchor.href;
            
            this.body.style.overflowY = "hidden";
            
            this.fadeEl.style.pointerEvents = "all";
            this.fadeEl.style.opacity = "1.0";
            this.fadeEl.style.transition = `opacity ${0.25 * this.fadeTime}s`;
            
            setTimeout(() => {
                window.location.href = target;
            }, (250 * this.fadeTime));
        };
    }
};


// ----------Header
function Header ()
{
    ThrowError(1);
}

// -----Set Header
Header.SetData = function ()
{
    this.header = document.querySelector("header");
    this.hLine = document.querySelector("#headerLine");
    this.main = document.querySelector("main");
    this.hLineTop = this.hLine.style.top;
    this.mainTop = "calc(163 * var(--pixel-unit)";
    
    this.main.style.top = this.mainTop;
    this.main.style.minHeight = `calc(100vh - ${this.mainTop})`;
    
    this.enabled = true;
    
    setInterval(() => {
        if (this.scrollPos < window.pageYOffset)
        {
            if (!Menu.enabled) this.Toggle(false);
        }
        else if (this.scrollPos > window.pageYOffset)
        {
            this.Toggle(true);
        }
        
        this.scrollPos = window.pageYOffset;
    }, 16.67);
};

// -----Toggling
Header.Toggle = function (state)
{
    if (this.enabled == state) return;
    
    if (!state)
    {
        this.header.style.transform = "translateY(-100%)";
        this.header.style.transition = "transform 0.25s";
        this.hLine.style.top = "0";
        this.hLine.style.transition = "top 0.25s";
        this.main.style.top = "34px";
        this.main.style.minHeight = "calc(100vh - 62px)";
        this.main.style.transition = "top 0.25s";
    }
    else
    {
        this.header.style.transform = "none";
        this.header.style.transition = "transform 0.25s";
        this.hLine.style.top = this.hLineTop;
        this.hLine.style.transition = "top 0.25s";
        this.main.style.top = this.mainTop;
        this.main.style.minHeight = `calc(100vh - ${this.mainTop})`;
        this.main.style.transition = "top 0.25s";
    }
    
    this.enabled = state;
}


// ----------Menu
function Menu ()
{
    ThrowError(1);
}

// -----Set Menu
Menu.SetData = function ()
{
    let request = new XMLHttpRequest();
    
    request.onload = () => {
        if (request.status < 400)
        {
            this.menuData = JSON.parse(request.responseText);
            
            this.getNavData();
        }
    };
    
    request.onerror = () => {
        ThrowError(3);
    };
    
    request.open("GET", "/data/menuList.json");
    request.overrideMimeType("application/json");
    request.send();
};

Menu.getNavData = function ()
{
    this.navData = "";
    
    for (let i = 0; i < this.menuData.length; i++)
    {
        var output = "";
        var link = "/coming-soon";
        var subOutput = "";
        
        switch (this.menuData[i].type)
        {
            case "link":
                if (this.menuData[i].content != null)
                {
                    link = this.menuData[i].content;
                }
                
                output = `<a href="${link}"><div class="menuList">${this.menuData[i].name}</div></a>`;
                break;
            case "list":
                if (this.menuData[i].content != null)
                {
                    for (let l = 0; l < this.menuData[i].content.length; l++)
                    {
                        if (this.menuData[i].content[l].link != null)
                        {
                            link = this.menuData[i].content[l].link;
                        }
                        
                        subOutput += `<a href="${link}"><div class="menuSubList">${this.menuData[i].content[l].name}</div></a>`;
                        
                        if (l == this.menuData[i].content.length - 1)
                        {
                            output = `<div id="list_${this.menuData[i].name}" class="menuList">${this.menuData[i].name}<div><img class="unselectable" src="/img/spr_menuDropdown.png" alt="${this.menuData[i].name}"></div></div><div id="${this.menuData[i].name}" class="menuDropdown">${subOutput}</div>`;
                        }
                    }
                }
                break;
        }
        
        this.navData += output;
        
        if (i == this.menuData.length - 1)
        {
            this.body = document.body;
            this.main = document.querySelector("main");
            this.btnMenu = document.querySelector("#btnMenu");
            this.btnMenuImg = document.querySelector("img");
            
            this.btnMenu.onclick = () => { this.Toggle(); };
        }
    }
};

// -----Toggling
Menu.Toggle = function ()
{
    if (this.enabled == null) this.enabled = false;
    
    if (this.btnMenu.onclick != null) this.btnMenu.onclick = null;
    
    if (!Header.enabled) Header.Toggle(true);
    
    if (!this.enabled)
    {
        this.body.style.overflowY = "hidden";
        
        this.btnMenuImg.style.transform = "translate(calc(-480 * var(--pixel-unit)), 0)";
        this.btnMenuImg.style.transition = "transform steps(8) 0.5s";
        
        this.main.innerHTML += `<div id="menu"><div id="menuNav">${this.navData}</div><div id="menuSocials"><a href="${data.socials.youtube}" target="_blank" rel="noreferrer noopener"><img id="menuBtnYt" class="unselectable" src="${data.sprites.socials}"></a><a href="${data.socials.twitter}" target="_blank" rel="noreferrer noopener"><img id="menuBtnTwt" class="unselectable" src="${data.sprites.socials}"></a><a href="${data.socials.instagram}" target="_blank" rel="noreferrer noopener"><img id="menuBtnInsta" class="unselectable" src="${data.sprites.socials}"></a></div><div id="menuSiteInfo"><a href="/site-info">&#9432; About this site</a></div></div><hr id="menuOverlay">`;
        
        this.menu = this.main.querySelector("#menu");
        this.overlay = this.main.querySelector("#menuOverlay");
        
        for (let c = 0; c < this.menuData.length; c++)
        {
            if (this.menuData[c].type === "list")
            {
                if (this.menuData[c].content != null)
                {
                    let onloadFunc = Function(`Menu.managed_${this.menuData[c].name} = new menuManaged("${this.menuData[c].name}");`);
                    onloadFunc();
                }
            }
        }
        
        this.menu.style.transform = "none";
        this.menu.style.transition = "transform 0.5s";
        this.overlay.style.background = "rgba(0, 0, 0, 0.37)";
        this.overlay.style.transition = "background 0.5s";
        
        
        setTimeout(() => {
            this.btnMenuImg.style.transition = "none";
            this.menu.style.transition = "none";
            this.overlay.style.transition = "none";
            
            this.enabled = !this.enabled;
            this.btnMenu.onclick = () => { this.Toggle(); };
            this.overlay.onclick = () => { this.Toggle(); };
        }, 500);
    }
    else
    {
        this.btnMenuImg.style.transform = "none";
        this.btnMenuImg.style.transition = "transform steps(8) 0.25s";
        
        for (let i = 0; i < this.menuData.length; i++)
        {
            if (this.menuData[i].type === "list")
            {
                if (this.menuData[i].content != null)
                {
                    let onloadFunc = Function(`if (Menu.managed_${this.menuData[i].name}.enabled) { Menu.managed_${this.menuData[i].name}.Toggle(); }`);
                    onloadFunc();
                }
            }
        }
        
        this.menu.style.transform = "translateX(-100%)";
        this.menu.style.transition = "transform 0.25s";
        this.overlay.style.background = "none";
        this.overlay.style.transition = "background 0.25s";
        
        setTimeout(() => {
            this.btnMenuImg.style.transition = "none";
            
            this.menu.remove();
            this.overlay.remove();
            
            this.body.style.overflowY = "visible";
            
            this.enabled = !this.enabled;
            this.btnMenu.onclick = () => { this.Toggle(); };
        }, 250);
    }
};

// -----Managed Class for Sublists
class menuManaged
{
    constructor (name)
    {
        this.thisObj = document.querySelector(`#list_${name}`);
        this.arrowImg = this.thisObj.querySelector("img");
        this.dropdown = document.querySelector(`#${name}`)
        
        this.ddHeight = this.dropdown.scrollHeight;
        
        this.thisObj.onclick = () => { this.Toggle(); };
    }
    
    Toggle ()
    {
        if (this.enabled == null) this.enabled = false;
        
        if (this.thisObj.onclick != null) this.thisObj.onclick = null;
        
        if (!this.enabled)
        {
            this.arrowImg.style.transform = "translate(calc(-480 * var(--pixel-unit)), 0)";
            this.arrowImg.style.transition = "transform steps(8) 0.25s";
            this.dropdown.style.maxHeight = `${this.ddHeight}px`;
            this.dropdown.style.transition = "max-height 0.25s";
            
            setTimeout(() => {
                this.arrowImg.style.transition = "none";
                this.dropdown.style.transition = "none";
                
                this.enabled = !this.enabled;
                this.thisObj.onclick = () => { this.Toggle(); };
            }, 250);
        }
        else
        {
            this.arrowImg.style.transform = "none";
            this.arrowImg.style.transition = "transform steps(8) 0.25s";
            this.dropdown.style.maxHeight = "0";
            this.dropdown.style.transition = "max-height 0.25s";
            
            setTimeout(() => {
                this.arrowImg.style.transition = "none";
                this.dropdown.style.transition = "none";
                
                this.enabled = !this.enabled;
                this.thisObj.onclick = () => { this.Toggle(); };
            }, 250);
        }
    }
}


// ----------Data
var data;

function Data ()
{
    ThrowError(1);
}

Data.Set = function ()
{
    let request = new XMLHttpRequest();
    
    request.onload = () => {
        if (request.status < 400)
        {
            data = JSON.parse(request.responseText);
        }
    };
    
    request.onerror = () => {
        ThrowError(3);
    };
    
    request.open("GET", "/data/data.json");
    request.overrideMimeType("application/json");
    request.send();
};


// ----------Debugging
function ThrowError (errorCode)
{
    var errorText;
    
    switch (errorCode)
    {
        case 0:
            errorText = "Value was unassigned or invalid";
            break;
        case 1:
            errorText = "Using static class as a function";
            break;
        case 2:
            errorText = "There is no instance to work with";
            break;
        case 3:
            errorText = "File or source is invalid";
            break;
    }
    
    errorText += `\nError Code: ${errorCode}`;
    
    alert(errorText);
    console.error(errorText);
    throw new Error(errorText);
}