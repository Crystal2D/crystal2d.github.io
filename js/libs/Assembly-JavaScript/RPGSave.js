class RPGSave
{
    static #webDB = null;
    
    static global = null;

    static #GetSrc (index)
    {
        if (index < 0) return "config";
        if (index === 0) return "global";
        
        return `file${index}`;
    }

    static async Init ()
    {
        if (!GameStorage.isActive)
        {
            // window.indexedDB.deleteDatabase("save");

            const dbRequest = window.indexedDB.open("save");
            dbRequest.onupgradeneeded = () => {
                dbRequest.result.createObjectStore("config");
                dbRequest.result.createObjectStore("global");

                for (let i = 1; i <= 20; i++) dbRequest.result.createObjectStore(`file${i}`);
            };

            await new Promise(resolve => dbRequest.onsuccess = resolve);
            this.#webDB = dbRequest.result;
        }

        this.global = (await this.Load(0)) ?? [];
    }

    static async Save (index, data)
    {
        const src = this.#GetSrc(index);
        const compressed = LZString.compressToBase64(JSON.stringify(data));

        if (GameStorage.isActive)
        {
            await GameStorage.WriteFile(`${src}.tem`, compressed);
            return;
        }

        const transaction = this.#webDB.transaction(src, "readwrite");
        const request = transaction.objectStore(src).put(compressed, 0);
        await new Promise(resolve => request.onsuccess = resolve);
    }

    static async Load (index)
    {
        const src = this.#GetSrc(index);
        let data = null;

        if (GameStorage.isActive)
        {
            try
            {
                data = await GameStorage.ReadFile(`${src}.tem`);
            }
            catch { }
        }
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

    static CreateSave ()
    {
        return {
            scene: MapGrid.scene,
            pos: {
                x: Player.instance.gridPos.x,
                y: Player.instance.gridPos.y
            },
            dir: {
                x: Player.instance.lookingAt.x,
                y: Player.instance.lookingAt.y
            },
            bgm: AudioManager.instance.BGMSave(),
            switches: EventSystem.SwitchesSave(),
            variables: EventSystem.VariablesSave(),
        }
    }
}