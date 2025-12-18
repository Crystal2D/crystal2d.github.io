class Test extends GameBehavior
{
    #box = null;
    #face = null;
    #text = null;

    async Start ()
    {
        Crispixels.effect = true;
        this.#box = this.GetComponent("ItsABox");
        this.#text = GameObject.FindComponents("Text")[0];
        this.#face = GameObject.Find("face").GetComponent("SpriteRenderer");
    }

    Update ()
    {
        if (Input.GetMouseButtonDown(0)) this.#box.Toggle();

        this.#face.transform.position = new Vector2(
            -3 * 1.325,
            this.#box.spriteRenderer.bounds.center.y
        );
        this.#text.transform.position = new Vector2(
            this.#face.bounds.max.x + (0.375 * 0.65),
            this.#box.spriteRenderer.bounds.max.y - (0.5725 * 0.4)
        );
    }
}