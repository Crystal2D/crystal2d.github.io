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
    
    switch (hasArrays)
    {
        case 0:
            requestFunc = Function(`
            let request = new XMLHttpRequest();
            
            request.onload = () => {
                if (request.status < 400)
                {
                    ${varName} = JSON.parse(request.responseText);
                    this.afterFunc();
                }
            };
            
            request.onerror = () => {
                ThrowError(3);
            };
            
            request.open("GET", "${file}");
            request.overrideMimeType("application/json");
            request.send();
            `);
            break;
    }
    
    requestFunc();
};