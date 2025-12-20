class DialogueBox extends ItsABox
{
    #startedTyping = false;
    #typing = false;
    #canUnpause = false;
    #showFace = false;
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

        if (done)
        {
            this.#startedTyping = false;
            this.#typing = false;
        }
    }

    #AllowUnpause ()
    {
        this.#canUnpause = true;
        this.#arrow.color.a = 1;
    }

    Update ()
    {
        super.Update();

        if (Input.GetMouseButtonDown(0))
        {
            this.SetFace(Resources.Find("sprites/faces/yoki").sprites[1]);
            this.Type("I don't need to change\nclothes...\\.\\. What I'm wearing \nright now is fine.");
        }

        this.#UpdateTyping();
    }

    OnClose ()
    {
    }

    SetFace (sprite)
    {
        this.#face.sprite = sprite;
        this.#showFace = true;
    }
    
    async Type (text)
    {
        if (this.#startedTyping) return;

        this.#startedTyping = true;

        this.Open();

        await CrystalEngine.Wait(() => this.isOpen);

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
                time: currentTime,
                done: false,
                playIndex: this.#pauseCount
            };
            this.#chars.push(charData);

            let typeText = true;

            if (escaping) switch (text[i])
            {
                case ".":
                    currentTime += 0.25;
                    charData.time = currentTime;
                    typeText = false;
                    break;
                case "|":
                    currentTime += 1;
                    charData.time = currentTime;
                    typeText = false;
                    break;
                case "!":
                    currentTime = 0;
                    charData.time += 1 / 6;
                    this.#pauseCount++;

                    charData.callback = () => this.#AllowUnpause();

                    typeText = false;
                    break;
            }

            escaping = false;

            if (!typeText) continue;

            const index = textIndex;
            const currentI = i;
            this.#text.text += text[i];
            charData.callback = () => {
                if (index === 0)
                {
                    this.#face.color.a = +this.#showFace;
                    this.#showFace = false;
                }
                
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

                if (index !== 0 && index % 3 === 0) AudioManager.instance.PlaySE("dialogue_3");
            };

            currentTime += this.#speed;

            if (text[i] !== "\n") textIndex++;
        }

        await new Promise(resolve => requestAnimationFrame(resolve));
        
        this.#typing = true;
    }

    Unpause ()
    {
        if (!this.#canUnpause || this.#playIndex >= this.#pauseCount) return;
            
        this.#playIndex++;
        this.#arrow.color.a = 0;
        this.#canUnpause = false;
    }
}