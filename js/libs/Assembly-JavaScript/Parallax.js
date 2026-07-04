class Parallax extends GameBehavior
{
    #tileSize = 0.5;
    #tileSizeOG = 48;
    #camSize = new Vector2(10, 9);
    #sprSize = Vector2.zero;
    #count = Vector2.zero;
    #pos = Vector2.zero;
    #threshold = Vector2.zero;
    #renderers = new Map();

    speed = Vector2.zero;
    offset = Vector2.zero;

    sprite = null;

    async Load (sprite)
    {
        this.sprite = sprite;

        this.#sprSize = new Vector2(
            this.sprite.rect.width / this.sprite.pixelPerUnit,
            this.sprite.rect.height / this.sprite.pixelPerUnit
        );
        this.#count = Vector2.Add(
            Vector2.Divide(this.#camSize, this.#sprSize),
            new Vector2(2, 2)
        );
        this.#count.x = Math.ceil(this.#count.x);
        this.#count.y = Math.ceil(this.#count.y);
        this.#threshold = Vector2.Divide(
            Vector2.one,
            Vector2.Divide(
                Vector2.Scale(
                    Vector2.one,
                    0.5 * this.#tileSize
                ),
                this.#sprSize
            )
        );
        
        const targetCount = this.#count.x * this.#count.y;
        let loadedRenderers = 0;

        for (let y = 0; y < this.#count.y; y++)
        {
            for (let x = 0; x < this.#count.x; x++) (async () => {
                const renderer = (await this.Instantiate(Resources.FindPrefab("parallax_image"))).GetComponent(SpriteRenderer);
                renderer.sprite = this.sprite;

                this.#renderers.set(`${x}_${y}`, renderer);

                loadedRenderers++;
            })();
        }

        await CrystalEngine.Wait(() => targetCount === loadedRenderers);
    }

    Awake ()
    {
        this.transform.localPosition = this.offset;

        for (let y = 0; y < this.#count.y; y++)
        {
            for (let x = 0; x < this.#count.x; x++) (async () => {
                const renderer = this.#renderers.get(`${x}_${y}`);
                renderer.transform.parent = this.transform;
                renderer.transform.localPosition = new Vector2(
                    0.5 * (this.#sprSize.x - this.#camSize.x) + ((x - 1) * this.#sprSize.x),
                    0.5 * (this.#camSize.y - this.#sprSize.y) - ((y - 1) * this.#sprSize.y)
                );
            })();
        }
    }

    Start ()
    {
        this.transform.parent = Camera.main.transform;
    }

    Update ()
    {
        this.#pos = Vector2.Add(
            this.#pos,
            Vector2.Scale(
                this.speed,
                (0.5 / this.#tileSizeOG) * (Time.deltaTime * 60)
            )
        );

        const pos = Vector2.Add(
            Vector2.Scale(Camera.main.transform.localPosition, -2),
            this.#pos
        );

        if (Math.abs(pos.x) >= this.#threshold.x) pos.x = (pos.x % this.#threshold.x);
        if (Math.abs(pos.y) >= this.#threshold.y) pos.y = (pos.y % this.#threshold.y);

        this.transform.localPosition = Vector2.Add(
            Vector2.Scale(
                Vector2.Scale(pos, this.#tileSize),
                0.5
            ),
            this.offset
        );
    }
}