class MapConfig extends GameBehavior
{
    transfers = [];

    Start ()
    {
        for (let i = 0; i < this.transfers.length; i++)
        {
            const min = this.transfers[i].min;
            const max = this.transfers[i].max;
            
            for (let x = min.x; x <= max.x; x++)
            {
                for (let y = min.y; y <= max.y; y++) MapGrid.current.NodeOnGrid(new Vector2(x, y)).owner = this.transfers[i];
            }
        }

        if (MapTransfer.last != null)
        {
            Player.instance.TP(MapTransfer.last.pos);
        }
    }
}