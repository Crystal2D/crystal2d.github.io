class Managers { }

Managers.Data = class
{
    static ReadJSONFile (src, varName, callback)
    {
        var hasArrays = 0;
        
        if (Array.isArray(src)) hasArrays++;
        
        if (Array.isArray(varName)) hasArrays++;
        
        if (hasArrays == 1) return ThrowError(0);
        
        var requestFunc;
        
        switch (hasArrays)
        {
            case 0:
                requestFunc = Function("callback", `let request = new XMLHttpRequest(); request.onload = () => { if (request.status < 400) { ${varName} = JSON.parse(request.responseText); callback(); } }; request.onerror = () => { ThrowError(3); }; request.open("GET", "${src}"); request.overrideMimeType("application/json"); request.send();`);
                break;
            case 2:
                var arrayRequest = "";
                let fileLength = src.length - 1;
                
                for (let i = 0; i < fileLength; i++)
                {
                    arrayRequest += `var call_${i} = () => { Managers.Data.ReadJSONFile("${src[i]}", "${varName[i]}", call_${i + 1}); };`;
                }
                
                requestFunc = Function("callback", `${arrayRequest} var call_${fileLength} = () => { Managers.Data.ReadJSONFile("${src[fileLength]}", "${varName[fileLength]}", callback); }; call_0();`);
                break;
        }
        
        requestFunc(callback ?? function () { });
    }
}