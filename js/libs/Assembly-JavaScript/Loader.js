class Loader extends GameBehavior
{
    static #loaderLoaded = false;

    static readyScenes = [];
    static target = null;

    static async ReadyLoader ()
    {
        if (this.#loaderLoaded) return;

        await SceneManager.Load(1);

        this.#loaderLoaded = true;
    }

    static async Ready (index)
    {
        if (Loader.readyScenes.includes(index)) return;

        await SceneManager.Load(index);

        this.readyScenes.push(index);
    }

    static async SwitchBase ()
    {
        Loader.readyScenes.splice(Loader.readyScenes.indexOf(Loader.target), 1);

        await SceneManager.SetActiveScene(Loader.target);

        Loader.target = null;
        Loader.ReadyLoader();
    }

    static async Switch (index)
    {
        this.target = index;

        if (!Loader.readyScenes.includes(index))
        {
            await CrystalEngine.Wait(() => this.#loaderLoaded);

            this.#loaderLoaded = false;

            SceneManager.SetActiveScene(1);

            return;
        }

        this.SwitchBase();
    }

    #t = 0;

    #spr = null;

    Awake ()
    {
        this.#spr = this.GetComponent("SpriteRenderer");
        this.#spr.color.a = 0;
    }

    Update ()
    {
        if (Loader.target != null && Loader.readyScenes.includes(Loader.target)) Loader.SwitchBase();

        if (this.#t >= 0.3333) this.#spr.color.a = Math.min((this.#t - 0.3333) * 2, 1);
        
        this.#t += Time.deltaTime;
    }
}