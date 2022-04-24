function BlankEngine()
{
    ThrowError("This is a static class");
}

BlankEngine.initiateProgram = function ()
{
    this.loadData();
    this.requestUpdate();
};

BlankEngine.loadData = function ()
{
    let windowR = new XMLHttpRequest();
    //let shaderR = new XMLHttpRequest();
    
    windowR.onload = function ()
    {
        if (windowR.status < 400)
        {
            BlankEngine.windowData = JSON.parse(this.responseText);
        }
    };
    
    /*shaderR.onload = function ()
    {
        if (shaderR.status < 400)
        {
            BlankEngine.shaderData = JSON.parse(this.responseText);
            BlankEngine.init();
        }
    };*/
    
    windowR.onerror = function ()
    {
        ThrowError(3);
    };
    
    /*shaderR.onerror = function ()
    {
        ThrowError(3);
    };*/
    
    windowR.open("GET", "/package.json");
    //shaderR.open("GET", "/data/shaders.json");
    windowR.overrideMimeType("application/json");
    //shaderR.overrideMimeType("application/json");
    windowR.send();
    //shaderR.send();
};

BlankEngine.init = function ()
{
    this.name = this.windowData.name;
    this.window = this.windowData.window;
    
    document.title = this.window.title;
    
    game = new Game(this.window.width, this.window.height);
};

BlankEngine.requestUpdate = function ()
{
    requestAnimationFrame(this.update);
};

BlankEngine.update = function ()
{
    game.Update();
};

class Game
{
    constructor (width, height)
    {
        this.htmlCanvas = document.createElement("canvas");
        this.htmlCanvas.width = width;
        this.htmlCanvas.height = height;
        
        this.gl = this.htmlCanvas.getContext("webgl2");
        
        document.body.appendChild(this.htmlCanvas);
        
        //var test = new Material(this.gl, BlankEngine.shaderData.vShader, BlankEngine.shaderData.fShader);
    }
    
    Update ()
    {
        gl.viewport(0, 0, game.htmlCanvas.width, game.htmlCanvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.flush();
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