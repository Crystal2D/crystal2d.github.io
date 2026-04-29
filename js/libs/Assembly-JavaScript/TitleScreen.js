class TitleScreen extends ChoiceBox
{
    Awake ()
    {
        Resources.DontDestroyOnLoad(
            "font_main",
            "sprites/pixel",
            "sprites/box",
            "sprites/arrows",
            "anims/dialogue_arrow",
            "anims/dialogue_arrow_ctrl",
            "sprites/chars/yoki",
            "spritelibs/chars/yoki"
        );

        Loader.Ready(3);
        // Loader.Ready(24);
        Loader.onSwitchStart.Add(() => Transitioner.instance.Clear());
    }

    Start ()
    {
        super.Start();

        Loader.Switch(3);
        // Loader.Switch(24);
        return;

        this.AddChoice(LocaleManager.Find("title_start"), () => this.Close(() => {
            AudioManager.instance.FadeOutBGM(1);

            Transitioner.instance.FadeOut(() => Loader.Switch(3));
        }));
        this.AddChoice(LocaleManager.Find("title_continue"), () => { });

        const options = GameObject.Find("options").GetComponent(Options);

        this.AddChoice(LocaleManager.Find("title_options"), () => this.Close(() => options.Open()));
        this.padding = new Vector2(0.375, 0);

        Transitioner.instance.FadeIn(() => {
            this.Open();
            AudioManager.instance.PlayBGM("title", 0.3);
        });
    }
}