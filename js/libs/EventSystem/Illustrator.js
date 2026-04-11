class Illustrator extends GameBehavior
{
    #camSize = new Vector2(10, 9);
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

    Update ()
    {
        this.#illusts.forEach(item => {
            if (item.duration === 0) return;

            item.time += Time.deltaTime;

            if (item.targetOpacity != null)
            {
                item.opacity = Math.Lerp(item.lastOpacity, item.targetOpacity, item.time / item.duration);
                item.renderer.color.a = item.opacity;
            }

            if (item.targetPos != null)
            {
                item.pos = Vector2.Lerp(item.lastPos, item.targetPos, item.time / item.duration);
                item.renderer.transform.localPosition = Vector2.Add(item.origin, item.pos);
            }

            if (item.time < item.duration) return;

            item.lastOpacity = null;
            item.targetOpacity = null;
            item.lastPos = null;
            item.targetPos = null;

            item.time = 0;
            item.duration = 0;

            item.onDone();
        });
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

                opacity: 0,
                origin: Vector2.zero,
                pos: Vector2.zero,

                lastOpacity: null,
                targetOpacity: null,
                lastPos: null,
                targetPos: null,

                time: 0,
                duration: 0,
                onDone: () => { }                
            };

            this.#illusts.set(index, illust);
        }

        return illust;
    }

    async Set (index, img, opacity, pos = Vector2.zero)
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
        
        if (illust.img === img || illust.duration > 0) return;
        
        illust.img = img;

        const sprite = Resources.Find(`sprites/illusts/${img}`).sprites[0];

        illust.renderer.sprite = sprite;
        illust.origin = new Vector2(
            0.5 * ((sprite.rect.width / sprite.pixelPerUnit) - this.#camSize.x),
            0.5 * (this.#camSize.y - (sprite.rect.height / sprite.pixelPerUnit))
        );
            
        illust.opacity = opacity;
        illust.lastOpacity = opacity;
        illust.renderer.color.a = opacity;

        illust.pos = pos.Duplicate();
        illust.lastPos = pos.Duplicate();

        illust.renderer.transform.localPosition = Vector2.Add(illust.origin, pos);
    }

    async Move (index, opacity, pos, duration = 1)
    {
        EventSystem.dialogueBox.Close();

        const illust = this.#illusts.get(index);

        if (illust == null || illust.duration > 0) return;

        if (opacity != null && opacity !== illust.opacity)
        {
            illust.lastOpacity = illust.opacity;
            illust.targetOpacity = opacity;
        }

        if (pos != null && !pos.Equals(illust.pos))
        {
            illust.lastPos = illust.pos;
            illust.targetPos = pos;
        }

        illust.duration = duration / 60;

        await new Promise(resolve => illust.onDone = resolve);
    }

    Clear (index)
    {
        const illust = this.#illusts.get(index);

        if (illust == null || illust.duration > 0) return;

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