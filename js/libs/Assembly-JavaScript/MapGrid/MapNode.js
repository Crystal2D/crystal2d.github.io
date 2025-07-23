class MapNode
{
    collider = false;
    x = 0;
    y = 0;
    gridX = 0;
    gridY = 0;

    owner = null;

    get pos ()
    {
        return new Vector2(this.x, this.y);
    }

    get gridPos ()
    {
        return new Vector2(this.gridX, this.gridY);
    }

    constructor (collider = false)
    {
        this.collider = collider;
    }
}