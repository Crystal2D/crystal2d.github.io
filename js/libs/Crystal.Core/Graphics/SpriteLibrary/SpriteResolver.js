class SpriteResolver extends GameBehavior
{
    #sprRen = null;
    #ogSpr = null;
    #lib = null;
    #lastCategory = null;
    #lastLabel = null;

    category = null;
    label = null;

    set enabled (value)
    {
        super.enabled = value;

        if (value) return;

        this.#sprRen.sprite = this.#ogSpr.Duplicate();

        this.#lastCategory = null;
        this.#lastLabel = null;
    }
    
    get enabled ()
    {
        return super.enabled;
    }

    Start ()
    {
        this.#sprRen = this.GetComponent("SpriteRenderer");
        this.#ogSpr = this.#sprRen.sprite.Duplicate();
        this.#lib = this.GetComponent("SpriteLibrary");
    }

    Update ()
    {
        if (this.#lastCategory === this.category && this.#lastLabel === this.label) return;
        if (this.category == null || this.label == null) return;

        this.#sprRen.sprite = this.#lib.GetSprite(this.category, this.label);

        this.#lastCategory = this.category;
        this.#lastLabel = this.label;
    }
}