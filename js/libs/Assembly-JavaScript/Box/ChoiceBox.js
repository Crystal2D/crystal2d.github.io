class ChoiceBox extends ItsABox
{
    #updateDimensions = 0;
    #cursorTime = 0;
    #selected = 0;
    #max = 0;
    _initialPos = 0;
    #padding = Vector2.zero;
    #choices = [];

    #min = null;

    _text = null;
    _selector = null;

    get selected ()
    {
        return this.#selected;
    }

    set selected (value)
    {
        if (value === this.#selected) return;

        if (value > this.#selected)
        {
            while (this.#choices[value]?.skip) value++;

            if (value === this.#max) InputManager.Clear();
            if (value > this.#max) value = this.#min;
        }
        else
        {
            while (this.#choices[value]?.skip) value--;

            if (value === this.#min) InputManager.Clear();
            if (value < this.#min) value = this.#max;
        }
        
        this.#selected = value;
        this._selector.transform.localPosition = new Vector2(0, this._initialPos - 0.375 * this.#selected);
        
        AudioManager.instance.PlaySelect();

        this._OnSelect();
    }

    get padding ()
    {
        return this.#padding.Duplicate();
    }

    set padding (value)
    {
        if (this.#padding.Equals(value)) return;

        this.#padding = value.Duplicate();
        
        if (this._text != null) this.#updateDimensions = true;
    }

    get choiceCount ()
    {
        return this.#choices.length;
    }

    AddText (label)
    {
        this.#choices.push({
            label: label,
            skip: true
        });

        if (this._text != null)
        {
            this._text.text += `${label}\n`;
            this.#updateDimensions = 1;
        }
    }

    AddChoice (label, callback, directional = 0)
    {
        this.#choices.push({
            label: label,
            callback: callback,
            dired: directional
        });

        const index = this.#choices.length - 1;
        this.#max = index;

        if (this.#min == null)
        {
            this.#min = index;
            this.#selected = index;
        }

        if (this._text != null)
        {
            this._text.text += `${label}\n`;
            this.#updateDimensions = 1;
        }
    }

    async Start ()
    {
        super.Start();

        const content = await this.Instantiate(Resources.FindPrefab("boxcontent/choice"), this.transform);
        this._text = content.GetComponentInChildren("Text");
        this._selector = content.GetComponentInChildren("SpriteRenderer");

        for (let i = 0; i < this.#choices.length; i++) this._text.text += `${this.#choices[i].label}\n`;

        this.#updateDimensions = 1;
    }

    _UpdateDimensions ()
    {
        this._text.width = this._text.bounds.size.x + this.#padding.x;
        this._text.height = 0.375 * this.choiceCount + this.#padding.y;

        this.spriteRenderer.size = new Vector2(
            this._text.width + 0.575 * 2,
            this._text.height + 0.575
        );
        this._initialPos = (this._text.height - 0.375) * 0.5;
        this._selector.size = new Vector2(
            this._text.width + 0.575,
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

        this._selector.color.a = opacity / 255;
    }

    Update ()
    {
        super.Update();

        if (this.#updateDimensions === 2)
        {
            this._UpdateDimensions();

            this.#updateDimensions = 0;
        }
        else if (this.#updateDimensions === 1) this.#updateDimensions++;

        this.#AnimateCursor();
        
        if (this.isClosed || this.isClosing) return;

        this.selected += +InputManager.IsRepeated("down") - +InputManager.IsRepeated("up");

        const item = this.#choices[this.#selected];

        if (item.dired === 0)
        {
            if (InputManager.GetKeyDown("z"))
            {
                AudioManager.instance.PlayConfirm();
                item.callback();
            }

            return;
        }

        let dir = null;

        if (item.dired === 1) dir = +(InputManager.GetKeyDown("z") || InputManager.GetKeyDown("right")) - InputManager.GetKeyDown("left");
        else dir = +(InputManager.GetKeyDown("z") || InputManager.IsRepeated("right")) - InputManager.IsRepeated("left");

        if (dir !== 0)
        {
            if (item.callback(dir) !== false) AudioManager.instance.PlayConfirm();
        }
    }

    OnOpen ()
    {
        this._text.color.a = 1;
        this._selector.color.a = 1;
        this.#cursorTime = 0;

        this._selector.transform.localPosition = new Vector2(0, this._initialPos - 0.375 * this.#selected);
    }

    OnClose ()
    {
        this._text.color.a = 0;
        this._selector.color.a = 0;
    }

    _OnSelect () { }
}