class Loader extends GameBehavior
{
    static #loaderLoaded = false;
    static #loadingScenes = [];

    static readyScenes = [];
    static target = null;

    static onSwitchStart = new DelegateEvent();
    static onSwitchEnd = new DelegateEvent();

    static async ReadyLoader ()
    {
        if (this.#loaderLoaded) return;

        await SceneManager.Load(1);

        this.#loaderLoaded = true;
    }

    static async Ready (index)
    {
        if (this.#loadingScenes.includes(index) || this.readyScenes.includes(index)) return;

        this.#loadingScenes.push(index);

        await SceneManager.Load(index);

        this.#loadingScenes.splice(this.#loadingScenes.indexOf(index), 1);
        this.readyScenes.push(index);
    }

    static async SwitchBase (instant)
    {
        this.readyScenes.splice(this.readyScenes.indexOf(this.target), 1);

        await SceneManager.SetActiveScene(this.target);

        const frameCall = () => {
            PlayerLoop.onAfterMeshUpdate.Remove(frameCall);
            
            if (instant) this.onSwitchStart.Invoke();
            this.onSwitchEnd.Invoke();
        };
        PlayerLoop.onAfterMeshUpdate.Add(frameCall);

        this.target = null;
        this.ReadyLoader();
    }

    static async Switch (index)
    {
        this.target = index;

        if (!this.readyScenes.includes(index))
        {
            await CrystalEngine.Wait(() => this.#loaderLoaded);
            this.#loaderLoaded = false;

            SceneManager.SetActiveScene(1);

            return;
        }

        this.SwitchBase(true);
    }

    #t = 0;

    #spr = null;

    Awake ()
    {
        this.#spr = this.GetComponent("SpriteRenderer");
        this.#spr.color.a = 0;
        Loader.onSwitchStart.Invoke();
    }

    Update ()
    {
        if (Loader.target != null && Loader.readyScenes.includes(Loader.target)) Loader.SwitchBase();

        if (this.#t >= 0.3333) this.#spr.color.a = Math.min((this.#t - 0.3333) * 2, 1);
        
        this.#t += Time.deltaTime;
    }
}