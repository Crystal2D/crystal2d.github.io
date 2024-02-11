class QuadTreeNode
{
    #depth = 0;
    #areas = [];
    #child = [];
    #items = [];

    #rect = null;

    get area ()
    {
        return this.#rect;
    }

    get count ()
    {
        let output = this.#items.length;

        for (let i = 0; i < 4; i++)
        {
            if (this.#child[i] != null) output += this.#child[i].count;
        }

        return output;
    }

    constructor (area, depth)
    {
        this.#depth = depth;

        this.Resize(area);
    }

    Remove (item)
    {
        const obj = this.#items.find(fItem => fItem.item === item);

        if (obj == null) return;

        const index = this.#items.indexOf(obj);

        this.#items.splice(index, 1);
    }

    Clear ()
    {
        this.#items = [];

        for (let i = 0; i < 4; i++)
        {
            if (this.#child[i] == null) continue;
            
            this.#child[i].Clear();
            this.#child[i] = null;
        }
    }

    Resize (area)
    {
        this.Clear();

        this.#rect = area;

        const size = Vector2.Scale(area.size, 0.5);

        this.#areas = [
            new Rect(area.x, area.y, size.x, size.y),
            new Rect(area.x + size.x, area.y, size.x, size.y),
            new Rect(area.x, area.y + size.y, size.x, size.y),
            new Rect(area.x + size.x, area.y + size.y, size.x, size.y)
        ];
    }

    Insert (item, size)
    {
        for (let i = 0; i < 4; i++)
        {
            if (this.#depth + 1 >= QuadTree.maxDepth) break;
            if (!this.#areas[i].Contains(size)) continue;

            if (this.#child[i] == null) this.#child[i] = new QuadTreeNode(this.#areas[i], this.#depth + 1);

            this.#child[i].Insert(item, size);

            return;
        }

        item.sceneTreeNode = this;

        const obj = new QuadTreeItem();

        obj.item = item;
        obj.size = size;

        this.#items.push(obj);
    }

    Find (area)
    {
        let output = [];

        this.FindByParam(area, output);

        return output;
    }

    FindByParam (area, output)
    {
        for (let i = 0; i < this.#items.length; i++)
        {
            if (area.Overlaps(this.#items[i].size)) output.push(this.#items[i].item);
        }

        for (let i = 0; i < 4; i++)
        {
            if (this.#child[i] != null)
            {
                if (area.Contains(this.#areas[i])) this.#child[i].GetItems(output);
                else if (this.#areas[i].Overlaps(area)) this.#child[i].FindByParam(area, output);
            }
        }
    }

    GetItems (output)
    {
        for (let i = 0; i < this.#items.length; i++) output.push(this.#items[i].item);

        for (let i = 0; i < 4; i++)
        {
            if (this.#child[i] != null) this.#child[i].GetItems(output);
        }
    }
}