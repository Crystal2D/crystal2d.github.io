function Managers ()
{
    ThrowError(1);
}

Managers.Data = function ()
{
    ThrowError(1);
};

Managers.Data.ReadJSONFile = function (file, varName, afterFunc)
{
    var hasArrays = 0;
    
    if (Array.isArray(file)) hasArrays++;
    
    if (Array.isArray(varName)) hasArrays++;
    
    if (hasArrays == 1) return ThrowError(0);
    
    var requestFunc;
    
    if (!hasArrays)
    {
        requestFunc = Function(`
    let request = new XMLHttpRequest();
    
    request.onload = function ()
    {
        if (request.status < 400)
        {
            ${varName} = JSON.parse(this.responseText);
            afterFunc();
        }
    };
    
    request.onerror = function ()
    {
        ThrowError(3);
    };
    
    request.open("GET", "${file}");
    request.overrideMimeType("application/json");
    request.send();
    `);
    }
    
    requestFunc();
};