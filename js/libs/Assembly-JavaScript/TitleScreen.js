class TitleScreen extends ChoiceBox
{
    Awake ()
    {
        Loader.onSwitchStart.Add(() => Transitioner.instance.Clear());
    }

    Start ()
    {
        super.Start();

        this.AddChoice(LocaleManager.Find("title_start"), () => this.Close(() => {
            AudioManager.instance.FadeOutBGM(1);

            Transitioner.instance.FadeOut(() => Loader.Switch(3));
        }));
        this.AddChoice(LocaleManager.Find("title_continue"), () => { });

        const options = GameObject.Find("options").GetComponent(Options);

        this.AddChoice(LocaleManager.Find("title_options"), () => this.Close(() => options.Open()));
        this.padding = new Vector2(0.375, 0);

        Loader.Ready(3);

        Transitioner.instance.FadeIn(() => {
            this.Open();
            AudioManager.instance.PlayBGM("title", 0.3);
        });
    }
}