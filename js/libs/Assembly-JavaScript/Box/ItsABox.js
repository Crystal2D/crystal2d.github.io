// insane, ik
class ItsABox extends GameBehavior
{
    #openness = 0;
    #state = 0;
    #targetState = 0;
    #onOpen = () => { };
    #onClose = () => { };

    spriteRenderer = null;

    get isClosed ()
    {
        return this.#state === 0;
    }

    get isClosing ()
    {
        return this.isOpen && this.#targetState === 0;
    }

    get isOpening ()
    {
        return this.isClosed && this.#targetState === 1;
    }

    get isOpen ()
    {
        return !this.isClosed;
    }

    Start ()
    {
        this.spriteRenderer = this.GetComponent("SpriteRenderer");
        this.transform.scale = new Vector2(1, 0);
    }
    
    Update ()
    {
        if (this.isOpening) this.#openness += 1920 * Time.deltaTime;
        else if (this.isClosing) this.#openness -= 1920 * Time.deltaTime;
        else return;

        this.#openness = Math.Clamp(this.#openness, 0, 255);

        if (this.#openness === 255 && !this.isOpen)
        {
            this.#state = 1;
            this.OnOpen();

            this.#onOpen();
            this.#onOpen = () => { };
        }
        else if (this.#openness === 0 && !this.isClosed)
        {
            this.#state = 0;

            this.#onClose();
            this.#onClose = () => { };
        }

        this.transform.scale = new Vector2(1, this.#openness / 255);
    }

    Open (callback = () => { })
    {
        if (this.isOpen) return;
        
        this.#targetState = 1;
        this.#onOpen = () => callback();
    }

    Close (callback = () => { })
    {
        if (this.isClosed) return;

        this.#targetState = 0;
        this.OnClose();
        this.#onClose = () => callback();
    }

    Toggle ()
    {
        if (this.isClosed) this.Open();
        else if (this.isOpen) this.Close();
    }

    OnOpen () { }

    OnClose () { }
}