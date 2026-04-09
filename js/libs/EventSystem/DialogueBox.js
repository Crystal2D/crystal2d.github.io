class DialogueBox extends ItsABox
{
    #startedTyping = false;
    #typing = false;
    #shouldUnpause = false;
    #canUnpause = false;
    #showFace = false;
    #skipPause = false;
    #showFast = false;
    #speed = 1 / 60;
    #playIndex = 0;
    #pauseCount = 0;
    #pauseTime = 0;
    #chars = [];
    #se = 1;
    #ses = [
        {
            name: "dialogue_3",
            pitch: 0.9
        },
        {
            name: "dialogue_3",
            pitch: 1.1
        },
        {
            name: "dialogue_1",
            pitch: 0.8
        },
        {
            name: "dialogue_3",
            pitch: 1.25
        },
        {
            name: "dialogue_1",
            pitch: 1.2
        },
        {
            name: "dialogue_4",
            pitch: 1.4
        },
        {
            name: "dialogue_4",
            pitch: 0.6
        },
        {
            name: "dialogue_1",
            pitch: 1.1
        },
        {
            name: "dialogue_1",
            pitch: 1
        },
        {
            name: "dialogue_3",
            pitch: 1.15
        },
        {
            name: "dialogue_4",
            pitch: 1.6
        },
        {
            name: "dialogue_4",
            pitch: 0.7
        },
        {
            name: "dialogue_3",
            pitch: 1
        },
        {
            name: "dialogue_4",
            pitch: 1.6
        },
        {
            name: "dialogue_3",
            pitch: 1.25
        }
    ];

    #face = null;
    #text = null;
    #arrow = null;

    async Start ()
    {
        super.Start();

        Crispixels.effect = true;
        this.#text = this.GetComponentInChildren(Text);
        this.#face = this.transform.Find("face").GetComponent(SpriteRenderer);
        this.#arrow = this.transform.Find("arrow").GetComponent(SpriteRenderer);

        EventSystem.dialogueBox = this;
        EventSystem.dialogueChoiceBox = GameObject.Find("dialogue_choicebox").GetComponent(ChoiceBox);

        this.DontDestroyOnLoad(this, [
            "font_main",
            "sprites/box",
            "sprites/arrows",
            "sprites/faces/yoki",
            "audio/se/dialogue_1",
            "audio/se/dialogue_2",
            "audio/se/dialogue_3",
            "audio/se/dialogue_4",
            "anims/dialogue_arrow",
            "anims/dialogue_arrow_ctrl"
        ]);
        this.DontDestroyOnLoad(EventSystem.dialogueChoiceBox);
    }

    #UpdateTyping ()
    {
        if (!this.#typing) return;

        let done = true;

        for (let i = 0; i < this.#chars.length; i++)
        {
            if (this.#chars[i].done) continue;

            done = false;

            if (this.#chars[i].playIndex > this.#playIndex) continue;

            this.#chars[i].time -= Time.deltaTime;

            if (!this.#showFast && this.#chars[i].time > 0) continue;

            if (i === 0)
            {
                this.#face.color.a = +this.#showFace;
                this.#showFace = false;
            }

            this.#chars[i].callback();
            this.#chars[i].done = true;
        }

        if (this.#playIndex >= this.#pauseCount && done)
        {
            this.#startedTyping = false;
            this.#typing = false;
        }
    }

    #AllowUnpause ()
    {
        this.#shouldUnpause = true;

        if (this.#skipPause)
        {
            this.Unpause();
            this.#skipPause = false;
        }
    }

    Update ()
    {
        super.Update();

        if (this.#shouldUnpause && this.#pauseTime > 0)
        {
            this.#pauseTime -= Time.deltaTime;
            this.#arrow.color.a = Math.max(0, (1 / 6) - this.#pauseTime) * 6;

            if (this.#pauseTime <= 0) this.#canUnpause = true;
        }

        if (InputManager.IsRepeated("z") || InputManager.IsRepeated("x"))
        {
            if (!this.#shouldUnpause) this.ShowFast();
            else this.Unpause();
        }

        this.#UpdateTyping();
    }

    async Close ()
    {
        if (this.#startedTyping || this.isClosed) return;
        
        super.Close();

        await CrystalEngine.Wait(() => this.isClosed);
    }

    OnClose ()
    {
        this.#face.color.a = 0;
        this.#text.text = "";
    }

    SetFace (char, name)
    {
        if (this.#startedTyping) return;

        const sprite = Resources.Find(`sprites/faces/${char}`).sprites.find(item => item.name === name).Duplicate();

        this.#face.sprite = sprite;
        this.#showFace = true;
    }
    
    async Type (text, noEndWait)
    {
        if (this.#startedTyping) return;

        this.transform.parent = Camera.main?.transform;

        this.#startedTyping = true;
        this.#arrow.color.a = 0;
        this.#pauseTime = 1 / 6;

        this.Open();

        await CrystalEngine.Wait(() => this.isOpen);

        if (!noEndWait) text += "\\!";

        this.#text.text = "";
        this.#chars = [];

        this.#face.transform.localPosition = new Vector2(-3 * 1.325, 0);
        this.#text.transform.position = new Vector2(
            this.#showFace ? (this.#face.bounds.max.x + (0.375 * 0.65)) : (this.spriteRenderer.bounds.min.x + (0.375 * 0.75)),
            this.spriteRenderer.bounds.max.y - (0.5725 * 0.4)
        );

        let escaping = false;
        let showLineFast = false;
        let currentTime = 0;
        let textIndex = 0;
        let se = this.#se;

        for (let i = 0; i < text.length; i++)
        {
            if (text[i] === "\\" && !escaping)
            {
                escaping = true;
                continue;
            }

            const charData = {
                callback: () => { },
                time: showLineFast ? 0 : currentTime,
                done: false,
                playIndex: this.#pauseCount
            };
            this.#chars.push(charData);

            const currentSE = se;
            let typeText = true;

            if (escaping) switch (text[i])
            {
                case ".":
                    currentTime += 0.25;
                    typeText = false;
                    break;
                case "|":
                    currentTime += 1;
                    typeText = false;
                    break;
                case "!":
                    currentTime = 0;
                    this.#pauseCount++;

                    charData.callback = () => this.#AllowUnpause();

                    typeText = false;
                    break;
                case ">":
                    showLineFast = true;

                    charData.callback = () => {
                        if (!this.#showFast) AudioManager.instance.PlaySE(this.#ses[currentSE - 1].name, 1, this.#ses[currentSE - 1].pitch);
                    };

                    typeText = false;
                    break;
                case "<":
                    showLineFast = false;
                    typeText = false;
                    break;
                case "^":
                    this.#skipPause = true;
                    typeText = false;
                    break;
                case "S":
                    const matched = text.substring(i).match(/^SE\[[0-9]+\]/)[0];

                    if (matched != null)
                    {
                        se = parseInt(matched.slice(3, -1));
                        this.#se = se;
                        i += matched.length - 1;
                        typeText = false;
                    }
                    break;
            }

            escaping = false;

            currentTime += this.#speed;

            if (!typeText) continue;

            const index = textIndex;
            const currentI = i;
            const shownFast = showLineFast;

            this.#text.text += text[i];

            charData.callback = () => {
                if (text[currentI] !== "\n")
                {
                    const char = this.#text.characters[index];
                    char.color = new Color(
                        char.color.r,
                        char.color.g,
                        char.color.b,
                        1
                    );
                }
            };

            if (currentSE > 0 && !shownFast && (i !== 0 && i % 4 === 0)) this.#chars.push({
                callback: () => {
                    if (!this.#showFast) AudioManager.instance.PlaySE(this.#ses[currentSE - 1].name, 1, this.#ses[currentSE - 1].pitch);
                },
                time: currentTime - AudioSettings.latency,
                done: false,
                playIndex: this.#pauseCount
            });

            if (text[i] !== "\n")
            {
                textIndex++;
                continue;
            }

            showLineFast = false;
        }

        this.#text.ForceMeshUpdate();

        await CrystalEngine.Wait(() => this.#text.characters.length === textIndex);
        
        this.#showFast = false;
        this.#typing = true;

        await CrystalEngine.Wait(() => !this.#startedTyping);
    }

    Unpause ()
    {
        if (!this.#canUnpause || this.#playIndex >= this.#pauseCount) return;
            
        this.#playIndex++;
        this.#arrow.color.a = 0;
        this.#pauseTime = 1 / 6;
        this.#shouldUnpause = false;
        this.#canUnpause = false;
        this.#showFast = false;
    }

    ShowFast ()
    {
        if (this.#shouldUnpause) return;

        this.#showFast = true;
    }
}