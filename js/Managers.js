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
            requestFunc = Function("afterFunc", `let request = new XMLHttpRequest(); request.onload = () => { if (request.status < 400) { ${varName} = JSON.parse(request.responseText); afterFunc(); } }; request.onerror = () => { ThrowError(3); }; request.open("GET", "${file}"); request.overrideMimeType("application/json"); request.send();`);
            break;
        case 2:
            var arrayRequest;
            
            for (let i = 0; i < file.length; i++)
            {
                if (i < file.length - 1) arrayRequest += `call${i} = () => { Managers.Data.ReadJSONFile(${file[i]}, ${varName[i]}, call${i + 1}); }; `;
            }
            
            requestFunc = Function("afterFunc", `${arrayRequest}call${file.length - 1} = () => { Managers.Data.ReadJSONFile(${file[file.length - 1]}, ${varName[file.length - 1]}, afterFunc); }; call0();`);
            break;
    }
    
    requestFunc(afterFunc ?? function () { });
};