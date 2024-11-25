class QuadTree
{
    static maxDepth = 0;

    #items = [];
    #root = null;

    get count ()
    {
        return this.#items.length;
    }

    get area ()
    {
        return this.#root.area;
    }

    constructor (area)
    {
        this.#root = new QuadTreeNode(area, 0);
    }

    Find (area)
    {
        return this.#root.Find(area);
    }

    Remove (item)
    {
        const index = this.#items.indexOf(item);

        if (index < 0) return;

        item.sceneTreeNode.Remove(item);

        this.#items.splice(index, 1);
    }

    Clear ()
    {
        this.#root.Clear();

        this.#items = [];
    }

    Resize (area)
    {
        this.#root.Resize(area);
    }

    Insert (item, size)
    {
        this.#items.push(item);

        this.#root.Insert(item, size);
    }

    Relocate (item, size)
    {
        item.sceneTreeNode.Remove(item);

        this.#root.Insert(item, size);
    }
}