class Player extends RPGMovement
{
    static instance = null;

    #tertriaryInput = false;
    #xTime = 0;
    #yTime = 0;

    #transfer = null;
    #keyInteractable = null;
    #touchInteractable = null;

    animateIdle = false;
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
        GameWindow.SetTitle(`${SceneManager.GetActiveScene().index} @ ${this.gridPos.toString()} | ${this.transform.position.x} ${this.transform.position.y - 0.3125}`);

        this.#tertriaryInput = InputManager.GetKey("shift");

        super.Update();
    }

    _DirCheck (node)
    {
        if (super._DirCheck(node)) return true;

        const transfer = node.GetOwnerOfType(MapTransfer);

        if (transfer != null) this.#transfer = transfer;

        const interactables = node.GetOwnersOfType(Interactable);

        for (let i = 0; i < interactables.length; i++)
        {
            if (interactables[i].trigger !== 1) continue;

            this.#touchInteractable = interactables[i];
            break;
        }

        return false;
    }

    _OnMovementGet ()
    {
        if (this.avoidInputs) return;

        const lookedNode = MapGrid.current.NodeOn(Vector2.Add(this.nodePos, this.lookingAt));
        const interactables = lookedNode.GetOwnersOfType(Interactable);

        let interactable = null;

        for (let i = 0; i < interactables.length; i++)
        {
            if (interactables[i].trigger !== 0) continue;

            interactable = interactables[i];
            break;
        }

        if (interactable == null) interactable = lookedNode.GetOwnerOfType(RPGMovement);

        if (interactable != null) this.#keyInteractable = interactable;
        else this.#keyInteractable = null;

        if (InputManager.GetKeyDown("ok") && EventSystem.dialogueBox.isClosed) this.#Interact();

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

        this.moveSpeed = (Options.run ? !this.#tertriaryInput : this.#tertriaryInput) ? 5 : 4;
    }

    async _OnStop ()
    {
        if (this.#transfer != null)
        {
            this.avoidInputs = true;

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

        if (this.#touchInteractable != null)
        {
            this.avoidInputs = true;

            await this.#touchInteractable.Invoke();

            this.avoidInputs = false;
            this.#touchInteractable = null;
        }
    }

    async #Interact ()
    {
        if (this.#keyInteractable == null) return;

        this.avoidInputs = true;

        const isChar = this.#keyInteractable instanceof RPGMovement;
        let charMove = null;

        if (isChar)
        {
            charMove = this.#keyInteractable.GetComponent(MovesBase);

            if (charMove != null)
            {
                charMove.enabled = false;
                await EventSystem.WaitFrameEnd();
            }

            this.#keyInteractable.LookAtPlayerTemp();
        }

        const handledInput = (await this.#keyInteractable.Invoke()) ?? false;

        if (isChar) this.#keyInteractable.Unlook();
        if (charMove != null)
        {
            charMove.enabled = true;
            charMove.ResetTime();
        }

        if (!handledInput) this.avoidInputs = false;
    }
}