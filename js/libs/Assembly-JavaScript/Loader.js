class Loader extends GameBehavior
{
    static loaded = false;
    static index = 0;

    static async Ready (index)
    {
        this.loaded = false;
        this.index = index;

        await SceneManager.Load(index);

        this.loaded = true;
    }

    #t = 0;

    #spr = null;

    Start ()
    {
        this.#spr = this.GetComponent("SpriteRenderer");
        this.#spr.color.a = 0;
    }

    Update ()
    {
        if (Loader.loaded) SceneManager.SetActiveScene(Loader.index);

        this.#t += Time.deltaTime;

        this.#spr.color.a = Math.min(this.#t * 2, 1);
    }
}