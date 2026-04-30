class Party extends SnekChar
{
    static #pool = new Map();

    static size = 4;

    static instance = null;
    static loadData = null;

    Awake ()
    {
        this.DontDestroyOnLoad(this);
        Party.instance = this;
    }

    static async Load ()
    {
        this.#pool.set(0, {
            name: "yoki",
            char: Player.instance,
            sprRen: Player.instance.GetComponent(SpriteRenderer),
            sprLib: Player.instance.GetComponent(SpriteLibrary),
            sprRes: Player.instance.GetComponent(SpriteResolver),
            onSwitchStart: () => { },
            onSwitchEnd: () => { }
        });
        
        let loaded = 1;

        for (let i = 1; i < this.size; i++) (async () => {
            await this.#Add();
            loaded++;
        })();

        await CrystalEngine.Wait(() => loaded == this.size);

        this.#pool.forEach(item => {
            const renderer = item.char.GetComponent(SpriteRenderer);

            item.onSwitchStart = () => renderer.color.a = 0;
            Loader.onSwitchStart.Add(item.onSwitchStart);

            item.onSwitchEnd = () => {
                if (item.name != null) renderer.color.a = 1;
            };
            Loader.onSwitchEnd.Add(item.onSwitchEnd);
        })
    }

    static Unload ()
    {
        this.DestroyOnLoad(Party.instance);

        this.#pool.forEach((item, index) => {
            Loader.onSwitchStart.Remove(item.onSwitchStart);
            Loader.onSwitchEnd.Remove(item.onSwitchEnd);

            this.DestroyOnLoad(item.char);

            if (item.name != null && item.name !== "yoki")
            {
                Resources.DestroyOnLoad(
                    `spritelibs/chars/${item.name}`,
                    `sprites/chars/${item.name}`
                );
            }
        });

        this.#pool = new Map();
    }

    static async OnJump ()
    {
        Party.instance.ClearMoves();

        this.#pool.forEach((item, index) => {
            if (index > 0) item.char.JumpTo(Player.instance.gridPos);
        });
    }

    static async OnTP ()
    {
        if (this.loadData == null) Party.instance.ClearMoves();

        this.#pool.forEach((item, index) => {
            if (index === 0) return;

            if (this.loadData == null)
            {
                item.char.TP(Player.instance.gridPos);
                item.char.LookAt(Player.instance.lookingAt);

                return;
            }

            item.char.TP(new Vector2(this.loadData[index].pos.x, this.loadData[index].pos.y));
            item.char.LookAt(new Vector2(this.loadData[index].dir.x, this.loadData[index].dir.y));

            Party.instance.followers[index - 1].LoadMoves(this.loadData[index].moves);
        });

        this.loadData = null;
    }

    static async #Add ()
    {
        const gameObject = await this.Instantiate(Resources.FindPrefab("entities/base"));
        this.DontDestroyOnLoad(gameObject);

        const char = gameObject.GetComponent(RPGMovement);
        char.charCollision = false;
        char.TP(Player.instance.gridPos);
        Party.instance.Add(char);

        const sprRen = gameObject.GetComponent(SpriteRenderer);
        sprRen.color.a = 0;         

        const member = {
            name: null,
            char: char,
            sprRen: sprRen,
            sprLib: gameObject.GetComponent(SpriteLibrary),
            sprRes: gameObject.GetComponent(SpriteResolver),
            onSwitchStart: () => { },
            onSwitchEnd: () => { }
        };
        this.#pool.set(this.#pool.size, member);
    }

    static async Set (index, name)
    {
        const member = this.#pool.get(index);

        if (member == null || member.name === name || name == null) return;

        if (member.name != null) this.Clear(index);

        member.name = name;
        member.char.charCollision = false;
        
        Resources.DontDestroyOnLoad(
            `sprites/chars/${name}`,
            `spritelibs/chars/${name}`
        );
        await Resources.Load([
            `sprites/chars/${name}`,
            `spritelibs/chars/${name}`
        ]);

        member.sprLib.asset = Resources.Find(`spritelibs/chars/${name}`);
        member.sprRen.color.a = this.loadData == null;
    }

    static Clear (index)
    {
        const member = this.#pool.get(index);

        if (member == null || member.name == null) return;

        if (index > 0)
        {
            member.char.charCollision = false;
            member.sprRen.color.a = 0;
        }

        member.sprLib.asset = Resources.Find("spritelibs/chars/yoki");

        if (member.name !== "yoki")
        {
            Resources.DestroyOnLoad(
                `spritelibs/chars/${member.name}`,
                `sprites/chars/${member.name}`
            );
        }

        member.name = index > 0 ? null : "yoki";
    }

    static Has (name)
    {
        const iterator = this.#pool[Symbol.iterator]();

        for (const item of iterator)
        {
            if (item[1].name === name) return true;
        }

        return false
    }

    static GetNames ()
    {
        return Array.from(this.#pool).map(item => item[1].name);
    }
    
    static DataSave ()
    {
        return Array.from(this.#pool).map(item => {
            const data = item[1];
            const output = {
                name: data.name,
                pos: {
                    x: data.char.gridPos.x,
                    y: data.char.gridPos.y
                },
                dir: {
                    x: data.char.lookingAt.x,
                    y: data.char.lookingAt.y
                }
            };

            if (item[0] > 0) output.moves = Party.instance.followers[item[0] - 1].MovesSave();

            return output;
        });
    }

    static async LoadData (data)
    {
        if (this.loadData != null) return;

        this.loadData = data;

        const charCount = Math.min(data.length, this.size);
        let loadedChars = 0;

        for (let i = 0; i < charCount; i++) (async () => {
            await this.Set(i, data[i].name);
            loadedChars++;
        })();

        await CrystalEngine.Wait(() => loadedChars === charCount);
    }

    static GetChars ()
    {
        return Array.from(this.#pool).map(item => item[1].char);
    }
}