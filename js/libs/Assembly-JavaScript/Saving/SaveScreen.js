class SaveScreen extends GameBehavior
{
    // 0: Save
    // 1: Load
    static mode = 0;
    static recent = 0;
    static chars = new Set();

    static instance = null;

    static async Show (mode)
    {
        this.mode = mode ?? 0;

        if (Player.instance != null) Player.instance.avoidInputs = true;
        Time.timeScale = 0;

        await RPGSave.RefreshGlobal();

        this.instance.gameObject.SetActive(true);
    }

    static async Hide ()
    {
        this.instance.gameObject.SetActive(false);

        const titlescreen = GameObject.Find("titlescreen")?.GetComponent("TitleScreen");
        if (titlescreen != null) Transitioner.instance.FadeIn(() => titlescreen.Open());

        Time.timeScale = 1;
        if (Player.instance != null) Player.instance.avoidInputs = false;
    }

    #processing = false;
    #cursorTime = 0;
    #scroll = -1;
    #selected = -1;

    #titleText = null;
    #selector = null;
    #arrowUp = null;
    #arrowDown = null;
    #items = [];

    async Load ()
    {
        SaveScreen.instance = this;

        this.chars = new Set(
            RPGSave.global.filter(item => item != null)
                          .map(item => item.party)
                          .flat()
                          .filter(item => item != null)
        );

        let loaded = 0;

        this.chars.forEach(async item => {
            Resources.DontDestroyOnLoad(
                `spritelibs/chars/${item}`,
                `sprites/chars/${item}`
            );
            await Resources.Load([
                `sprites/chars/${item}`,
                `spritelibs/chars/${item}`
            ]);
            loaded++;
        })

        await CrystalEngine.Wait(() => loaded === this.chars.size);

        let recentDate = 0;

        for (let i = 0; i < 20; i++)
        {
            if (RPGSave.global[i] == null) continue;

            const date = RPGSave.global[i].saveDate;

            if (date < recentDate || date <= 0) return;

            recentDate = date;
            SaveScreen.recent = i;
        }
    }

    OnEnable ()
    {
        this.transform.parent = Camera.main?.transform;
        
        this.#processing = false;
        this.#cursorTime = 0;

        if (this.#selected < 0) return;
        
        this.#titleText.text = `${SaveScreen.mode === 0 ? "Save to" : "Load"} which file?`;
        this.#selector.color.a = 1;

        this.#scroll = -1;
        this.#selected = -1;

        this.Scroll(Math.max(SaveScreen.recent - 2, 0));
        this.Select(SaveScreen.recent);
    }

    Start ()
    {
        this.#titleText = this.transform.Find("save_titlebox/text").GetComponent(Text);
        this.#selector = this.transform.Find("save_selector").GetComponent(SpriteRenderer);
        this.#arrowUp = this.transform.Find("save_arrowup").gameObject;
        this.#arrowDown = this.transform.Find("save_arrowdown").gameObject;
        this.#items = [
            this.transform.Find("save_item_0").GetComponent(SaveItem),
            this.transform.Find("save_item_1").GetComponent(SaveItem),
            this.transform.Find("save_item_2").GetComponent(SaveItem),
            this.transform.Find("save_item_3").GetComponent(SaveItem),
            this.transform.Find("save_item_4").GetComponent(SaveItem)
        ];

        this.Scroll(0);
        this.Select(0);

        this.DontDestroyOnLoad(this);
        this.gameObject.SetActive(false);
    }

    #AnimateCursor ()
    {
        this.#cursorTime += Time.unscaledDeltaTime * 60;

        if (this.#cursorTime >= 40) this.#cursorTime = this.#cursorTime % 40;

        let opacity = 255;

        if (this.#cursorTime < 20) opacity -= this.#cursorTime * 8;
        else opacity -= (40 - this.#cursorTime) * 8;

        this.#selector.color.a = opacity / 255;
    }

    async Update ()
    {
        this.#AnimateCursor();

        if (this.#processing) return;

        if (InputManager.IsTriggered("cancel"))
        {
            AudioManager.instance.PlayNo();
            SaveScreen.Hide();

            return;
        }

        const selectBy = +InputManager.IsRepeated("down") - +InputManager.IsRepeated("up");

        if (this.#selected === 0 && InputManager.IsTriggered("up")) this.Select(19);
        else if (this.#selected === 19 && InputManager.IsTriggered("down")) this.Select(0);
        else if (Math.abs(selectBy) > 0) this.Select(this.#selected + selectBy);
        
        if (!InputManager.IsTriggered("ok")) return;
        if (SaveScreen.mode === 1 && RPGSave.global[this.#selected] == null) return;

        this.#processing = true;

        AudioManager.instance.PlayConfirm();

        if (SaveScreen.mode === 0)
        {
            await RPGSave.SaveGame(this.#selected);
            SaveScreen.Hide();
        }
        else
        {
            AudioManager.instance.FadeOutBGM(1);

            Transitioner.instance.FadeOut(() => {
                SaveScreen.Hide();
                RPGSave.LoadGame(this.#selected);
            });
        }
    }

    Scroll (index)
    {
        index = Math.Clamp(index, 0, 15);

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

        if (this.#selected >= 0) AudioManager.instance.PlaySelect();

        this.#selected = index;

        if (index < this.#scroll) this.Scroll(index);
        if (index > this.#scroll + 4) this.Scroll(index - 4);

        this.#selector.transform.position = this.#items[index - this.#scroll].transform.position;
    }
}