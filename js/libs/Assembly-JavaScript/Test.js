class Test extends GameBehavior
{
    #box = null;

    async Start ()
    {
        Crispixels.effect = true;
        this.#box = this.GetComponent("ItsABox");
        // this.#box.AddChoice("Yes", () => { });
        // this.#box.AddChoice("No", () => { });

        // this.#box.AddChoice("Sure", () => { });
        // this.#box.AddChoice("Not right now", () => { });

        // this.#box.AddChoice("   Start", () => { });
        // this.#box.AddChoice("Continue", () => { });
        // this.#box.AddChoice(" Options", () => { });
        // this.#box.padding = new Vector2(0.375, 0);
    }

    Update ()
    {
        if (Input.GetMouseButtonDown(0)) this.#box.Toggle();
    }
}