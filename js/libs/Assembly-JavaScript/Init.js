class Init extends GameBehavior
{
    #loadedLoader = false;
    #t = 0;

    Awake ()
    {
        Loader.Ready(2);

        (async () => {
            await SceneManager.Load(1);
            this.#loadedLoader = true;
        })();
    }

    Update ()
    {
        this.#t += Time.deltaTime;

        if (this.#t >= 0.5 && this.#loadedLoader) SceneManager.SetActiveScene(1);
    }
}