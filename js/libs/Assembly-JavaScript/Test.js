class Test extends GameBehavior
{
    #checkMode = false;
    #collided = false;
    #speed = 3;
    #input = Vector2.zero;

    #spr = null;
    #otherSpr = null;

    Start ()
    {
        this.#spr = this.GetComponent("Renderer");
        this.#otherSpr = GameObject.Find("obj_other").GetComponent("Renderer");
    }

    FixedUpdate ()
    {
        const movement = Vector2.Scale(this.#input.normalized, this.#speed * Time.fixedDeltaTime);
        const bounds = this.#spr.bounds;
        const otherBounds = this.#otherSpr.bounds;
        const pos = this.transform.position;
        const newPos = Vector2.Add(pos, movement);

        if (this.#checkMode && this.#collided !== bounds.Intersects(otherBounds))
        {
            this.#collided = !this.#collided;

            this.#spr.color = this.#collided ? Color.blue : Color.white;
            this.#otherSpr.color = this.#collided ? Color.red : Color.green;
        }
        if (!this.#checkMode)
        {
            if (new Bounds(new Vector2(newPos.x, pos.y), bounds.size).Intersects(otherBounds)) newPos.x = pos.x;
            if (new Bounds(new Vector2(pos.x, newPos.y), bounds.size).Intersects(otherBounds)) newPos.y = pos.y;
        }

        this.transform.position = newPos;
    }

    Update ()
    {
        this.#input = new Vector2(
            +Input.GetKey(KeyCode.ArrowRight) - +Input.GetKey(KeyCode.ArrowLeft),
            +Input.GetKey(KeyCode.ArrowUp) - +Input.GetKey(KeyCode.ArrowDown)
        );
    }
}