class Test extends GameBehavior
{
    constructor () { super(); Application.gl.clearColor(1, 1, 1, 1); }

    Update ()
    {
        let points = [];

        for (let i = 2; i <= 6; i++) points[i - 2] = GameObject.FindByID(i).transform;

        const bounds = this.GetComponent("Text").bounds;
        const min = bounds.min;
        const max = bounds.max;

        points[0].position = bounds.center;
        points[1].position = min;
        points[2].position = new Vector2(max.x, min.y);
        points[3].position = new Vector2(min.x, max.y);
        points[4].position = max;
    }
}