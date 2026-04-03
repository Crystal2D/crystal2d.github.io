class MapInit extends GameBehavior
{
    #inited = false;

    Awake ()
    {
        Resources.DontDestroyOnLoad(
            "anims/entity",
            "anims/entity_ctrl",
            "anims/entity_jump"
        );

        Loader.Ready(5);
        // Loader.Ready(10);
    }

    Update ()
    {
        if (this.#inited) return;

        this.#inited = true;

        const transfer = new MapTransfer();
        // transfer.pos = new Vector2(17, -26);
        transfer.pos = new Vector2(-3, 18);
        MapTransfer.last = transfer;

        const renderer = Player.instance.GetComponent(SpriteRenderer);
        
        Loader.onSwitchStart.Add(() => renderer.color.a = 0);
        Loader.onSwitchEnd.Add(() => renderer.color.a = 1);

        const switchCallA = () => {
            Loader.onSwitchEnd.Remove(switchCallA);

            const switchCallB = () => {
                Loader.onSwitchEnd.Remove(switchCallB);
                Transitioner.instance.FadeIn(() => Player.instance.avoidInputs = false);
                AudioManager.instance.PlayBGM("forest", 0.2);
            };
            Loader.onSwitchEnd.Add(switchCallB);
        };
        Loader.onSwitchEnd.Add(switchCallA);

        Loader.Switch(5);
        // Loader.Switch(10);

        // 22
    }
}