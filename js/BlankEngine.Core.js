function BlankEngineCoreCore()
{
    ThrowError(1);
}

BlankEngineCoreCore.initiateProgram = function ()
{
    document.body.style.height = "100vh";
    document.body.style.margin = "0";
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    
    this.loadData();
};

BlankEngineCore.loadData = function ()
{
    let windowR = new XMLHttpRequest();
    let shaderR = new XMLHttpRequest();
    
    windowR.onload = function ()
    {
        if (windowR.status < 400)
        {
            BlankEngineCore.windowData = JSON.parse(this.responseText);
        }
    };
    
    shaderR.onload = function ()
    {
        if (shaderR.status < 400)
        {
            BlankEngineCore.shaderData = JSON.parse(this.responseText);
            BlankEngineCore.init();
        }
    };
    
    windowR.onerror = function ()
    {
        ThrowError(3);
    };
    
    shaderR.onerror = function ()
    {
        ThrowError(3);
    };
    
    windowR.open("GET", "../package.json");
    shaderR.open("GET", "../data/shaders.json");
    windowR.overrideMimeType("application/json");
    shaderR.overrideMimeType("application/json");
    windowR.send();
    shaderR.send();
};

BlankEngineCore.init = function ()
{
    this.name = this.windowData.name;
    this.wData = this.windowData.window;
    
    Window.data = this.windowData.window;
    
    this.game = new Game(this.wData.width, this.wData.height);
    
    Window.requestUpdate();
    this.requestUpdate();
};

BlankEngineCore.requestUpdate = function ()
{
    requestAnimationFrame(this.update.bind(this));
};

BlankEngineCore.update = function ()
{
    this.game.Update();
    this.requestUpdate();
};

class Game
{
    constructor (width, height)
    {
        if (width == null || height == null) return ThrowError(0);
        
        this.htmlCanvas = document.createElement("canvas");
        this.htmlCanvas.width = width;
        this.htmlCanvas.height = height;
        
        this.htmlCanvas.style.margin = "auto";
        this.htmlCanvas.style.objectFit = "contain";
        this.htmlCanvas.style.maxWidth = "100%";
        this.htmlCanvas.style.maxHeight = "100%";
        
        this.gl = this.htmlCanvas.getContext("webgl2");
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        document.body.appendChild(this.htmlCanvas);
        
        var test = new Material(this.gl, BlankEngineCore.shaderData.vShader, BlankEngineCore.shaderData.fShader);
    }
    
    Update ()
    {
        this.gl.viewport(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.flush();
    }
}

class Material
{
    constructor (gl, vertexShader, fragmentShader)
    {
        this.gl = gl;
        
        let vShader = this.asShader(vertexShader, this.gl.VERTEX_SHADER);
        let fShader = this.asShader(fragmentShader, this.gl.FRAGMENT_SHADER);
    }
    
    asShader (shader, type)
    {
        var output = this.gl.createShader(type);
        
        this.gl.shaderSource(output, shader);
        this.gl.compileShader(output);
        
        if (!this.gl.getShaderParameter(output, this.gl.COMPILE_STATUS))
        {
            let errorText = `${this.gl.getShaderInfoLog(output)}`;
            
            console.error(errorText);
            alert(errorText);
            
            return null;
        }
        
        return output;
    }
}

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