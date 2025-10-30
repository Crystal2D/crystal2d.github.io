class TitleScreen extends GameBehavior
{
    #box = null;
    #options = null;

    Awake ()
    {
        Crispixels.effect = true;
        Cursor.visible = false;
    }

    Start ()
    {
        this.#box = GameObject.Find("choicebox").GetComponent("ItsABox");
        this.#box.AddChoice("   Start", () => this.#box.Close(() => {
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
        this.#box.AddChoice("Continue", () => { });
        this.#box.AddChoice(" Options", () => this.#box.Close(() => this.#options.Enable()));
        this.#box.padding = new Vector2(0.375, 0);

        // this.#options = GameObject.Find("options").GetComponent("Options");

        Loader.Ready(3);

        Transitioner.instance.FadeIn(() => {
            this.#box.Open();

            // AudioManager.instance.PlayBGM("title");
        });
    }
}