class Test2 extends GameBehavior
{
    #trans = null;

    Start ()
    {
        this.#trans = GameObject.FindByID(4).transform;
    }

    LateUpdate ()
    {
        this.transform.position = Vector2.Clamp(
            this.#trans.position,
            new Vector2(-0.25, -18.25),
            new Vector2(14.75, 2.75)
        );
    }
}