class RPGSave
{
    static #webDB = null;

    static #GetSrc (index)
    {
        if (index === -2) return "config";
        if (index === -1) return "config_more";
        if (index === 0) return "global";
        
        return `file${index}`;
    }

    static async Init ()
    {
        if (Application.isInElectron || Application.isInCordova) return;

        // window.indexedDB.deleteDatabase("save");

        const dbRequest = window.indexedDB.open("save");
        dbRequest.onupgradeneeded = () => {
            dbRequest.result.createObjectStore("config");
            dbRequest.result.createObjectStore("config_more");
            dbRequest.result.createObjectStore("global");
            
            for (let i = 1; i <= 20; i++) dbRequest.result.createObjectStore(`file${i}`);
        };

        await new Promise(resolve => dbRequest.onsuccess = resolve);
        this.#webDB = dbRequest.result;
    }

    static async Save (index, data)
    {
        const src = this.#GetSrc(index);
        const compressed = LZString.compressToBase64(JSON.stringify(data));

        if (Application.isInCordova) return;
        else if (Application.isInElectron) return;

        const transaction = this.#webDB.transaction(src, "readwrite");
        const request = transaction.objectStore(src).put(compressed, 0);
        await new Promise(resolve => request.onsuccess = resolve);
    }

    static async Load (index)
    {
        const src = this.#GetSrc(index);
        let data = null;

        if (Application.isInCordova);
        else if (Application.isInElectron);
        else
        {
            const transaction = this.#webDB.transaction(src, "readonly");
            const request = transaction.objectStore(src).get(0);
            await new Promise(resolve => request.onsuccess = resolve);
            data = request.result;
        }

        if (data == null) return null;

        return JSON.parse(LZString.decompressFromBase64(data));
    }
}