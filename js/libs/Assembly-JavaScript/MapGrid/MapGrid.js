class MapGrid extends GameBehavior
{
    static current = null;

    #grid = null;

    min = new Vector2(-12, -23);
    max = new Vector2(11, 16);
    nodes = [];

    Awake ()
    {
        MapGrid.current = this;
        
        this.#grid = this.GetComponent("Grid");

        this.#Generate();
    }

    #Generate ()
    {
        const size = Vector2.Subtract(this.max, this.min);

        for (let x = 0; x <= size.x; x++)
        {
            let xArray = [];

            for (let y = 0; y <= size.y; y++)
            {
                const newNode = new MapNode();
                newNode.x = x;
                newNode.y = y;
                newNode.gridX = this.min.x + x;
                newNode.gridY = this.min.y + y;

                // this.Instantiate(Resources.FindPrefab("box"), null, this.#grid.CellToWorld(new Vector2(newNode.gridX, newNode.gridY)));

                xArray.push(newNode);
            }

            this.nodes.push(xArray);
        }
    }

    NodeOnGrid (pos)
    {
        return this.nodes.flat().find(item => item.gridX === pos.x && item.gridY === pos.y);
    }

    NodeOnWorld (pos)
    {
        return this.NodeOnGrid(this.#grid.WorldToCell(pos));
    }

    NodeOn (pos)
    {
        const xArray = this.nodes[pos.x];

        if (xArray == null) return new MapNode(true);

        return xArray[pos.y] ?? new MapNode(true);
    }
}