class QuadTree
{
    #depth = 0;
    #maxDepth = 8;
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
        this.#depth = depth ?? 0;

        this.Resize(area ?? new Rect(-500, -500, 1000, 1000));
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
            if (this.#areas[i].Contains(size))
            {
                if (this.#depth + 1 < this.#maxDepth)
                {
                    if (this.#child[i] == null)
                    {
                        this.#child[i] = new QuadTree(this.#areas[i], this.#depth + 1);
                    }

                    this.#child[i].Insert(item, size);

                    return;
                }
            }
        }

        this.#items.push(new QuadTreeItem(item, size));
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

class QuadTreeItem
{
    item = null;
    size = new Rect();

    constructor (item, size)
    {
        this.item = item;
        this.size = size;
    }
}