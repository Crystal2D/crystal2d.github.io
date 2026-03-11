class MapInit extends GameBehavior
{
    #inited = false;

    Awake ()
    {
        Loader.Ready(4);
        // Loader.Ready(10);
    }

    Update ()
    {
        if (this.#inited) return;

        this.#inited = true;

        const transfer = new MapTransfer();
        // transfer.pos = new Vector2(17, -26);
        transfer.pos = new Vector2(3, -18);
        MapTransfer.last = transfer;

        const renderer = Player.instance.GetComponent("SpriteRenderer");
        
        Loader.onSwitchStart.Add(() => renderer.color.a = 0);
        Loader.onSwitchEnd.Add(() => renderer.color.a = 1);

        const switchCall = () => {
            Loader.onSwitchEnd.Remove(switchCall);
            Transitioner.instance.FadeIn(() => Player.instance.avoidInputs = false);
        };
        Loader.onSwitchEnd.Add(switchCall);

        Loader.Switch(4);
        // Loader.Switch(10);

        // 22
    }
}