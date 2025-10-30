class ChoiceBox extends ItsABox
{
    #updateDimensions = 0;
    #cursorTime = 0;
    #selected = 0;
    #initialPos = 0;
    #padding = Vector2.zero;
    #choices = [];

    #text = null;
    #selector = null;

    get selected ()
    {
        return this.#selected;
    }

    set selected (value)
    {
        if (value === this.#selected) return;

        const max = this.#choices.length - 1;

        if (value > this.#selected)
        {
            if (value === max) InputManager.Clear();
            if (value > max) value = 0;
        }
        else
        {
            if (value === 0) InputManager.Clear();
            if (value < 0) value = max;
        }
        
        this.#selected = value;
        this.#selector.transform.localPosition = new Vector2(0, this.#initialPos - 0.375 * this.#selected);
        
        AudioManager.instance.PlaySelect();
    }

    get padding ()
    {
        return this.#padding.Duplicate();
    }

    set padding (value)
    {
        if (this.#padding.Equals(value)) return;

        this.#padding = value.Duplicate();
        
        if (this.#text != null) this.#updateDimensions = true;
    }

    AddChoice (label, callback)
    {
        this.#choices.push({
            label: label,
            callback: callback
        });

        if (this.#text != null)
        {
            this.#text.text += `${label}\n`;
            this.#updateDimensions = 1;
        }
    }

    async Start ()
    {
        super.Start();

        const content = await this.Instantiate(Resources.FindPrefab("boxcontent/choice"), this.transform);
        this.#text = content.GetComponentInChildren("Text");
        this.#selector = content.GetComponentInChildren("SpriteRenderer");

        for (let i = 0; i < this.#choices.length; i++) this.#text.text += `${this.#choices[i].label}\n`;

        this.#updateDimensions = 1;
    }

    #UpdateDimensions ()
    {
        if (this.#updateDimensions === 1)
        {
            this.#updateDimensions++;

            return;
        }

        if (this.#updateDimensions === 0) return;

        this.#updateDimensions = 0;

        this.#text.width = this.#text.bounds.size.x + this.#padding.x;
        this.#text.height = 0.375 * this.#choices.length + this.#padding.y;

        this.spriteRenderer.size = new Vector2(
            this.#text.width + 0.575 * 2,
            this.#text.height + 0.575
        );
        this.#initialPos = (this.#text.height - 0.375) * 0.5;
        this.#selector.size = new Vector2(
            this.#text.width + 0.575,
            0.375
        );
    }

    #AnimateCursor ()
    {
        if (this.isClosed || this.isClosing) return;

        this.#cursorTime += Time.deltaTime * 60;

        if (this.#cursorTime >= 40) this.#cursorTime = 0;

        let opacity = 255;

        if (this.#cursorTime < 20) opacity -= this.#cursorTime * 8;
        else opacity -= (40 - this.#cursorTime) * 8;

        this.#selector.color.a = opacity / 255;
    }

    Update ()
    {
        super.Update();

        this.#UpdateDimensions();
        this.#AnimateCursor();
        
        if (this.isClosed || this.isClosing) return;

        this.selected += +InputManager.IsRepeated("down") - +InputManager.IsRepeated("up");

        if (InputManager.GetKeyDown("z"))
        {
            AudioManager.instance.PlayConfirm();

            this.#choices[this.#selected].callback();
        }
    }

    OnOpen ()
    {
        this.#text.color.a = 1;
        this.#selector.color.a = 1;
        this.#cursorTime = 0;

        this.#selector.transform.localPosition = new Vector2(0, this.#initialPos - 0.375 * this.#selected);
    }

    OnClose ()
    {
        this.#text.color.a = 0;
        this.#selector.color.a = 0;
    }
}