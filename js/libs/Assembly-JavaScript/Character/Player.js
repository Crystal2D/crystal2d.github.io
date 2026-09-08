class Player extends RPGMovement
{
    static instance = null;

    #tertriaryInput = false;
    #xTime = 0;
    #yTime = 0;

    #touchTransfer = null;
    #keyTransfer = null;
    #keyInteractable = null;
    #touchInteractable = null;

    animateIdle = false;
    avoidInputs = true;

    Start ()
    {
        super.Start();

        Player.instance = this;
        this.DontDestroyOnLoad(this);

        this.onJumpStart.Add(() => Party.OnJump());
        this.onTP.Add(() => Party.OnTP());

        EventSystem.onAfterUpdate.Add(() => {
            this.#keyTransfer = null;
            this.#keyInteractable = null;
            this.#GetTileInteractables(this._node);
        });
    }
    
    Update ()
    {
        if (Input.GetKeyDown(KeyCode.Num0)) this.collision = !this.collision;

        GameWindow.SetTitle(`${this.collision} | ${SceneManager.GetActiveScene().index} @ ${this.gridPos.toString()} | ${this.transform.position.x} ${this.transform.position.y - 0.3125}`);

        this.#tertriaryInput = InputManager.GetKey("shift");

        super.Update();
    }

    #GetTileInteractables (node)
    {
        if (node == null) return;
        
        const interactables = node.GetOwnersOfType(Interactable);

        // Get on tile interactables
        for (let i = 0; i < interactables.length; i++)
        {
            if (this.#keyInteractable == null && (interactables[i].trigger === 0 || interactables[i].trigger === 3)) this.#keyInteractable = interactables[i];
            if (this.#touchInteractable == null && interactables[i].trigger === 1) this.#touchInteractable = interactables[i];
        }
    }

    _DirCheck (node, tped)
    {
        this.#keyTransfer = null;
        this.#keyInteractable = null;

        if (super._DirCheck(node)) // if collides
        {
            const interactables = node.GetOwnersOfType(Interactable);
            let bumpInteractable = null;

            for (let i = 0; i < interactables.length; i++)
            {
                if (interactables[i].trigger !== 2) continue;
                
                bumpInteractable = interactables[i];
                break;
            }

            if (bumpInteractable == null) 
            {
                const char = node.GetOwnerOfType(RPGMovement);
                if (char != null && char.eventBumpable && char.event != null) bumpInteractable = char;
            }

            if (bumpInteractable != null) (async () => {
                this.avoidInputs = true;
                this.moveSpeed = 4;

                await bumpInteractable.Invoke();

                this.avoidInputs = false;
            })();

            return true;
        }

        if (!tped)
        {
            const transfer = node.GetOwnerOfType(MapTransfer);
            if (transfer != null) this.#touchTransfer = transfer;
        }

        this.#GetTileInteractables(node);

        return false;
    }

    _OnMovementGet ()
    {
        if (this.avoidInputs) return;

        let lookedNode = null;

        // Get looked at transfer
        if (this.#keyTransfer == null)
        {
            lookedNode = MapGrid.current.NodeOn(Vector2.Add(this.nodePos, this.lookingAt));
            this.#keyTransfer = lookedNode.GetOwnerOfType(MapTransfer);
        }

        // Get looked at interactable
        if (this.#keyInteractable == null)
        {
            if (lookedNode == null) lookedNode = MapGrid.current.NodeOn(Vector2.Add(this.nodePos, this.lookingAt));

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
        }

        if (InputManager.IsTriggered("ok") && EventSystem.dialogueBox.isClosed) this.#Interact();

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
        
        this.moveSpeed = (Options.run ? !this.#tertriaryInput : this.#tertriaryInput) ? 5 : 4;
        this.MoveTowards(input);
    }

    async _OnStop ()
    {
        if (this.#touchTransfer != null) await this.#Transfer(0);

        if (this.#touchInteractable != null)
        {
            this.avoidInputs = true;
            this.moveSpeed = 4;

            const interactable = this.#touchInteractable;
            this.#touchInteractable = null;

            await interactable.Invoke();

            this.avoidInputs = false;
        }
    }

    async #Transfer (index)
    {
        this.avoidInputs = true;
        this.moveSpeed = 4;

        const lastScene = MapGrid.scene;

        if (index === 0)
        {
            MapTransfer.last = this.#touchTransfer;
            this.#touchTransfer = null;
        }
        else
        {
            MapTransfer.last = this.#keyTransfer;
            this.#keyTransfer = null;
        }

        await EventSystem.TransferEvent(lastScene, MapTransfer.last.scene, 0);

        await Transitioner.instance.TintIn();

        const transCall = async () => {
            Loader.onSwitchEnd.Remove(transCall);
            await EventSystem.TransferEvent(lastScene, MapTransfer.last.scene, 1);

            await Transitioner.instance.TintOut();

            await EventSystem.TransferEvent(lastScene, MapTransfer.last.scene, 2);
            this.avoidInputs = false;
        };
        Loader.onSwitchEnd.Add(transCall);

        Loader.Switch(MapTransfer.last.scene);
    }

    async #Interact ()
    {
        if (this.#keyTransfer != null) await this.#Transfer(1);

        if (this.#keyInteractable == null) return;

        const interactable = this.#keyInteractable;

        this.avoidInputs = true;
        this.moveSpeed = 4;

        const isChar = interactable instanceof RPGMovement;
        let charMove = null;

        if (isChar)
        {
            charMove = interactable.GetComponent(MovesBase);

            if (charMove != null)
            {
                charMove.enabled = false;
                await EventSystem.WaitFrameEnd();
            }

            interactable.LookAtPlayerTemp();
        }

        const handledInput = (await interactable.Invoke()) ?? false;

        if (isChar) interactable.Unlook();
        if (charMove != null)
        {
            charMove.enabled = true;
            charMove.ResetTime();
        }

        if (!handledInput) this.avoidInputs = false;
    }
}