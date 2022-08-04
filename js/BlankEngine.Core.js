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
    Managers.Data.ReadJSONFile("../package.json", "BlankEngine.Core.windowData", () => { this.init(); });
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

function ThrowError (errorCode, errorDesc)
{
    var errorText;
    
    switch (errorCode)
    {
        case 0:
            errorText = "Value is unassigned or invalid";
            break;
        case 1:
            errorText = "Using static class as function";
            break;
        case 2:
            errorText = "No instance to work with";
            break;
        case 3:
            errorText = "File cannot be loaded";
            break;
        case 4:
            errorText = "Shader is invalid";
            break;
        case 5:
            errorText = "Cannot set value of read-only variables";
            break;
    }
    
    if (errorDesc != null) errorText += `\n\nDescription: ${errorDesc}`;
    
    errorText += `\n\nError Code: ${errorCode}`;
    
    alert(errorText);
    console.error(errorText);
    throw new Error(errorText);
}