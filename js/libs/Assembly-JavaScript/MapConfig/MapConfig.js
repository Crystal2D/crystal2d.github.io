class MapConfig extends GameBehavior
{
    transfers = [];
    interactables = [];

    Start ()
    {
        for (let i = 0; i < this.transfers.length; i++)
        {
            Loader.Ready(this.transfers[i].scene);
            
            const min = this.transfers[i].min;
            const max = this.transfers[i].max;
            
            for (let x = min.x; x <= max.x; x++)
            {
                for (let y = min.y; y <= max.y; y++) MapGrid.current.NodeOnGrid(new Vector2(x, y)).AddOwner(this.transfers[i]);
            }
        }

        for (let i = 0; i < this.interactables.length; i++)
        {
            if (!this.interactables[i].isEnabled) continue;

            const pos = this.interactables[i].pos;

            MapGrid.current.NodeOnGrid(new Vector2(pos.x, pos.y)).AddOwner(this.interactables[i]);
        }

        if (MapTransfer.last != null)
        {
            Player.instance.TP(MapTransfer.last.pos);
        }
    }
}