class CamCtrl extends Viewport
{
    #speed = 0;
    #lastOffset = Vector2.zero;
    #onScrollEnd = () => { };

    #scroll = null;

    offset = Vector2.zero;
    clampMin = Vector2.zero;
    clampMax = Vector2.zero;

    target = null;

    Update ()
    {
        super.Update();

        if (this.#scroll == null) return;

        this.offset = Vector2.Add(
            this.offset,
            Vector2.Scale(
                this.#scroll.normalized,
                Time.deltaTime * this.#speed
            )
        );

        if (Vector2.Abs(Vector2.Subtract(this.offset, this.#lastOffset)).GreaterEquals(Vector2.Abs(this.#scroll)))
        {
            this.offset = Vector2.Add(this.#lastOffset, this.#scroll);
            this.#scroll = null;

            this.#onScrollEnd();
        }
    }
    
    LateUpdate ()
    {
        this.transform.position = Vector2.Clamp(
            Vector2.Add(
                Vector2.Add(this.target.position, new Vector2(0, -0.3125)),
                this.offset
            ),
            this.clampMin,
            this.clampMax
        );

        super.LateUpdate();
    }

    async Scroll (offset, speed)
    {
        if (this.#scroll != null) return;

        this.#speed = 30 * Math.pow(2, speed) / 256;
        this.#lastOffset = this.offset.Duplicate();
        this.#scroll = offset.Duplicate();

        await new Promise(resolve => this.#onScrollEnd = resolve);
    }
}