class TitleScreen extends ChoiceBox
{
    Awake ()
    {
        Crispixels.effect = true;
        Cursor.visible = false;
    }

    Start ()
    {
        super.Start();

        this.AddChoice("   Start", () => this.Close(() => {
            AudioManager.instance.StopBGM();

            Transitioner.instance.FadeOut(() => {
                const clearCall = () => {
                    Loader.onSwitchStart.Remove(clearCall);
                    Transitioner.instance.Clear();
                };
                Loader.onSwitchStart.Add(clearCall);

                Loader.Switch(3);
            });
        }));
        this.AddChoice("Continue", () => { });

        const options = GameObject.Find("options").GetComponent("Options");

        this.AddChoice(" Options", () => this.Close(() => options.Open()));
        this.padding = new Vector2(0.375, 0);

        Loader.Ready(3);

        Transitioner.instance.FadeIn(() => {
            this.Open();
            AudioManager.instance.PlayBGM("title");
        });
    }
}