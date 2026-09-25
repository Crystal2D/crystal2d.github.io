class Init extends GameBehavior
{
    #loadingSpr = null;

    Awake ()
    {
        GameWindow.Center();

        FPSMeter.detailed = true;
        FPSMeter.enabled = true;
        Cursor.visible = false;

        Crispixels.effect = true;

        const preloadedRes = [
            "sprites/loading",
            "audio/bgm/title",
            
            "font_main",
            "sprites/pixel",
            "sprites/box",
            "sprites/arrows",
            [
                "anims/dialogue_arrow",
                "anims/dialogue_arrow_ctrl"
            ],
            [
                "sprites/chars/yoki",
                "spritelibs/chars/yoki"
            ],

            "audio/se/select",
            "audio/se/confirm",
            "audio/se/no",

            "ctrls/bounds",
            "ctrls/dpad",
            "ctrls/dpad/up",
            "ctrls/dpad/down",
            "ctrls/dpad/left",
            "ctrls/dpad/right",
            "ctrls/z",
            "ctrls/z1",
            "ctrls/x",
            "ctrls/x1",
            "ctrls/shift",
            "ctrls/shift1"
        ];

        Resources.DontDestroyOnLoad(...preloadedRes.flat(1));
        Resources.Load(...preloadedRes);

        Loader.ReadyLoader();
        Loader.Ready(2);

        (async () => {
            await RPGSave.Init();
            await Options.Load();
            await LocaleManager.Set("en_US");

            Loader.Switch(2);
        })();
        
        this.#loadingSpr = this.GetComponent(SpriteRenderer);
        this.#loadingSpr.color.a = 0;
    }

    Update ()
    {
        if (Loader.time >= 0.3333) this.#loadingSpr.color.a = Math.min((Loader.time - 0.3333) * 2, 1);
        Loader.time += Time.deltaTime;
    }
}