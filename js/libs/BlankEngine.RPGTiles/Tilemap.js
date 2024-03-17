class Tilemap extends GameBehavior
{
    sprites = [];
    tiles = [];

    texture = null;

    Start ()
    {
        this.sprites = [...this.texture.sprites];

        this.sprites.shift();

        const grid = this.GetComponentInParent("Grid");

        for (let i = 0; i < this.tiles.length; i++) this.#NewTile(
            i,
            this.tiles[i].spriteID,
            grid.GetCellCenterWorld(this.tiles[i].position)
        );
    }

    async #NewTile (id, sprite, pos)
    {
        const renderer = new SpriteRenderer(this.sprites[sprite]);
        const transform = new Transform();

        transform.position = pos;

        let objID = null;

        do objID = Math.floor(Math.random() * 65,536) + Math.floor(Math.random() * 65,536);
        while (GameObject.FindByID(objID) != null)

        const gameObj = await SceneManager.CreateObject("GameObject", {
            name : `${this.name}_tile_${id}`,
            components : [renderer],
            transform : transform,
            id : objID,
            parent : this.transform
        });

        const min = renderer.bounds.min;
        const max = renderer.bounds.max;
        const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

        const scene = this.gameObject.scene;

        scene.tree.Insert(gameObj, rect);
        scene.gameObjects.push(gameObj);
    }
}