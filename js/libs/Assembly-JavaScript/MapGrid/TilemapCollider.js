class TilemapCollider extends GameBehavior
{
    removeTilemap = true;
    type = 0;

    Start ()
    {
        const tilemap = this.GetComponent(Tilemap);
        const size = Vector2.Subtract(MapGrid.current.max, MapGrid.current.min);

        for (let x = 0; x <= size.x; x++)
        {
            for (let y = 0; y <= size.y; y++)
            {
                const node = MapGrid.current.NodeOn(new Vector2(x, y));

                if (tilemap.GetTile(node.gridPos) != null) node.collider = this.type + 1;
            }
        }

        if (this.removeTilemap)
        {
            tilemap.color.a = 0;
            tilemap.gameObject.SetActive(false);
        }
    }
}