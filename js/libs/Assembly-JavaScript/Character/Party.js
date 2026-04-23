class Party extends SnekChar
{
    static #pool = new Map();

    static size = 2;
    static instance = null;

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
            sprRes: Player.instance.GetComponent(SpriteResolver)
        });

        for (let i = 1; i < this.size; i++) this.#Add();
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
        Party.instance.ClearMoves();

        this.#pool.forEach((item, index) => {
            if (index === 0) return;

            item.char.TP(Player.instance.gridPos);
            item.char.LookAt(Player.instance.lookingAt);
        });
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
            sprRes: gameObject.GetComponent(SpriteResolver)
        };
        this.#pool.set(this.#pool.size, member);
    }

    static async Set (index, name)
    {
        const member = this.#pool.get(index);

        if (member == null || member.name === name) return;

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
        member.sprRen.color.a = 1;
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
            Resources.DestroyOnLoad(`spritelibs/chars/${member.name}`);
            Resources.DestroyOnLoad(`sprites/chars/${member.name}`);
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
}