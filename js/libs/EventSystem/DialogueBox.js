class DialogueBox extends ItsABox
{
    #startedTyping = false;
    #typing = false;
    #canUnpause = false;
    #showFace = false;
    #skipPause = false;
    #speed = 1 / 60;
    #playIndex = 0;
    #pauseCount = 0;
    #chars = [];

    #face = null;
    #text = null;
    #arrow = null;

    async Start ()
    {
        super.Start();

        Crispixels.effect = true;
        this.#text = this.GetComponentInChildren("Text");
        this.#face = this.transform.Find("face").GetComponent("SpriteRenderer");
        this.#arrow = this.transform.Find("arrow").GetComponent("SpriteRenderer");

        EventSystem.dialogueBox = this;

        this.DontDestroyOnLoad(this, [
            "font_main",
            "sprites/box",
            "sprites/arrows",
            "sprites/faces/yoki",
            "audio/se/dialogue_3"
        ]);
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

            if (this.#chars[i].time > 0) continue;

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
        this.#canUnpause = true;
        this.#arrow.color.a = 1;

        if (this.#skipPause)
        {
            this.Unpause();
            this.#skipPause = false;
        }
    }

    Update ()
    {
        super.Update();
        this.#UpdateTyping();
    }

    Close ()
    {
        if (!this.#startedTyping) super.Close();
    }

    OnClose ()
    {
        this.#face.color.a = 0;
        this.#text.text = '';
    }

    SetFace (char, name)
    {
        if (this.#startedTyping) return;

        const sprite = Resources.Find(`sprites/faces/${char}`).sprites.find(item => item.name === name).Duplicate();

        this.#face.sprite = sprite;
        this.#showFace = true;
    }
    
    async Type (text)
    {
        if (this.#startedTyping) return;

        this.transform.position = GameObject.Find("camera")?.transform.position;

        this.#startedTyping = true;

        this.Open();

        await CrystalEngine.Wait(() => this.isOpen);

        text += "\\!";

        this.#arrow.color.a = 0;
        this.#text.text = "";
        this.#chars = [];

        this.#face.transform.position = new Vector2(
            -3 * 1.325,
            this.spriteRenderer.bounds.center.y
        );
        this.#text.transform.position = new Vector2(
            this.#showFace ? (this.#face.bounds.max.x + (0.375 * 0.65)) : (this.spriteRenderer.bounds.min.x + (0.375 * 0.75)),
            this.spriteRenderer.bounds.max.y - (0.5725 * 0.4)
        );

        let escaping = false;
        let showLineFast = false;
        let currentTime = 0;
        let textIndex = 0;

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

                    charData.callback = () => AudioManager.instance.PlaySE("dialogue_3");

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
            }

            escaping = false;

            if (!typeText) continue;

            const index = textIndex;
            const currentI = i;
            const shownFast = showLineFast;
            this.#text.text += text[i];
            charData.callback = () => {
                if (text[currentI] !== "\n")
                {
                    if (index === 0)
                    {
                        this.#face.color.a = +this.#showFace;
                        this.#showFace = false;
                    }
                    
                    const char = this.#text.characters[index];
                    char.color = new Color(
                        char.color.r,
                        char.color.g,
                        char.color.b,
                        1
                    );
                }

                if (!shownFast && (index !== 0 && index % 3 === 0)) AudioManager.instance.PlaySE("dialogue_3");
            };

            currentTime += this.#speed;

            if (text[i] !== "\n")
            {
                textIndex++;
                continue;
            }

            showLineFast = false;
        }

        this.#text.ForceMeshUpdate();

        await CrystalEngine.Wait(() => this.#text.characters.length === textIndex);
        
        this.#typing = true;

        await CrystalEngine.Wait(() => !this.#startedTyping);
    }

    Unpause ()
    {
        if (!this.#canUnpause || this.#playIndex >= this.#pauseCount) return;
            
        this.#playIndex++;
        this.#arrow.color.a = 0;
        this.#canUnpause = false;
    }
}