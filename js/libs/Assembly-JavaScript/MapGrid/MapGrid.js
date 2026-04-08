class MapGrid extends GameBehavior
{
    static current = null;
    static id = null;

    #grid = null;

    min = Vector2.zero;
    max = Vector2.zero;
    nodes = [];

    Awake ()
    {
        MapGrid.current = this;
        MapGrid.scene = SceneManager.GetActiveScene().index;
        
        this.#grid = this.GetComponent(Grid);

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

    CellToWorld (pos)
    {
        return this.#grid.CellToWorld(pos);
    }

    NodeOn (pos)
    {
        const xArray = this.nodes[pos.x];

        if (xArray == null) return new MapNode(1);

        return xArray[pos.y] ?? new MapNode(1);
    }
}