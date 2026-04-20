class TilemapCollider extends GameBehavior
{
    #hidden = true;
    #size = Vector2.zero;

    #map = null;

    type = 0;

    get removeTilemap ()
    {
        return this.#hidden;
    }

    set removeTilemap (value)
    {
        this.#hidden = value;

        if (this.#map == null) return;

        this.#map.color.a = +!value;
        this.#map.gameObject.SetActive(!value);

        if (value) this.#map.Unmerge();
        else this.#map.Merge();
    }

    Awake ()
    {
        if (this.GetComponent(EventConditioner) != null) EventSystem.onBeforeUpdate.Add(() => {
            this.Clear();
            this.gameObject.SetActive(true);
        });

        this.#size = Vector2.Subtract(MapGrid.current.max, MapGrid.current.min);

        this.#map = this.GetComponent(Tilemap);
        this.#map.color.a = +!this.#hidden;
        if (this.#hidden) this.#map.Unmerge();
    }

    #Set (value)
    {
        for (let x = 0; x <= this.#size.x; x++)
        {
            for (let y = 0; y <= this.#size.y; y++)
            {
                const node = MapGrid.current.NodeOn(new Vector2(x, y));

                if (this.#map.GetTile(node.gridPos) != null) node.collider = value;
            }
        }
    }

    OnEnable ()
    {   
        this.#map.gameObject.SetActive(!this.#hidden);
        this.#Set(this.type + 1);
    }

    Clear ()
    {
        this.#Set(0);
    }
}