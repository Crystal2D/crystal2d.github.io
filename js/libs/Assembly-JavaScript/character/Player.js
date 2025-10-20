class Player extends RPGMovement
{
    static instance = null;

    #tertriaryInput = false;
    #xTime = 0;
    #yTime = 0;

    #transfer = null;

    avoidInputs = true;

    Start ()
    {
        super.Start();

        Player.instance = this;
        this.DontDestroyOnLoad(this, [
            "sprites/chars/yoki",
            "spritelibs/chars/yoki"
        ]);
    }
    
    Update ()
    {
        this.#GetInput();

        super.Update();
    }

    _DirCheck (node)
    {
        if (node.collider) return true;

        if (node.owner instanceof MapTransfer)
        {
            this.avoidInputs = true;
            this.#transfer = node.owner
            Loader.Ready(this.#transfer.scene);
        }

        return false;
    }

    _OnMovementGet ()
    {
        if (this.avoidInputs) return;

        const input = new Vector2(
            +InputManager.GetKey("right") - +InputManager.GetKey("left"),
            +InputManager.GetKey("up") - +InputManager.GetKey("down")
        );

        if (input.x !== 0) this.#xTime++;
        else if (this.#xTime !== 0) this.#xTime = 0;

        if (input.y !== 0) this.#yTime++;
        else if (this.#yTime !== 0) this.#yTime = 0;

        if (Vector2.Abs(input).Equals(Vector2.one))
        {
            if (this.#xTime > this.#yTime) input.x = 0;
            else input.y = 0;
        }

        this.MoveTowards(input);

        this.speedScale = (Options.run ? !this.#tertriaryInput : this.#tertriaryInput) ? 2 : 1;
    }

    _OnStop ()
    {
        if (this.#transfer != null)
        {
            MapTransfer.last = this.#transfer;
            this.#transfer = null;

            Transitioner.instance.TintIn(() => {
                const transCall = () => {
                    Loader.onSwitchEnd.Remove(transCall);
                    Transitioner.instance.TintOut(() => this.avoidInputs = false);
                };
                Loader.onSwitchEnd.Add(transCall);

                Loader.Switch(MapTransfer.last.scene);
            });
        }
    }

    #GetInput ()
    {
        this.#tertriaryInput = InputManager.GetKey("shift");
    }
}