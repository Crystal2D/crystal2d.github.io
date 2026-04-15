class Transitioner extends GameBehavior
{
    static instance = null;

    #inTime = 0;
    #inTimeSet = 0;
    #outTime = 0;
    #outTimeSet = 0;
    #onFadeIn = () => { };
    #onFadeOut = () => { };
    
    #sprite = null;

    Awake ()
    {
        Transitioner.instance = this;
        
        this.#sprite = this.GetComponent(SpriteRenderer);

        this.DontDestroyOnLoad(this, ["sprites/pixel"]);
    }

    FadeIn (callback = () => { })
    {
        this.#inTime = 0.4,
        this.#inTimeSet = 0.4;
        this.#onFadeIn = callback;
    }

    FadeOut (callback = () => { })
    {
        this.#outTime = 1,
        this.#outTimeSet = 1;
        this.#onFadeOut = callback;
    }

    #UpdateFade ()
    {
        if (this.#inTime > 0)
        {
            this.#inTime -= Time.deltaTime;

            this.#sprite.color.a = Math.max(this.#inTime / this.#inTimeSet, 0);

            if (this.#inTime <= 0)
            {
                this.#onFadeIn();
                this.#onFadeIn = () => { };
            }

            return;
        }

        if (this.#outTime > 0)
        {
            this.#outTime -= Time.deltaTime;

            this.#sprite.color.a = Math.min((this.#outTimeSet - this.#outTime) / this.#outTimeSet, 1);

            if (this.#outTime <= 0)
            {
                this.#onFadeOut();
                this.#onFadeOut = () => { };
            }

            return;
        }
    }

    async TintIn ()
    {
        EventSystem.TintAll(new Color(
            20 / 255,
            10 / 255,
            10 / 255,
            0
        ));
        await EventSystem.Timer(3);
        await EventSystem.TintAll(new Color(
            90 / 255,
            80 / 255,
            50 / 255,
            0
        ));
        await EventSystem.Timer(3);
        await EventSystem.TintAll(new Color(
            130 / 255,
            120 / 255,
            90 / 255,
            0
        ));
        await EventSystem.Timer(3);
    }

    async TintOut ()
    {
        await EventSystem.TintAll(new Color(
            90 / 255,
            80 / 255,
            50 / 255,
            0
        ));
        await EventSystem.Timer(3);
        await EventSystem.TintAll(Color.clear);
        await EventSystem.Timer(3);
    }

    Clear ()
    {
        this.#inTime = 0;
        this.#outTime = 0;
        this.#sprite.color.a = 0;
    }

    SetFadeIn ()
    {
        this.#sprite.color.a = 1;
    }

    Update ()
    {
        this.#UpdateFade();
    }

    LateUpdate ()
    {
        if (CamCtrl.current != null) this.transform.position = CamCtrl.current.transform.position;
    }
}