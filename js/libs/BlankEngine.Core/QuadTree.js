class QuadTree
{
    #depth = 0;
    #maxDepth = 8;
    #areas = [];
    #child = [];
    #items = [];

    #rect = null;

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

        this.Resize(area ?? new Rect(50, 50, 100, 100));
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