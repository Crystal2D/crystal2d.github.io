class SaveScreen extends GameBehavior
{
    static charsSave = null;
    static eventAutostartsSave = null;

    static Ready ()
    {
        Loader.Ready(24);
    }

    static Show ()
    {
        Player.instance.avoidInputs = true;

        this.Ready();

        this.charsSave = RPGSave.CharsSave();
        this.eventAutostartsSave = RPGSave.EventAutostartsSave();

        Loader.Switch(24);
    }

    static Hide ()
    {
        Loader.Switch(MapGrid.scene);

        Player.instance.avoidInputs = false;
    }

    #saving = false;
    #cursorTime = 0;
    #scroll = -1;
    #selected = -1;

    #selector = null;
    #arrowUp = null;
    #arrowDown = null;
    #items = [];

    async Load ()
    {
        Loader.Ready(MapGrid.scene);

        const chars = [...new Set(
            RPGSave.global.filter(item => item != null)
                          .map(item => item.party)
                          .flat()
                          .filter(item => item != null)
        )];

        let loaded = 0;

        for (let i = 0; i < chars.length; i++) (async () => {
            await Resources.Load([
                `sprites/chars/${chars[i]}`,
                `spritelibs/chars/${chars[i]}`
            ]);
            loaded++;
        })();

        await CrystalEngine.Wait(() => loaded === chars.length);
    }

    Start ()
    {
        this.#selector = GameObject.Find("selector").GetComponent(SpriteRenderer);
        this.#arrowUp = GameObject.Find("arrow_up");
        this.#arrowDown = GameObject.Find("arrow_down");
        this.#items = [
            GameObject.Find("item_0").GetComponent(SaveItem),
            GameObject.Find("item_1").GetComponent(SaveItem),
            GameObject.Find("item_2").GetComponent(SaveItem),
            GameObject.Find("item_3").GetComponent(SaveItem),
            GameObject.Find("item_4").GetComponent(SaveItem)
        ];

        this.Scroll(0);
        this.Select(0);
    }

    #AnimateCursor ()
    {
        this.#cursorTime += Time.deltaTime * 60;

        if (this.#cursorTime >= 40) this.#cursorTime = this.#cursorTime % 40;

        let opacity = 255;

        if (this.#cursorTime < 20) opacity -= this.#cursorTime * 8;
        else opacity -= (40 - this.#cursorTime) * 8;

        this.#selector.color.a = opacity / 255;
    }

    async Update ()
    {
        this.#AnimateCursor();

        if (this.#saving) return;

        const selectBy = +InputManager.IsRepeated("down") - +InputManager.IsRepeated("up");

        if (this.#selected === 0 && InputManager.IsTriggered("up")) this.Select(19);
        else if (this.#selected === 19 && InputManager.IsTriggered("down")) this.Select(0);
        else if (Math.abs(selectBy) > 0) this.Select(this.#selected + selectBy);

        if (!InputManager.IsTriggered("ok")) return;

        this.#saving = true;
        await RPGSave.SaveGame(this.#selected);
        SaveScreen.Hide();
    }

    Scroll (index)
    {
        index = Math.Clamp(index, 0, 16);

        if (this.#scroll === index) return;

        this.#scroll = index;

        for (let i = 0; i < 5; i++) this.#items[i].Set(i + index);

        this.#arrowUp.SetActive(index > 0);
        this.#arrowDown.SetActive(index < 15);
    }

    Select (index)
    {
        index = Math.Clamp(index, 0, 19);

        if (this.#selected === index) return;

        this.#selected = index;

        if (index < this.#scroll) this.Scroll(index);
        if (index > this.#scroll + 4) this.Scroll(index - 4);

        this.#selector.transform.position = this.#items[index - this.#scroll].transform.position;
    }
}