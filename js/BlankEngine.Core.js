BlankEngine.Core = function ()
{
    ThrowError(1);
};

BlankEngine.Core.initiateProgram = function ()
{
    document.body.style.height = "100vh";
    document.body.style.margin = "0";
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    
    this.loadData();
};

BlankEngine.Core.loadData = function ()
{
    Managers.Data.ReadJSONFile(["../package.json", "../data/shaders.json"], ["BlankEngine.Core.windowData", "BlankEngine.Core.shaderData"], function () { alert("e"); });
    
    /*let windowR = new XMLHttpRequest();
    let shaderR = new XMLHttpRequest();
    
    windowR.onload = function ()
    {
        if (windowR.status < 400)
        {
            BlankEngine.Core.windowData = JSON.parse(this.responseText);
        }
    };
    
    shaderR.onload = function ()
    {
        if (shaderR.status < 400)
        {
            BlankEngine.Core.shaderData = JSON.parse(this.responseText);
            BlankEngine.Core.init();
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
    shaderR.send();*/
};

BlankEngine.Core.init = function ()
{
    Window.data = this.windowData.window;
    
    Window.init();
    this.requestUpdate();
};

BlankEngine.Core.requestUpdate = function ()
{
    requestAnimationFrame(this.update.bind(this));
};

BlankEngine.Core.update = function ()
{
    if (!document.hasFocus()) return this.requestUpdate();
    
    Application.Update();
    this.requestUpdate();
};

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