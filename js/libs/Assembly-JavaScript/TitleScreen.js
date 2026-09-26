class TitleScreen extends ChoiceBox
{
    Awake ()
    {
        Loader.Ready(3);
        Loader.onSwitchStart.Add(() => Transitioner.instance.Clear());
    }

    Start ()
    {
        super.Start();

        this.AddChoice(LocaleManager.Find("title_start"), () => this.Close(() => {
            AudioManager.instance.FadeOutBGM(1);
            Transitioner.instance.FadeOut(() => Loader.Switch(3));
        }));
        this.AddChoice(LocaleManager.Find("title_continue"), () => this.Close(async () => {
            await EventSystem.Timer(7);
            SaveScreen.Show(1);
        }));

        const options = GameObject.Find("options").GetComponent(Options);
        this.AddChoice(LocaleManager.Find("title_options"), () => this.Close(() => options.Open()));

        if (Application.isInElectron || Application.isInCordova || window.opener != null)
        {
            this.transform.localPosition = new Vector2(this.transform.localPosition.x, 1.64);

            this.AddChoice(LocaleManager.Find("title_quit"), () => {
                AudioManager.instance.FadeOutBGM(1);
                Transitioner.instance.FadeOut(() => Application.Quit());
            });
        }

        this.padding = new Vector2(0.375, 0);

        const hasSave = RPGSave.global.find(item => item != null) != null;
        this.SetActive(1, hasSave);

        Transitioner.instance.FadeIn(() => {
            this.Open();
            if (hasSave) this.selected = 1;

            AudioManager.instance.PlayBGM("title", 0.3);
        });
    }
}