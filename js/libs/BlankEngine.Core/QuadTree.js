class QuadTree
{
    depth = 0;
    areas = [];
    children = [];
    items = [];

    rect = null;

    constructor (area, depth)
    {
        this.depth = depth ?? 0;

        this.Resize(area ?? new Rect(50, 50, 100, 100));
    }

    Clear ()
    {

    }

    Resize (area)
    {
        this.Clear();

        this.rect = area;

        const childSize = Vector2.Scale(area.size, 0.5);
    }
}