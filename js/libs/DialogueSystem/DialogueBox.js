class DialogueBox extends ItsABox
{
    #startedTyping = false;
    #typing = false;
    #speed = 1 / 60;
    #chars = [];

    #face = null;
    #text = null;

    async Start ()
    {
        super.Start();

        Crispixels.effect = true;
        this.#text = this.GetComponentInChildren("Text");
        this.#face = this.transform.Find("face").GetComponent("SpriteRenderer");
        this.#face.gameObject.SetActive(false);
    }

    #UpdateTyping ()
    {
        if (!this.#typing) return;

        let done = true;

        for (let i = 0; i < this.#chars.length; i++)
        {
            if (this.#chars[i].shown) continue;

            done = false;
            this.#chars[i].time -= Time.deltaTime;

            if (this.#chars[i].time > 0) continue;

            this.#chars[i].char.color = new Color(
                this.#chars[i].char.color.r,
                this.#chars[i].char.color.g,
                this.#chars[i].char.color.b,
                1
            );
            this.#chars[i].shown = true;
            
            if (this.#chars[i].audio != null) AudioManager.instance.PlaySE(this.#chars[i].audio);
        }

        if (done)
        {
            this.#startedTyping = false;
            this.#typing = false;
        }
    }

    Update ()
    {
        super.Update();

        if (Input.GetMouseButtonDown(0)) this.Type("Chirp! Chirp!");

        this.#UpdateTyping();

        // this.#face.transform.position = new Vector2(
        //     -3 * 1.325,
        //     this.spriteRenderer.bounds.center.y
        // );
        // this.#text.transform.position = new Vector2(
        //     // this.#face.bounds.max.x + (0.375 * 0.65),
        //     this.spriteRenderer.bounds.min.x + (0.375 * 0.75),
        //     this.spriteRenderer.bounds.max.y - (0.5725 * 0.4)
        // );
    }

    OnOpen ()
    {
        this.#face.color.a = 1;
    }

    OnClose ()
    {
        this.#face.color.a = 0;
    }
    
    async Type (text)
    {
        if (this.#startedTyping) return;

        this.#startedTyping = true;

        this.Open();

        await CrystalEngine.Wait(() => this.isOpen);

        this.#text.text = "";
        this.#chars = [];

        this.#text.transform.position = new Vector2(
            // this.#face.bounds.max.x + (0.375 * 0.65),
            this.spriteRenderer.bounds.min.x + (0.375 * 0.75),
            this.spriteRenderer.bounds.max.y - (0.5725 * 0.4)
        );
        this.#text.text = text;

        await new Promise(resolve => requestAnimationFrame(resolve));

        let currentTime = 0;

        for (let i = 0; i < this.#text.characters.length; i++)
        {
            const charData = {
                char: this.#text.characters[i],
                time: currentTime,
                shown: false
            };

            if (i % 3 === 0) charData.audio = "dialogue_3";

            this.#chars.push(charData);

            currentTime += this.#speed;
        }
        
        this.#typing = true;
    }
}