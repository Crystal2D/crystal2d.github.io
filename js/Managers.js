function Managers ()
{
    ThrowError(1);
}

Managers.Data = function ()
{
    ThrowError(1);
};

Managers.Data.ReadJSONFile = function (file, varName, callback)
{
    var hasArrays = 0;
    
    if (Array.isArray(file)) hasArrays++;
    
    if (Array.isArray(varName)) hasArrays++;
    
    if (hasArrays == 1) return ThrowError(0);
    
    var requestFunc;
    
    switch (hasArrays)
    {
        case 0:
            requestFunc = Function("callback", `let request = new XMLHttpRequest(); request.onload = () => { if (request.status < 400) { ${varName} = JSON.parse(request.responseText); afterFunc(); } }; request.onerror = () => { ThrowError(3); }; request.open("GET", "${file}"); request.overrideMimeType("application/json"); request.send();`);
            break;
        case 2:
            var arrayRequest = "";
            let fileLength = file.length - 1;
            
            for (let i = 0; i < fileLength; i++)
            {
                arrayRequest += `var call_${i} = () => { Managers.Data.ReadJSONFile("${file[i]}", "${varName[i]}", call_${i + 1}); };`;
            }
            
            requestFunc = Function("callback", `${arrayRequest} var call_${fileLength} = () => { Managers.Data.ReadJSONFile("${file[fileLength]}", "${varName[fileLength]}", callback); }; call_0();`);
            break;
    }
    
    requestFunc(callback ?? function () { });
};