class Player extends RPGMovement
{
    static instance = null;

    #tertriaryInput = false;
    #xTime = 0;
    #yTime = 0;

    #transfer = null;
    #interactable = null;

    animateWalk = true;
    avoidInputs = true;
    speedScale = 1;

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
        Window.SetTitle(`${SceneManager.GetActiveScene().index} @ ${this.gridPos.toString()} | ${this.transform.position.x} ${this.transform.position.y - 0.3125}`);

        this.#tertriaryInput = InputManager.GetKey("shift");

        super.Update();
    }

    _DirCheck (node)
    {
        if (super._DirCheck(node)) return true;

        const transfer = node.GetOwnerOfType(MapTransfer);

        if (transfer != null)
        {
            this.avoidInputs = true;
            this.#transfer = transfer;
        }

        return false;
    }

    _OnMovementGet ()
    {
        if (this.avoidInputs) return;

        const lookedNode = MapGrid.current.NodeOn(Vector2.Add(this.nodePos, this.lookingAt));
        const interactable = lookedNode.GetOwnerOfType(Interactable) ??  lookedNode.GetOwnerOfType(RPGMovement);

        if (interactable != null) this.#interactable = interactable;
        else this.#interactable = null;

        if (InputManager.GetKeyDown("ok")) this.#Interact();

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

    async _OnStop ()
    {
        if (this.#transfer != null)
        {
            const lastScene = MapGrid.scene;

            MapTransfer.last = this.#transfer;
            this.#transfer = null;

            EventSystem.TransferEvent(lastScene, MapTransfer.last.scene, 0);

            await Transitioner.instance.TintIn();

            const transCall = async () => {
                Loader.onSwitchEnd.Remove(transCall);
                EventSystem.TransferEvent(lastScene, MapTransfer.last.scene, 1);

                await Transitioner.instance.TintOut();

                this.avoidInputs = false;
                EventSystem.TransferEvent(lastScene, MapTransfer.last.scene, 2);
            };
            Loader.onSwitchEnd.Add(transCall);

            Loader.Switch(MapTransfer.last.scene);
        }
    }

    async #Interact ()
    {
        if (this.#interactable == null) return;

        this.avoidInputs = true;

        await this.#interactable.Invoke();

        this.avoidInputs = false;
    }
}