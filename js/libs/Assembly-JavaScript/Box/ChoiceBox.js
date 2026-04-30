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

    nahChoice = null;

    _text = null;
    _selector = null;

    get #currentCharIndex ()
    {
        return this.#choices.reduce((output, value) => output + value.label.length, 0);
    }

    get selected ()
    {
        return this.#selected;
    }

    set selected (value)
    {
        if (value === this.#selected) return;

        if (value > this.#selected)
        {
            while (!(this.#choices[value]?.active ?? true) || this.#choices[value]?.skip) value++;

            if (value === this.#max) InputManager.Clear();
            if (value > this.#max) value = this.#min;
        }
        else
        {
            while (!(this.#choices[value]?.active ?? true) || this.#choices[value]?.skip) value--;

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

    get setDimensions ()
    {
        return this.#updateDimensions === 0;
    }

    AddText (label)
    {
        this.#choices.push({
            label: label,
            skip: true,
            active: true,
            charIndex: this.#currentCharIndex
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
            dired: directional,
            active: true,
            charIndex: this.#currentCharIndex
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

    async SetActive (index, state)
    {
        const choice = this.#choices[index];

        if (choice == null || choice.active === state) return;

        choice.active = state;

        if (this._text == null || this._text.characters.length < this.#currentCharIndex) return;

        for (let i = 0; i < choice.label.length; i++)
        {
            const char = this._text.characters[i + choice.charIndex];

            char.color = new Color(
                char.color.r,
                char.color.g,
                char.color.b,
                state ? 1 : 0.63
            );
        }
    }

    Clear ()
    {
        this.Close();

        this.#choices = [];
        this.#selected = 0;
        this._text.text = "";
        this.#updateDimensions = 1;
    }

    async Start ()
    {
        super.Start();

        const content = await this.Instantiate(Resources.FindPrefab("choicebox_content"), this.transform);
        this._text = content.GetComponentInChildren(Text);
        this._selector = content.GetComponentInChildren(SpriteRenderer);

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

        if (this.#cursorTime >= 40) this.#cursorTime = this.#cursorTime % 40;

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

        if (this.nahChoice != null && InputManager.IsTriggered("cancel"))
        {
            AudioManager.instance.PlayNo();
            this.#choices[this.nahChoice].callback(0);

            return;
        }

        if (item.dired === 0)
        {
            if (InputManager.IsTriggered("ok"))
            {
                AudioManager.instance.PlayConfirm();
                item.callback(0);
            }

            return;
        }

        let dir = null;

        if (item.dired === 1) dir = +(InputManager.IsTriggered("ok") || InputManager.IsTriggered("right")) - InputManager.IsTriggered("left");
        else dir = +(InputManager.IsTriggered("ok") || InputManager.IsRepeated("right")) - InputManager.IsRepeated("left");

        if (dir !== 0)
        {
            if (item.callback(dir) !== false) AudioManager.instance.PlayConfirm();
        }
    }

    OnOpen ()
    {
        for (let i = 0; i < this.#choices.length; i++)
        {
            const choice = this.#choices[i];

            for (let i = 0; i < choice.label.length; i++)
            {
                const char = this._text.characters[i + choice.charIndex];

                char.color = new Color(
                    char.color.r,
                    char.color.g,
                    char.color.b,
                    choice.active ? 1 : 0.63
                );
            }
        }

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