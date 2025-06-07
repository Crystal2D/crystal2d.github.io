class Options extends GameBehavior
{
    static run = false;
    static textSkip = false;
    static resolution = 1;
    static windowSize = 0;
    static fps = 5;

    #enabled = false;
    #enableTime = 0;
    #disableTime = 0;
    #selectorOpacity = 1;
    #selectorOpacityDir = -1;
    #selectorStartPos = 0;
    #selectionIndex = 0;

    #mainStuff = null;
    #content = null;
    #selector = null;
    #selectorSprite = null;
    #dataText = null;
    #leftArrow = null;
    #rightArrow = null;

    Start ()
    {
        this.transform.scale = new Vector2(1, 0);

        this.#mainStuff = GameObject.Find("camera").GetComponent("TitleScreen");

        this.#content = GameObject.Find("options_content");

        this.#selector = GameObject.Find("options_selector");
        this.#selectorSprite = this.#selector.GetComponent("SpriteRenderer");
        this.#selectorStartPos = this.#selector.transform.position.y;

        this.#dataText = GameObject.Find("options_data").GetComponent("Text");

        this.#leftArrow = GameObject.Find("options_leftarrow");
        this.#rightArrow = GameObject.Find("options_rightarrow");

        this.#content.SetActive(false);

        this.#UpdateDataText();
    }

    Update ()
    {
        if (this.#enableTime > 0)
        {
            this.#enableTime -= Time.deltaTime;

            this.transform.scale = new Vector2(1, Math.min((0.125 - this.#enableTime) / 0.125, 1));

            if (this.#enableTime <= 0)
            {
                this.#enabled = true;

                this.#content.SetActive(true);

                return;
            }
        }

        if (this.#disableTime > 0)
        {
            this.#disableTime -= Time.deltaTime;

            this.transform.scale = new Vector2(1, Math.max(this.#disableTime / 0.125, 0));

            if (this.#disableTime <= 0)
            {
                this.#enabled = false;

                this.#selectionIndex = 0;
                this.#selector.transform.position = new Vector2(this.#selector.transform.position.x, this.#selectorStartPos);

                this.#UpdateArrows();

                this.#mainStuff.Enable();
            }

            return;
        }

        if (!this.#enabled) return;

        if (InputManager.GetKeyDown("x")) this.#Disable();

        this.#selectorOpacity = Math.Clamp(this.#selectorOpacity + Time.deltaTime * 1.75 * this.#selectorOpacityDir, 0.5, 1);

        if (this.#selectorOpacity === 0.5) this.#selectorOpacityDir = 1;
        else if (this.#selectorOpacity === 1) this.#selectorOpacityDir = -1;

        this.#selectorSprite.color.a = this.#selectorOpacity;

        let updateChoice = false;

        if (InputManager.GetKeyDown("down"))
        {
            this.#selectionIndex++;
            
            if (this.#selectionIndex > 8) this.#selectionIndex = 0;
            
            updateChoice = true;
        }
        if (InputManager.GetKeyDown("up"))
        {
            this.#selectionIndex--;

            if (this.#selectionIndex < 0) this.#selectionIndex = 8;
            
            updateChoice = true;
        }

        switch (this.#selectionIndex)
        {
            case 0:
                this.#SetMove();
                break;
            case 1:
                this.#SetTextSkip();
                break;
            case 2:
                this.#SetFullscreen();
                break;
            case 3:
                this.#SetRes();
                break;
            case 4:
                this.#SetWinSize();
                break;
            case 5:
                this.#SetFPS();
                break;
            case 6:
                this.#SetCrisp();
                break;
            case 7:
                this.#SetMusic();
                break;
            case 8:
                this.#SetEffects();
                break;
        }

        if (updateChoice)
        {
            let pos = this.#selectionIndex;

            if (this.#selectionIndex >= 2) pos += 2;
            if (this.#selectionIndex >= 7) pos += 2;

            this.#selector.transform.position = new Vector2(
                this.#selector.transform.position.x,
                this.#selectorStartPos - this.#selectorSprite.bounds.size.y * pos
            );

            AudioManager.instance.PlaySelect();
            this.#UpdateArrows();
        }
    }

    Enable ()
    {
        this.#enableTime = 0.125;
    }

    #Disable ()
    {
        this.#content.SetActive(false);

        this.#disableTime = 0.125;

        AudioManager.instance.PlayNo();
    }

    #UpdateArrows ()
    {
        let pos = new Vector2(1.38, 2.61);

        if (this.#selectionIndex === 0) pos = new Vector2(
            Options.run ? 1.32 : 1.2,
            Options.run ? 2.68 : 2.8
        );
        else if ((this.#selectionIndex === 1 && Options.textSkip) || (this.#selectionIndex === 2 && Window.fullscreen) || (this.#selectionIndex === 6 && Crispixels.effect)) pos = new Vector2(1.5, 2.52);
        else if (this.#selectionIndex === 3)
        {
            switch (Options.resolution)
            {
                case 2:
                case 3:
                    pos = new Vector2(0.2, 3.8);
                    break;
                case 4:
                    pos = new Vector2(0, 4);
                    break;
                default:
                    pos = new Vector2(0.5, 3.5);
                    break;
            }
        }
        else if (this.#selectionIndex === 4)
        {
            switch (Options.windowSize)
            {
                case 2:
                case 3:
                    pos = new Vector2(0.2, 3.8);
                    break;
                case 4:
                    pos = new Vector2(0.6, 3.4);
                    break;
                default:
                    pos = new Vector2(0.5, 3.5);
                    break;
            }
        }
        else if (this.#selectionIndex === 5)
        {
            switch (Options.fps)
            {
                case 3:
                    pos = new Vector2(1.3, 2.7);
                    break;
                case 4:
                    pos = new Vector2(0.6, 3.4);
                    break;
                case 5:
                    pos = new Vector2(0.5, 5.1);
                    break;
                default:
                    pos = new Vector2(1.5, 2.5);
                    break;
            }

            if (Options.fps === 0) pos.x = 5.1;
        }
        else if ((this.#selectionIndex === 7 && AudioManager.bgmVolume === 0) || (this.#selectionIndex === 8 && AudioManager.seVolume === 0)) pos = new Vector2(5.1, 2.34);
        else if ((this.#selectionIndex === 7 && AudioManager.bgmVolume === 100) || (this.#selectionIndex === 8 && AudioManager.seVolume === 100)) pos.y = 5.1;
        else if (this.#selectionIndex === 7 || this.#selectionIndex === 8) pos = new Vector2(1.5, 2.52);

        this.#leftArrow.transform.localPosition = new Vector2(pos.x, 0);
        this.#rightArrow.transform.localPosition = new Vector2(pos.y, 0);
    }

    #UpdateDataText ()
    {
        const toggle = state => state ? "On" : "Off";

        const resSize = Options.resolution + 1;
        const res = resSize > 4 ? `Match ${Window.fullscreen ? "Screen" : "Window"}` : `${480 * resSize} x ${432 * resSize}`;

        const winSize = Options.windowSize + 1;
        const win = winSize > 4 ? "Whatever" : `${480 * winSize} x ${432 * winSize}`;

        let fps = Application.vSyncCount > 0 ? "V-Synced" : Application.targetFrameRate;
        if (fps < 0) fps = "Unlimited";

        this.#dataText.text = `${Options.run ? "Run" : "Walk"}\n${toggle(Options.textSkip)}\n\n\n${toggle(Window.fullscreen)}\n${res}\n${win}\n${fps}\n${toggle(Crispixels.effect)}\n\n\n${AudioManager.bgmVolume}\n${AudioManager.seVolume}`;

        this.#UpdateArrows();
    }

    #SetMove ()
    {
        if (!InputManager.GetKeyDown("left") && !InputManager.GetKeyDown("right") && !InputManager.GetKeyDown("z")) return;

        Options.run = !Options.run;

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }

    #SetTextSkip ()
    {
        if (!InputManager.GetKeyDown("left") && !InputManager.GetKeyDown("right") && !InputManager.GetKeyDown("z")) return;

        Options.textSkip = !Options.textSkip;

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }

    #SetFullscreen ()
    {
        if (!InputManager.GetKeyDown("left") && !InputManager.GetKeyDown("right") && !InputManager.GetKeyDown("z")) return;

        Window.fullscreen = !Window.fullscreen;

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }

    #SetRes ()
    {
        let updateRes = false;

        if (InputManager.GetKeyDown("right") || InputManager.GetKeyDown("z"))
        {
            Options.resolution++;
            if (Options.resolution > 4) Options.resolution = 1;

            updateRes = true;
        }
        if (InputManager.GetKeyDown("left"))
        {
            Options.resolution--;
            if (Options.resolution < 1) Options.resolution = 4;

            updateRes = true;
        }

        if (!updateRes) return;

        if (Options.resolution < 4)
        {
            const size = Options.resolution + 1;

            Window.SetResolution(480 * size, 432 * size);
        }

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }

    #SetWinSize ()
    {
        let updateSize = false;

        if (InputManager.GetKeyDown("right") || InputManager.GetKeyDown("z"))
        {
            Options.windowSize++;
            if (Options.windowSize > 4) Options.windowSize = 0;

            updateSize = true;
        }
        if (InputManager.GetKeyDown("left"))
        {
            Options.windowSize--;
            if (Options.windowSize < 0) Options.windowSize = 4;

            updateSize = true;
        }

        if (!updateSize) return;

        let size = Options.windowSize + 1;

        if (size !== 5 && (480 * size > window.screen.width || 432 * size > window.screen.height))
        {
            if (InputManager.GetKeyDown("left"))
            {
                Options.windowSize = 0;
                size = 1;
            }
            else
            {
                Options.windowSize = 4;
                size = 5;
            }
        }

        if (size < 5)
        {
            Window.resizable = false;
            Window.SetWindowSize(480 * size, 432 * size);
        }
        else Window.resizable = true;

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }

    #SetFPS ()
    {
        let updateFps = false;

        if (Options.fps < 5 && (InputManager.GetKeyDown("right") || InputManager.GetKeyDown("z")))
        {
            Options.fps++;

            updateFps = true;
        }
        if (Options.fps > 0 && InputManager.GetKeyDown("left"))
        {
            Options.fps--;

            updateFps = true;
        }

        if (!updateFps) return;

        const fpsSet = [
            30,
            60,
            90,
            120,
            -1
        ];

        if (Options.fps > 4)
        {
            Application.vSyncCount = 1;
        }
        else
        {
            Application.vSyncCount = 0;
            Application.targetFrameRate = fpsSet[Options.fps];
        }

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }

    #SetCrisp ()
    {
        if (!InputManager.GetKeyDown("left") && !InputManager.GetKeyDown("right") && !InputManager.GetKeyDown("z")) return;

        Crispixels.effect = !Crispixels.effect;

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }

    #SetMusic ()
    {
        const dir = +(InputManager.GetKeyDown("right") || InputManager.GetKeyDown("z")) - +InputManager.GetKeyDown("left");

        if (dir === 0 || dir < 0 && AudioManager.bgmVolume === 0 || dir > 0 && AudioManager.bgmVolume === 100) return;

        AudioManager.bgmVolume = Math.Clamp(AudioManager.bgmVolume + 20 * dir, 0, 100);

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }

    #SetEffects ()
    {
        const dir = +(InputManager.GetKeyDown("right") || InputManager.GetKeyDown("z")) - +InputManager.GetKeyDown("left");

        if (dir === 0 || dir < 0 && AudioManager.seVolume === 0 || dir > 0 && AudioManager.seVolume === 100) return;

        AudioManager.seVolume = Math.Clamp(AudioManager.seVolume + 20 * dir, 0, 100);

        this.#UpdateDataText();
        AudioManager.instance.PlaySelect();
    }
}