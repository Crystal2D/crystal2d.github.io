class MapNode
{
    collider = false;
    x = 0;
    y = 0;
    gridX = 0;
    gridY = 0;
    owners = [];

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

    AddOwner (obj)
    {
        this.owners.push(obj);
    }

    RemoveOwner (obj)
    {
        const index = this.owners.indexOf(obj);

        if (index < 0) return;

        this.owners.splice(index, 1);
    }

    GetOwnerOfType (type)
    {
        return this.owners.find(item => (item instanceof type));
    }
}