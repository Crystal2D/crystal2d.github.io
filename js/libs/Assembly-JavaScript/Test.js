class Test extends GameBehavior
{
    #renderer = null;
    #points = [];

    constructor () { super(); }

    Start ()
    {
        this.#renderer = this.GetComponent("Renderer");

        for (let i = 0; i < 5; i++) this.#points[i] = GameObject.FindByID(i + 2).transform;
    }

    Update ()
    {
        const bounds = this.#renderer.bounds;
        const min = bounds.min;
        const max = bounds.max

        this.#points[0].position = min;
        this.#points[1].position = new Vector2(max.x, min.y);
        this.#points[2].position = new Vector2(min.x, max.y);
        this.#points[3].position = max;
        this.#points[4].position = bounds.center;
    }
}