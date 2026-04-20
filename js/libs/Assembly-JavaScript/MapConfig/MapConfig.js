class MapConfig extends GameBehavior
{
    transfers = [];
    interactables = [];

    Start ()
    {
        EventSystem.onUpdate.Add(() => this.#Set());
        this.#Set();

        if (MapTransfer.last != null) Party.OnTransfer();
    }

    #Set ()
    {
        for (let i = 0; i < this.transfers.length; i++)
        {
            Loader.Ready(this.transfers[i].scene);
            
            const min = this.transfers[i].min;
            const max = this.transfers[i].max;
            
            for (let x = min.x; x <= max.x; x++)
            {
                for (let y = min.y; y <= max.y; y++)
                {
                    const node = MapGrid.current.NodeOnGrid(new Vector2(x, y));

                    if (!this.transfers[i].isEnabled) node.RemoveOwner(this.transfers[i]);
                    else node.AddOwner(this.transfers[i]);
                }
            }
        }

        for (let i = 0; i < this.interactables.length; i++)
        {
            const pos = this.interactables[i].pos;
            const node = MapGrid.current.NodeOnGrid(new Vector2(pos.x, pos.y));

            if (!this.interactables[i].isEnabled) node.RemoveOwner(this.interactables[i]);
            else node.AddOwner(this.interactables[i]);
        }
    }
}