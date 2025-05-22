class Transitioner extends GameBehavior
{
    static instance = null;

    #inTime = 0;
    #inTimeSet = 0;
    #outTime = 0;
    #outTimeSet = 0;

    #sprite = null;

    onFadeIn = new DelegateEvent();
    onFadeOut = new DelegateEvent();

    Awake ()
    {
        Transitioner.instance = this;
        
        this.#sprite = this.GetComponent("SpriteRenderer");
    }

    FadeIn (time = 0.5)
    {
        this.#inTime = time,
        this.#inTimeSet = time;
    }

    FadeOut (time = 0.5)
    {
        this.#outTime = time,
        this.#outTimeSet = time;
    }

    Update ()
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
}