class QuadTree
{
    depth = 0;
    areas = [];
    children = [];
    items = [];

    bounds = null;

    constructor (bounds, depth)
    {
        this.depth = depth ?? 0;

        this.Resize(bounds ?? new Bounds(
            new Vector2(50, 50),
            new Vector2(100, 100)
        ));
    }

    Clear ()
    {

    }

    Resize (bounds)
    {
        this.Clear();

        this.bounds = bounds;

        const min = bounds.min;
        const max = bounds.max;
        const childSize = bounds.extents;

        this.children = [
            new Bounds()
        ];
    }
}