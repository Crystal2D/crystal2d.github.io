class Transitioner extends GameBehavior
{
    static instance = null;

    #inTime = 0;
    #inTimeSet = 0;
    #outTime = 0;
    #outTimeSet = 0;

    #tint = new Color(0, 0, 0, 0);
    #tintTarget = new Color(0, 0, 0, 0);
    #tintDuration = 0;
    #tintTime = 0;

    #sprite = null;

    onFadeIn = new DelegateEvent();
    onFadeOut = new DelegateEvent();

    Awake ()
    {
        Transitioner.instance = this;
        
        this.#sprite = this.GetComponent("SpriteRenderer");
    }

    FadeIn (time = 0.4)
    {
        this.#inTime = time,
        this.#inTimeSet = time;
    }

    FadeOut (time = 0.8)
    {
        this.#outTime = time,
        this.#outTimeSet = time;
    }

    #UpdateFade ()
    {
        if (this.#inTime > 0)
        {
            this.#inTime -= Time.deltaTime;

            this.#sprite.color.a = Math.max(this.#inTime / this.#inTimeSet, 0);

            if (this.#inTime <= 0)
            {
                this.onFadeIn.Invoke();
                this.onFadeIn.RemoveAll();
            }

            return;
        }

        if (this.#outTime > 0)
        {
            this.#outTime -= Time.deltaTime;

            this.#sprite.color.a = Math.min((this.#outTimeSet - this.#outTime) / this.#outTimeSet, 1);

            if (this.#outTime <= 0)
            {
                this.onFadeOut.Invoke();
                this.onFadeOut.RemoveAll();
            }

            return;
        }
    }

    #UpdateTint ()
    {
        if (this.#tintTime <= 0) return;

        this.#tintTime -= Time.deltaTime;
        this.#sprite.color = Color.Lerp(
            this.#tintTarget,
            this.#tint,
            this.#tintTime / this.#tintDuration
        );
    }

    StartTint (color, duration)
    {
        if (this.#tintDuration === 0)
        {
            this.#sprite.color = this.#tintTarget.Duplicate();

            return;
        }

        this.#tintTarget = color.Duplicate();
        this.#tintTime = duration;
        this.#tintDuration = duration;
    }

    // StTin (color, duration)
    // {
    //     startTint(this._params[0], this._params[1]);
    //     if (this._params[2]) {
    //         this.wait(this._params[1]);
    //     }
    // }

    Update ()
    {
        this.#UpdateFade();
        this.#UpdateTint();
    }
}