class Parallax extends GameBehavior
{
    #camBounds = new Bounds(
        Vector2.zero,
        new Vector2(10, 9)
    );
    #sprSize = Vector2.zero;
    #count = Vector2.zero;
    #renderers = new Map();

    speed = Vector2.zero;

    sprite = null;

    async Load (sprite)
    {
        this.sprite = sprite;

        this.#sprSize = new Vector2(
            this.sprite.rect.width / this.sprite.pixelPerUnit,
            this.sprite.rect.height / this.sprite.pixelPerUnit
        );

        this.#count = Vector2.Divide(this.#camBounds.size, this.#sprSize);

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

    async Awake ()
    {
        for (let y = 0; y < this.#count.y; y++)
        {
            for (let x = 0; x < this.#count.x; x++) (async () => {
                const renderer = this.#renderers.get(`${x}_${y}`);
                renderer.transform.parent = this.transform;
                renderer.transform.localPosition = new Vector2(
                    0.5 * (this.#sprSize.x - this.#camBounds.size.x) + x * this.#sprSize.x,
                    0.5 * (this.#camBounds.size.y - this.#sprSize.y) - y * this.#sprSize.y
                );
            })();
        }
    }
}