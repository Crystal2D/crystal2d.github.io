class MapTransfer
{
    static last = null;

    loaded = false;
    scene = 0;
    min = Vector2.zero;
    max = Vector2.zero;
    pos = Vector2.zero;

    async Load ()
    {
        await SceneManager.Load(this.scene);

        this.loaded = true;
    }

    async Invoke ()
    {
        await CrystalEngine.Wait(() => this.loaded);

        SceneManager.SetActiveScene(this.scene);

        MapTransfer.last = this;
    }
}