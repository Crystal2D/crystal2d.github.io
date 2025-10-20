class Transitioner extends GameBehavior
{
    static instance = null;

    #inTime = 0;
    #inTimeSet = 0;
    #outTime = 0;
    #outTimeSet = 0;
    #onFadeIn = () => { };
    #onFadeOut = () => { };

    #tint = new Color(0, 0, 0, 0);
    #tintTarget = new Color(0, 0, 0, 0);
    #tintDuration = 0;
    #tintTime = 0;
    #materials = [];
    #tintInTime = 0;
    #tintInState = -1;
    #tintOutTime = 0;
    #tintOutState = -1;
    #onTintIn = () => { };
    #onTintOut = () => { };

    #sprite = null;

    Awake ()
    {
        Transitioner.instance = this;
        
        this.#sprite = this.GetComponent("SpriteRenderer");

        this.DontDestroyOnLoad(this, [
            "sprites/pixel"
        ]);
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

    #UpdateTintBase ()
    {
        if (this.#tintTime <= 0) return;

        this.#tintTime -= Time.deltaTime;

        this.#tint = Color.Lerp(
            this.#tintTarget,
            this.#tint,
            this.#tintTime / this.#tintDuration
        );

        for (let i = 0; i < this.#materials.length; i++) this.#materials[i].SetVector("uTint", 
            this.#tint.r,
            this.#tint.g,
            this.#tint.b,
            0
        );
    }

    #StartTintBase (color, duration)
    {
        if (duration === 0)
        {
            for (let i = 0; i < this.#materials.length; i++) this.#materials[i].SetVector("uTint", 
                color.r,
                color.g,
                color.b,
                0
            );

            return;
        }

        this.#tintTarget = color.Duplicate();
        this.#tintTime = duration;
        this.#tintDuration = duration;
    }

    TintIn (callback = () => { })
    {
        this.#materials = [];
        const renderers = GameObject.FindComponents("Renderer");

        for (let i = 0; i < renderers.length; i++)
        {
            const renderer = renderers[i];

            if (renderer === this.#sprite) continue;

            const material = new Material(null, Shader.Find("DEP/Tinted", "FRAGMENT"));
            renderer.material = material;
            material.SetVector("uTint", 0, 0, 0, 0);
            this.#materials.push(material);
        }

        this.#tintInTime = 3;
        this.#tintInState = 3;
        this.#onTintIn = callback;
    }

    TintOut (callback = () => { })
    {
        this.#materials = [];
        const renderers = GameObject.FindComponents("Renderer");

        for (let i = 0; i < renderers.length; i++)
        {
            const renderer = renderers[i];

            if (renderer === this.#sprite) continue;

            const material = new Material(null, Shader.Find("DEP/Tinted", "FRAGMENT"));
            renderer.material = material;
            material.SetVector("uTint",
                130 / 255,
                120 / 255,
                90 / 255,
                0
            );
            this.#materials.push(material);

            if (renderer instanceof Tilemap)
            {
                const materials = renderer.materials;

                for (let i = 0; i < materials.length; i++) materials[i].SetVector("uTint",
                    130 / 255,
                    120 / 255,
                    90 / 255,
                    0
                );

                this.#materials.push(...materials);
            }
        }

        this.#tintOutTime = 3;
        this.#tintOutState = 2;
        this.#onTintOut = callback;
    }

    Clear ()
    {
        this.#inTime = 0;
        this.#outTime = 0;
        this.#tintInState = -1;
        this.#tintOutState = -1;

        this.#sprite.color.a = 0;

        for (let i = 0; i < this.#materials.length; i++) this.#materials[i].SetVector("uTint", 0, 0, 0, 0);
    }

    Update ()
    {
        this.#UpdateFade();
        this.#UpdateTintBase();

        if (this.#tintInTime === 3 && this.#tintInState === 3) this.#StartTintBase(new Color(
            20 / 255,
            10 / 255,
            10 / 255
        ), 1 / 60);
        else if (this.#tintInTime === 3 && this.#tintInState === 2) this.#StartTintBase(new Color(
            90 / 255,
            80 / 255,
            50 / 255
        ), 1 / 60);
        else if (this.#tintInTime === 3 && this.#tintInState === 1) this.#StartTintBase(new Color(
            130 / 255,
            120 / 255,
            90 / 255
        ), 1 / 60);

        if (this.#tintInState > 0)
        {
            this.#tintInTime -= Time.deltaTime * 60;

            if (this.#tintInTime <= 0)
            {
                this.#tintInState--;

                if (this.#tintInState > 0) this.#tintInTime = 3;
                else
                {
                    this.#onTintIn();
                    this.#onTintIn = () => { };
                }
            }
        }

        if (this.#tintOutTime === 3 && this.#tintOutState === 2) this.#StartTintBase(new Color(
            90 / 255,
            80 / 255,
            50 / 255
        ), 1 / 60);
        else if (this.#tintOutTime === 3 && this.#tintOutState === 1) this.#StartTintBase(new Color(0, 0, 0), 1 / 60);

        if (this.#tintOutState > 0)
        {
            this.#tintOutTime -= Time.deltaTime * 60;

            if (this.#tintOutTime <= 0)
            {
                this.#tintOutState--;
                
                if (this.#tintOutState > 0) this.#tintOutTime = 3;
                else
                {
                    this.#onTintOut();
                    this.#onTintOut = () => { };
                }
            }
        }
    }
}