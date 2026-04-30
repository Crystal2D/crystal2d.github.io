class RPGSave
{
    static #startTime = 0;
    static #webDB = null;

    static title = "Dwellers Empty Path";
    static saveTime = 0;
    
    static global = null;
    static loading = null;

    static get time ()
    {
        return this.saveTime + (Time.unscaledTime - this.#startTime);
    }

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

        this.RefreshGlobal();
    }

    static async RefreshGlobal ()
    {
        this.global = await this.Load(0);

        if (this.global == null)
        {
            this.global = [];
            for (let i = 0; i < 20; i++) this.global.push(null);

            return;
        }

        let checked = 0;

        for (let i = 0; i < this.global.length; i++) (async () => {
            if (this.global[i] == null)
            {
                checked++;
                return;
            }

            const save = await this.Load(i + 1);
            if (save == null) this.global[i] = null;

            checked++;
        })();

        await CrystalEngine.Wait(() => checked === 20);
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

    static CreateGlobalSave ()
    {
        return {
            title: this.title,
            party: Party.GetNames(),
            time: this.time,
            saveDate: Date.now()
        };
    }

    static Retime ()
    {
        this.#startTime = Time.unscaledTime;
    }

    static CreateSave ()
    {
        this.saveTime = this.time;
        this.Retime();

        return {
            time: this.time,
            scene: MapGrid.scene,
            party: Party.DataSave(),
            bgm: AudioManager.instance.BGMSave(),
            switches: EventSystem.SwitchesSave(),
            variables: EventSystem.VariablesSave(),
            chars: this.CharsSave(),
            eventAutostarts: this.EventAutostartsSave()
        };
    }

    static CharsSave ()
    {
        const party = Party.GetChars();
        const chars = GameObject.FindComponents(RPGMovement).filter(item => !party.includes(item));

        return chars.map(item => {
            return {
                name: item.name,
                pos: {
                    x: item.gridPos.x,
                    y: item.gridPos.y
                },
                dir: {
                    x: item.lookingAt.x,
                    y: item.lookingAt.y
                },
                lookLock: item.lockLook,
                charCollision: item.charCollision,
                animateWalk: item.animateWalk,
                animateIdle: item.animateIdle
            };
        });
    }

    static EventAutostartsSave ()
    {
        const EAs = GameObject.FindComponents(EventAutostart, true);

        return EAs.map(item => {
            return {
                name: item.name,
                event: item.event,
                active: item.isActiveAndEnabled,
                done: item.done
            };
        });
    }

    static Unload ()
    {
        // MapInit
        Resources.DestroyOnLoad(
            "anims/entity",
            "anims/entity_ctrl",
            "anims/entity_reset",
            "sprites/chars/butterfly",
            "spritelibs/chars/butterfly",
            "sprites/entities/sparkle",
            "spritelibs/entities/sparkle"
        );
        Loader.onSwitchStart.Remove(MapInit.switchCall);

        // Player
        this.DestroyOnLoad(Player.instance);

        // Party
        Party.Unload();

        // DialogueBox
        this.DestroyOnLoad(EventSystem.dialogueBox, [
            "sprites/faces/yoki",
            "audio/se/dialogue_1",
            "audio/se/dialogue_2",
            "audio/se/dialogue_3",
            "audio/se/dialogue_4"
        ]);
        this.DestroyOnLoad(EventSystem.dialogueChoiceBox);

        // Illustrator
        this.DestroyOnLoad(EventSystem.illustrator);

        // EventSystem
        EventSystem.onBeforeUpdate.RemoveAll();
        EventSystem.onUpdate.RemoveAll();
    }

    static LoadGame (index)
    {
        if (this.loading != null) return;

        this.loading = index + 1;

        this.Unload();

        Loader.Ready(3);
        Loader.Switch(3);
    }

    static async SaveGame (index)
    {
        this.global[index] = this.CreateGlobalSave();
        const save = this.CreateSave();

        SaveScreen.recent = index;

        for (let i = 0; i < this.global[index].party.length; i++)
        {
            const char = this.global[index].party[i];
            if (char != null) SaveScreen.chars.add(char);
        }
        
        let saved = 0;

        (async () => {
            await this.Save(0, this.global);

            saved++;
        })();

        (async () => {
            await this.Save(index + 1, save);
            saved++;
        })();

        await CrystalEngine.Wait(() => saved === 2);
    }
}