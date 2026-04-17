class MapInit extends GameBehavior
{
    #inited = false;

    Awake ()
    {
        Resources.DontDestroyOnLoad(
            "anims/entity",
            "anims/entity_ctrl",
            "anims/entity_reset"
        );

        // Loader.Ready(4);
        Loader.Ready(6);
    }

    async Update ()
    {
        if (this.#inited) return;

        this.#inited = true;

        await Party.Load();

        const transfer = new MapTransfer();
        // transfer.pos = new Vector2(2, -3);
        transfer.pos = new Vector2(11, 11);
        MapTransfer.last = transfer;

        const renderer = Player.instance.GetComponent(SpriteRenderer);
        
        Loader.onSwitchStart.Add(() => renderer.color.a = 0);
        Loader.onSwitchEnd.Add(() => renderer.color.a = 1);

        const switchingCall = () => {
            Loader.onSwitching.Remove(switchingCall);
            Transitioner.instance.SetFadeIn();
        };
        Loader.onSwitching.Add(switchingCall);

        const switchCall = () => {
            Loader.onSwitchEnd.Remove(switchCall);
            Transitioner.instance.FadeIn(() => Player.instance.avoidInputs = false);
            AudioManager.instance.PlayBGM("forest", 0.2);
        };
        Loader.onSwitchEnd.Add(switchCall);

        // Loader.Switch(4);
        Loader.Switch(6);

        // 22
    }
}