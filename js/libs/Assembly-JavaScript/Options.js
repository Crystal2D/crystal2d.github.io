class Options extends ChoiceBox
{
    static run = false;
    static textSkip = false;
    static resolution = 1;
    static windowSize = 0;
    static fps = 5;

    #arrowCalls = [];

    #mainStuff = null;
    #dataText = null;
    #leftArrow = null;
    #rightArrow = null;

    static async Load ()
    {
        const config = await RPGSave.Load(-1);
        
        if (config != null)
        {
            this.run = config.run;
            GameWindow.fullscreen = config.fullscreen;
            Crispixels.effect = config.crispixels;
            this.textSkip = config.textSkip;


            this.resolution = config.resolution;

            if (this.resolution < 4)
            {
                const size = this.resolution + 1;
                GameWindow.SetResolution(480 * size, 432 * size);
            }


            this.windowSize = config.windowSize;

            if (!Application.isInCordova)
            {
                let size = this.windowSize + 1;

                if (size < 5)
                {
                    GameWindow.resizable = false;
                    GameWindow.SetWindowSize(480 * size, 432 * size);
                    GameWindow.Center();
                }
                else GameWindow.resizable = true;
            }


            this.fps = config.fps;

            const fpsSet = [
                30,
                60,
                90,
                120,
                -1
            ];

            if (this.fps > 4)
            {
                Application.vSyncCount = 1;
            }
            else
            {
                Application.vSyncCount = 0;
                Application.targetFrameRate = fpsSet[this.fps];
            }


            AudioManager.bgmVolume = config.bgmVolume;
            AudioManager.seVolume = config.seVolume;
        }
    }

    static async Save ()
    {
        await RPGSave.Save(-1, {
            run: this.run,
            fullscreen: GameWindow.fullscreen,
            crispixels: Crispixels.effect,
            textSkip: this.textSkip,
            resolution: this.resolution,
            windowSize: this.windowSize,
            fps: this.fps,
            bgmVolume: AudioManager.bgmVolume,
            seVolume: AudioManager.seVolume
        });
    }

    async Start ()
    {
        this.#mainStuff = GameObject.Find("titlescreen").GetComponent(TitleScreen);

        this.#dataText = GameObject.Find("options_data").GetComponent(Text);
        this.#leftArrow = GameObject.Find("options_leftarrow");
        this.#rightArrow = GameObject.Find("options_rightarrow");

        this.#dataText.gameObject.SetActive(false);
        this.#leftArrow.SetActive(false);
        this.#rightArrow.SetActive(false);

        this.AddText(LocaleManager.Find("options_gen"));
        this.AddChoice(LocaleManager.Find("options_gen_move"), () => {
            Options.run = !Options.run;
            this.#UpdateDataText();
        }, 1);
        this.AddChoice(LocaleManager.Find("options_gen_txtskip"), () => {
            Options.textSkip = !Options.textSkip;
            this.#UpdateDataText();
        }, 1);
        this.AddText("");

        this.AddText(LocaleManager.Find("options_graphics"));

        this.#arrowCalls.push(
            null,
            () => new Vector2(
                Options.run ? LocaleManager.Find("options_gen_move_run_aleft") : LocaleManager.Find("options_gen_move_walk_aleft"),
                Options.run ? LocaleManager.Find("options_gen_move_run_aright") : LocaleManager.Find("options_gen_move_walk_aright")
            ),
            () => Options.textSkip ? new Vector2(
                LocaleManager.Find("options_on_aleft"),
                LocaleManager.Find("options_on_aright")
            ) : new Vector2(
                LocaleManager.Find("options_off_aleft"),
                LocaleManager.Find("options_off_aright")
            ),
            null,
            null
        );

        if (!Application.isInCordova)
        {
            this.AddChoice(LocaleManager.Find("options_graphics_fullscreen"), () => {
                GameWindow.fullscreen = !GameWindow.fullscreen;
                this.#UpdateDataText();
            }, 1);
            this.AddChoice(LocaleManager.Find("options_graphics_winsize"), dir => {
                Options.windowSize += dir;

                if (Options.windowSize > 4) Options.windowSize = 0;
                if (Options.windowSize < 0) Options.windowSize = 4;

                let size = Options.windowSize + 1;

                if (size !== 5 && (480 * size > window.screen.width || 432 * size > window.screen.height))
                {
                    if (dir < 0)
                    {
                        while (480 * size > window.screen.width || 432 * size > window.screen.height)
                        {
                            Options.windowSize--;
                            size--;
                        }
                    }
                    else
                    {
                        Options.windowSize = 4;
                        size = 5;
                    }
                }

                if (size < 5)
                {
                    GameWindow.resizable = false;
                    GameWindow.SetWindowSize(480 * size, 432 * size);
                    GameWindow.Center();
                }
                else GameWindow.resizable = true;

                this.#UpdateDataText();
            }, 2);

            this.#arrowCalls.push(
                () => GameWindow.fullscreen ? new Vector2(
                    LocaleManager.Find("options_on_aleft"),
                    LocaleManager.Find("options_on_aright")
                ) : new Vector2(
                    LocaleManager.Find("options_off_aleft"),
                    LocaleManager.Find("options_off_aright")
                ),
                () => {
                    switch (Options.windowSize)
                    {
                        case 2:
                        case 3:
                            return new Vector2(0.325, 3.9);
                        case 4:
                            return new Vector2(
                                LocaleManager.Find("options_graphics_winsize_any_aleft"),
                                LocaleManager.Find("options_graphics_winsize_any_aright")
                            );
                    }

                    return new Vector2(0.625, 3.625);
                }
            );
        }

        this.AddChoice(LocaleManager.Find("options_graphics_res"), dir => {
            Options.resolution += dir;

            if (Options.resolution > 4) Options.resolution = 1;
            else if (Options.resolution < 1) Options.resolution = 4;

            if (Options.resolution < 4)
            {
                const size = Options.resolution + 1;
                GameWindow.SetResolution(480 * size, 432 * size);
            }

            this.#UpdateDataText();
        }, 2);
        this.AddChoice(LocaleManager.Find("options_graphics_fps"), dir => {
            let updateFps = false;

            if (Options.fps < 5 && dir > 0)
            {
                Options.fps++;

                updateFps = true;
            }
            else if (Options.fps > 0 && dir < 0)
            {
                Options.fps--;

                updateFps = true;
            }

            if (!updateFps) return false;

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
        }, 2);
        this.AddChoice(LocaleManager.Find("options_graphics_crispixels"), () => {
            Crispixels.effect = !Crispixels.effect;
            this.#UpdateDataText();
        }, 1);
        this.AddText("");

        this.AddText(LocaleManager.Find("options_audio"));
        this.AddChoice(LocaleManager.Find("options_audio_bgm"), dir => {
            if (dir === 0 || dir < 0 && AudioManager.bgmVolume === 0 || dir > 0 && AudioManager.bgmVolume === 100) return false;
        
            AudioManager.bgmVolume = Math.Clamp(AudioManager.bgmVolume + 20 * dir, 0, 100);
            this.#UpdateDataText();
        }, 2);
        this.AddChoice(LocaleManager.Find("options_audio_se"), dir => {
            if (dir === 0 || dir < 0 && AudioManager.seVolume === 0 || dir > 0 && AudioManager.seVolume === 100) return false;

            AudioManager.seVolume = Math.Clamp(AudioManager.seVolume + 20 * dir, 0, 100);
            this.#UpdateDataText();
        }, 2);

        this.#arrowCalls.push(
            () => {
                switch (Options.resolution)
                {
                    case 2:
                    case 3:
                        return new Vector2(0.32, 3.9);
                    case 4:
                        return new Vector2(
                            LocaleManager.Find("options_graphics_res_match_aleft"),
                            LocaleManager.Find("options_graphics_res_match_aright")
                        );
                }

                return new Vector2(0.625, 3.625);
            },
            () => {
                let pos = null;

                switch (Options.fps)
                {
                    case 3:
                        pos = new Vector2(1.425, 2.825);
                        break;
                    case 4:
                        pos = new Vector2(
                            LocaleManager.Find("options_graphics_fps_unli_aleft"),
                            LocaleManager.Find("options_graphics_fps_unli_aright")
                        );
                        break;
                    case 5:
                        pos = new Vector2(
                            LocaleManager.Find("options_graphics_fps_vsync_aleft"),
                            5.1
                        );
                        break;
                    default:
                        pos = new Vector2(1.625, 2.625);
                        break;
                }

                if (Options.fps === 0) pos.x = 5.1;

                return pos;
            },
            () => Crispixels.effect ? new Vector2(
                LocaleManager.Find("options_on_aleft"),
                LocaleManager.Find("options_on_aright")
            ) : new Vector2(
                LocaleManager.Find("options_off_aleft"),
                LocaleManager.Find("options_off_aright")
            ),
            null,
            null,
            () => {
                let pos = new Vector2(1.505, 2.75);

                if (AudioManager.bgmVolume === 0) pos = new Vector2(5.225, 2.465);
                else if (AudioManager.bgmVolume === 100) pos.y = 5.225;
                else pos = new Vector2(1.625, 2.645);

                return pos;
            },
            () => {
                let pos = new Vector2(1.505, 2.75);

                if (AudioManager.seVolume === 0) pos = new Vector2(5.225, 2.465);
                else if (AudioManager.seVolume === 100) pos.y = 5.225;
                else pos = new Vector2(1.625, 2.645);

                return pos;
            }
        );

        this.padding = new Vector2(4.75, 0);

        await super.Start();

        this._text.transform.position = new Vector2(-0.1875, 0);
        this.#leftArrow.transform.parent = this._selector.transform;
        this.#rightArrow.transform.parent = this._selector.transform;

        this.#UpdateDataText();
    }

    _UpdateDimensions ()
    {
        super._UpdateDimensions();

        this.#dataText.height = this._text.height;
    }

    OnOpen ()
    {
        super.OnOpen();

        this.#dataText.gameObject.SetActive(true);
        this.#leftArrow.SetActive(true);
        this.#rightArrow.SetActive(true);
    }

    OnClose ()
    {
        super.OnClose();

        this.#dataText.gameObject.SetActive(false);
        this.#leftArrow.SetActive(false);
        this.#rightArrow.SetActive(false);
    }

    #UpdateArrows ()
    {
        const pos = this.#arrowCalls[this.selected]();

        this.#leftArrow.transform.localPosition = new Vector2(pos.x, 0);
        this.#rightArrow.transform.localPosition = new Vector2(pos.y, 0);
    }

    #UpdateDataText ()
    {
        const toggle = state => state ? LocaleManager.Find("options_on") : LocaleManager.Find("options_off");

        const resSize = Options.resolution + 1;
        const res = resSize > 4 ? `${LocaleManager.Find("options_graphics_res_match")} ${GameWindow.fullscreen ? LocaleManager.Find("options_graphics_res_screen") : LocaleManager.Find("options_graphics_res_window")}` : `${480 * resSize} x ${432 * resSize}`;

        const winSize = Options.windowSize + 1;
        const win = winSize > 4 ? LocaleManager.Find("options_graphics_winsize_any") : `${480 * winSize} x ${432 * winSize}`;

        let fps = Application.vSyncCount > 0 ? LocaleManager.Find("options_graphics_fps_vsync") : Application.targetFrameRate;
        if (fps < 0) fps = LocaleManager.Find("options_graphics_fps_unli");

        if (Application.isInCordova) this.#dataText.text = `\n${Options.run ? LocaleManager.Find("options_gen_move_run") : LocaleManager.Find("options_gen_move_walk")}\n${toggle(Options.textSkip)}\n\n\n${res}\n${fps}\n${toggle(Crispixels.effect)}\n\n\n${AudioManager.bgmVolume}\n${AudioManager.seVolume}`;
        else this.#dataText.text = `\n${Options.run ? LocaleManager.Find("options_gen_move_run") : LocaleManager.Find("options_gen_move_walk")}\n${toggle(Options.textSkip)}\n\n\n${toggle(GameWindow.fullscreen)}\n${win}\n${res}\n${fps}\n${toggle(Crispixels.effect)}\n\n\n${AudioManager.bgmVolume}\n${AudioManager.seVolume}`;

        this.#UpdateArrows();
    }

    _OnSelect ()
    {
        this.#UpdateArrows();
    }

    Update ()
    {
        super.Update();

        if (Input.GetKeyDown(KeyCode.F4)) this.#UpdateDataText();

        if (!this.isClosed && InputManager.IsTriggered("cancel"))
        {
            AudioManager.instance.PlayNo();

            Options.Save();

            this.Close();
            this.#mainStuff.Open();
        }
    }
}