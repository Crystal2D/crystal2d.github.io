class Illustrator extends GameBehavior
{
    #camSize = new Vector2(10, 9);
    #illusts = new Map();

    #last = null;

    min = 2;

    Awake ()
    {
        this.DontDestroyOnLoad(this);
        EventSystem.illustrator = this;
    }

    Start ()
    {
        for (let i = 0; i < this.min; i++) this.AddIllusts(i);
    }

    Update ()
    {
        this.#illusts.forEach(item => {
            if (item.duration > 0)
            {
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

                if (item.targetPos != null)
                {
                    item.scale = Vector2.Lerp(item.lastScale, item.targetScale, item.time / item.duration);
                    item.renderer.transform.localScale = item.scale;
                }

                if (item.time < item.duration) return;

                item.lastOpacity = null;
                item.targetOpacity = null;
                item.lastPos = null;
                item.targetPos = null;

                item.time = 0;
                item.duration = 0;

                item.onDone();
            }

            if (item.tintDuration > 0)
            {
                item.tintTime += Time.deltaTime;

                item.tint = Color.Lerp(item.lastTint, item.targetTint, item.tintTime / item.tintDuration);
                item.renderer.tint = item.tint;

                if (item.tintTime < item.tintDuration) return;

                item.lastTint = null;
                item.targetTint = null;

                item.tintTime = 0;
                item.tintDuration = 0;

                item.onTint();
            }
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
                scale: Vector2.one,

                lastOpacity: null,
                targetOpacity: null,
                lastPos: null,
                targetPos: null,
                lastScale: null,
                targetScale: null,

                time: 0,
                duration: 0,
                onDone: () => { },
                

                tint: Color.clear,

                lastTint: null,
                targetTint: null,

                tintTime: 0,
                tintDuration: 0,
                onTint: () => { }
            };
            this.#illusts.set(index, illust);
        }

        return illust;
    }

    async Set (index, img, opacity, pos = Vector2.zero, scale = Vector2.one, origin = 1)
    {
        EventSystem.dialogueBox.Close();

        this.transform.parent = Camera.main?.transform;

        if (this.#last != null)
        {
            const last = await this.AddIllusts(this.#last);
            last.renderer.sortingOrder = 0;
        }

        this.#last = index;

        const illust = await this.AddIllusts(index);
        illust.renderer.sortingOrder = 1;
        
        if (illust.img === img || illust.duration > 0) return;
        
        illust.img = img;

        const sprite = Resources.Find(`sprites/illusts/${img}`).sprites[0];

        illust.renderer.sprite = sprite;
        if (origin === 1) illust.origin = new Vector2(
            -0.5 * this.#camSize.x,
            0.5 * this.#camSize.y
        );
            
        illust.opacity = opacity;
        illust.renderer.color.a = opacity;

        illust.pos = pos.Duplicate();
        illust.renderer.transform.localPosition = Vector2.Add(illust.origin, pos);

        illust.scale = scale.Duplicate();
        illust.renderer.transform.localScale = scale.Duplicate();

        illust.tint = Color.clear;
        illust.renderer.tint = Color.clear;
    }

    async Move (index, opacity, pos, scale, duration = 1)
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
            illust.targetPos = pos.Duplicate();
        }

        if (scale != null && !scale.Equals(illust.scale))
        {
            illust.lastScale = illust.scale;
            illust.targetScale = scale.Duplicate();
        }

        illust.duration = duration / 60;

        await new Promise(resolve => illust.onDone = resolve);
    }

    async Tint (index, color, duration = 1)
    {
        EventSystem.dialogueBox.Close();

        const illust = this.#illusts.get(index);

        if (illust == null || illust.tintDuration > 0) return;

        if (color != null && !color.Equals(illust.tint))
        {
            illust.lastTint = illust.tint;
            illust.targetTint = color.Duplicate();
        }

        illust.tintDuration = duration / 60;

        await new Promise(resolve => illust.onTint = resolve);
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