class TitleScreen extends GameBehavior
{
    #started = false;
    #enabled = false;
    #enableTime = 0;
    #disableTime = 0;
    #selectorOpacity = 1;
    #selectorOpacityDir = -1;
    #selectorStartPos = 0;
    #selectionIndex = 0;
    #onDisable = () => { };

    #box = null;
    #boxContent = null;
    #selector = null;
    #selectorSprite = null;
    #options = null;

    Start ()
    {
        this.#box = GameObject.Find("choicebox");
        this.#box.transform.scale = new Vector2(1, 0);

        this.#boxContent = GameObject.Find("choicebox_content");

        this.#selector = GameObject.Find("selector");
        this.#selectorSprite = this.#selector.GetComponent("SpriteRenderer");
        this.#selectorStartPos = this.#selector.transform.position.y;

        this.#boxContent.SetActive(false);

        this.#options = GameObject.Find("options").GetComponent("Options");

        Transitioner.instance.onFadeIn.Add(() => {
            this.#started = true;

            AudioManager.instance.PlayBGM("title");
        });
        Transitioner.instance.FadeIn();

        this.Enable();
    }

    Enable ()
    {
        this.#enableTime = 0.125;
    }

    #Disable (callback)
    {
        this.#boxContent.SetActive(false);

        this.#disableTime = 0.125;

        if (callback != null) this.#onDisable = callback;
    }

    Update ()
    {
        if (!this.#started) return;

        if (this.#enableTime > 0)
        {
            this.#enableTime -= Time.deltaTime;

            this.#box.transform.scale = new Vector2(1, Math.min((0.125 - this.#enableTime) / 0.125, 1));

            if (this.#enableTime <= 0)
            {
                this.#enabled = true;

                this.#boxContent.SetActive(true);

                return;
            }
        }

        if (this.#disableTime > 0)
        {
            this.#disableTime -= Time.deltaTime;

            this.#box.transform.scale = new Vector2(1, Math.max(this.#disableTime / 0.125, 0));

            if (this.#disableTime <= 0)
            {
                this.#enabled = false;

                this.#onDisable();
                this.#onDisable = () => { };
            }

            return;
        }

        if (!this.#enabled) return;

        this.#selectorOpacity = Math.Clamp(this.#selectorOpacity + Time.deltaTime * 1.75 * this.#selectorOpacityDir, 0.5, 1);

        if (this.#selectorOpacity === 0.5) this.#selectorOpacityDir = 1;
        else if (this.#selectorOpacity === 1) this.#selectorOpacityDir = -1;

        this.#selectorSprite.color.a = this.#selectorOpacity;

        let updateChoice = false;

        if (InputManager.IsRepeated("down"))
        {
            this.#selectionIndex++;

            if (this.#selectionIndex === 2) InputManager.Clear();
            if (this.#selectionIndex > 2) this.#selectionIndex = 0;
            
            updateChoice = true;
        }
        else if (InputManager.IsRepeated("up"))
        {
            this.#selectionIndex--;

            if (this.#selectionIndex === 0) InputManager.Clear();
            if (this.#selectionIndex < 0) this.#selectionIndex = 2;
            
            updateChoice = true;
        }

        if (InputManager.GetKeyDown("z"))
        {
            AudioManager.instance.PlayConfirm();

            switch (this.#selectionIndex)
            {
                case 0:
                    this.#Disable(() => {
                        AudioManager.instance.bgm.Stop();

                        Transitioner.instance.onFadeOut.Add(async () => {
                            await SceneManager.Load(1);
                            SceneManager.SetActiveScene(1);
                        });
                        Transitioner.instance.FadeOut(1);
                    });
                    break;
                case 1:
                    this.#Disable(() => {
                        
                    });
                    break;
                case 2:
                    this.#Disable(() => {
                        this.#options.Enable();
                    });
                    break;
            }
        }

        if (updateChoice)
        {
            this.#selector.transform.position = new Vector2(
                this.#selector.transform.position.x,
                this.#selectorStartPos - this.#selectorSprite.bounds.size.y * this.#selectionIndex
            );

            AudioManager.instance.PlaySelect();
        }
    }
}