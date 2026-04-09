class Illustrator extends GameBehavior
{
    #illusts = new Map();

    #last = null;

    min = 2;

    Awake ()
    {
        this.DontDestroyOnLoad(this, ["sprites/pixel"]);
    }

    Start ()
    {
        EventSystem.illustrator = this;

        for (let i = 0; i < this.min; i++) this.AddIllusts(i);
    }

    async AddIllusts (index)
    {
        let illust = this.#illusts.get(index);

        if (illust == null)
        {
            const gameObj = await this.Instantiate(Resources.FindPrefab("illust"), this.transform);
            illust = {
                renderer: gameObj.GetComponent(SpriteRenderer),
                img: null,
                opacity: 0
            };

            this.#illusts.set(index, illust);
        }

        return illust;
    }

    async Set (index, img, opacity)
    {
        EventSystem.dialogueBox.Close();

        this.transform.parent = Camera.main?.transform;

        if (this.#last != null)
        {
            const last = await this.AddIllusts(index);
            last.renderer.sortingOrder = 0;
        }

        this.#last = index;

        const illust = await this.AddIllusts(index);
        illust.renderer.sortingOrder = 1;
        
        if (illust.img !== img)
        {
            illust.img = img;
            illust.renderer.sprite = Resources.Find(`sprites/illusts/${img}`).sprites[0];
        }

        if (illust.opacity !== opacity)
        {
            illust.opacity = opacity;
            illust.renderer.color.a = opacity;
        }
    }

    Clear (index)
    {
        const illust = this.#illusts.get(index);

        if (illust == null) return;

        if (this.#last === index) this.#last = null;

        if (index >= this.min)
        {
            GameObject.Destroy(illust.renderer.gameObject);
            this.#illusts.delete(index);

            return;
        }

        illust.renderer.sortingOrder = 0;
        illust.renderer.sprite = Resources.Find("sprites/pixel").sprites[0];
        illust.renderer.color.a = 0;

        illust.img = null;
        illust.opacity = 0;
    }
}