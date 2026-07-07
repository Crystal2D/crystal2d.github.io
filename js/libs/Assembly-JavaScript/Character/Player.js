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
        this.DontDestroyOnLoad(this);

        this.onJumpStart.Add(() => Party.OnJump());
        this.onTP.Add(() => Party.OnTP());
    }
    
    Update ()
    {
        if (Input.GetKeyDown(KeyCode.Num0)) this.collision = !this.collision;

        GameWindow.SetTitle(`${this.collision} | ${SceneManager.GetActiveScene().index} @ ${this.gridPos.toString()} | ${this.transform.position.x} ${this.transform.position.y - 0.3125}`);

        this.#tertriaryInput = InputManager.GetKey("shift");

        super.Update();
    }

    _DirCheck (node, tped)
    {
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
            if (transfer != null) this.#transfer = transfer;   
        }

        const interactables = node.GetOwnersOfType(Interactable);

        // Get on tile interactables
        for (let i = 0; i < interactables.length; i++)
        {
            if (this.#keyInteractable == null && (interactables[i].trigger === 0 || interactables[i].trigger === 3)) this.#keyInteractable = interactables[i];
            if (this.#touchInteractable == null && interactables[i].trigger === 1) this.#touchInteractable = interactables[i];
        }

        return false;
    }

    _OnMovementGet ()
    {
        if (this.avoidInputs) return;

        // Get looked at interactable
        if (this.#keyInteractable == null)
        {
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
            this.moveSpeed = 4;

            const interactable = this.#touchInteractable;
            this.#touchInteractable = null;

            await interactable.Invoke();

            this.avoidInputs = false;
        }
    }

    async #Interact ()
    {
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