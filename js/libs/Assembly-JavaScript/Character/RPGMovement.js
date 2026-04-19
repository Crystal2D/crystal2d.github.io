class RPGMovement extends GameBehavior
{
    #allowDirChange = true;
    #checkedDir = false;
    #moveStart = false;
    #speed = 3;
    #currentSpeed = 0;
    #currentFrameSpeed = 0;
    #animCount = 0;
    #animState = 0;
    #jumpPeak = 0;
    #jumpDuration = 0;
    #jumpTime = 0;
    #targetDir = Vector2.zero;
    #lookDir = Vector2.down;
    #movement = Vector2.zero;
    #lastPos = Vector2.zero;
    #jumpTo = Vector2.zero;
    #onJumpEnd = () => { };

    #node = null;

    _frameSpeed = 30 * Math.pow(2, 3) / 256;
    _moveDir = Vector2.zero;

    _sprResolver = null;

    get #jumpHeight ()
    {
        const timePeak = 2 * this.#jumpPeak * (this.#jumpTime / this.#jumpDuration);

        return (Math.pow(this.#jumpPeak, 2) - Math.pow(Math.abs(timePeak - this.#jumpPeak), 2));
    }

    get _shouldMove ()
    {
        return this.updateMovement;
    }

    get lookingAt ()
    {
        return this.#lookDir.Duplicate();
    }

    set lookingAt (value)
    {
        this.LookAt(value);
    }

    get nodePos ()
    {
        return this.#node.pos;
    }

    get gridPos ()
    {
        return this.#node.gridPos;
    }

    get isJumping ()
    {
        return this.#jumpTime > 0;
    }

    get moveSpeed ()
    {
        return this.#speed;
    }

    set moveSpeed (value)
    {
        if (this.#speed === value) return;

        this.#speed = value;
        this._frameSpeed = 30 * Math.pow(2, value) / 256;
    }

    get isMoving ()
    {
        return this.#moveStart;
    }

    lockLook = false;
    updateMovement = true;
    charCollision = true;
    animateWalk = true;
    animateIdle = true;
    tileSize = new Vector2(0.5, 0.5);
    onMoveStart = new DelegateEvent();
    onStop = new DelegateEvent();
    onStay = new DelegateEvent();
    ignoredCharCollisions = [];

    lastNode = null;
    event = null;

    async Invoke ()
    {
        if (this.event == null) return;

        await EventSystem.Run(this.event);
    }

    #GetMovement ()
    {
        this._moveDir = this.#targetDir;

        this.#movement = Vector2.Scale(this._moveDir, this.tileSize);
    }

    #DirBlocked ()
    {
        const checkedNode = MapGrid.current.NodeOn(Vector2.Add(this.nodePos, this._moveDir));

        if (this._DirCheck(checkedNode)) return true;

        this.#node.RemoveOwner(this);
        this.lastNode = this.#node;
        this.#node = checkedNode;
        this.#node.AddOwner(this);

        return false;
    }

    #Move ()
    {
        if (!this.#moveStart) return;

        const nextPos = Vector2.Add(
            this.transform.position,
            Vector2.Scale(this._moveDir, Time.deltaTime * this.#currentFrameSpeed)
        );

        if (Vector2.Abs(Vector2.Subtract(nextPos, this.#lastPos)).GreaterEquals(Vector2.Abs(this.#movement)))
        {
            this.#targetDir = Vector2.zero;
            this._moveDir = Vector2.zero;

            this.transform.position = Vector2.Add(this.#lastPos, this.#movement);

            this.#moveStart = false;
            this.#allowDirChange = true;

            this._OnStop();
            this.onStop.Invoke();

            return;
        }

        this.lookingAt = this._moveDir;
        this.transform.position = nextPos;

        this._OnMove();
    }

    Start ()
    {
        this._sprResolver = this.GetComponent(SpriteResolver);
        
        const sprDir = this._sprResolver.category;

        if (sprDir === "up") this.#lookDir = Vector2.up;
        else if (sprDir === "left") this.#lookDir = Vector2.left;
        else if (sprDir === "right") this.#lookDir = Vector2.right;
    }

    OnEnable ()
    {
        this.#node = MapGrid.current.NodeOnWorld(this.transform.position);
        this.#node.AddOwner(this);

        this.transform.localPosition = Vector2.Add(this.transform.localPosition, new Vector2(0, 0.3125));
    }

    OnDisable ()
    {
        this.#node.RemoveOwner(this);
        this.lastNode = null;
        this.#node = null;
    }

    LateUpdate ()
    {
        if (this.isJumping) return;

        if (this._moveDir.Equals(Vector2.zero))
        {
            this._OnMovementGet();

            this.#GetMovement();

            this.#currentSpeed = this.#speed;
            this.#currentFrameSpeed = this._frameSpeed;

            this.#lastPos = this.transform.position;

            this.#checkedDir = false;
        }

        if (this._moveDir.Equals(Vector2.zero) || !this._shouldMove) return;

        if (!this.#checkedDir)
        {
            this.#checkedDir = true;

            if (this.#DirBlocked())
            {
                this.lookingAt = this._moveDir;
                this._moveDir = Vector2.zero;
                this.transform.position = this.#lastPos;
                this.#allowDirChange = true;

                return;
            }
        }

        if (!this.#moveStart)
        {
            this.#moveStart = true;
            this.onMoveStart.Invoke();
        }
    }

    Update ()
    {
        if (this.isJumping) this.#UpdateJump();
        else this.#UpdateMove();

        this.#Animate();
    }

    #UpdateJump ()
    {
        this.#jumpTime -= Time.deltaTime;

        const timePeak = 30 * this.#jumpPeak * (this.#jumpTime / this.#jumpDuration);
        this.#lastPos = new Vector2(
            (this.#lastPos.x * timePeak + this.#jumpTo.x) / (timePeak + 1),
            (this.#lastPos.y * timePeak + this.#jumpTo.y) / (timePeak + 1)
        );

        this.transform.localPosition = new Vector2(
            this.#lastPos.x,
            this.#lastPos.y + this.#jumpHeight
        );

        if (this.#jumpTime <= 0)
        {
            this.#lastPos = this.#jumpTo;
            this.transform.localPosition = this.#lastPos;
            this.#onJumpEnd();
        }
    }

    #UpdateMove ()
    {
        if (!this._moveDir.Equals(Vector2.zero))
        {
            if (this._shouldMove) this.#Move();
        }
        else
        {
            this._OnStay();
            this.onStay.Invoke();
        }
    }

    #Animate ()
    {
        if (this.animateWalk && this.#moveStart) this.#animCount += 1.5 * Time.deltaTime * 60;
        else if (this.animateIdle || this.#animState !== 0) this.#animCount += Time.deltaTime * 60;

        const duration = (9 - this.#currentSpeed) * 3;

        if (this.#animCount >= duration)
        {
            this.#animState = +(this.#animState === 0);
            this._sprResolver.label = `${this.#animState}`;

            this.#animCount = 0;
        }
    }

    _DirCheck (node)
    {
        if (node.collider === 1 || (node.collider === 2 && this.charCollision)) return true;

        const char = node.GetOwnerOfType(RPGMovement);
        if (char != null && !this.ignoredCharCollisions.includes(char)) return this.charCollision && char.charCollision;

        return false;
    }

    _OnMovementGet () { }

    _OnMove () { }

    _OnStop () { }

    _OnStay () { }

    async MoveTowards (dir)
    {
        if (!this.#allowDirChange || dir.Equals(Vector2.zero)) return;

        if (Math.abs(dir.x) > Math.abs(dir.y)) dir.y = 0;
        else dir.x = 0;

        this.#allowDirChange = false;

        this.#targetDir = Vector2.Clamp(dir, Vector2.Scale(Vector2.one, -1), Vector2.one);

        let moved = false;
        const startCall = () => {
            this.onMoveStart.Remove(startCall);
            moved = true;
        };
        this.onMoveStart.Add(startCall);

        await CrystalEngine.Wait(() => this.#allowDirChange);

        return moved;
    }

    LookAtTemp (dir)
    {
        if (this.lockLook) return;

        dir = dir.normalized;

        if (dir.y > 0) this._sprResolver.category = "up";
        else if (dir.y < 0) this._sprResolver.category = "down";
        else if (dir.x < 0) this._sprResolver.category = "left";
        else if (dir.x > 0) this._sprResolver.category = "right";
    }

    LookAt (dir)
    {
        if (this.lockLook) return;

        dir = dir.normalized;

        if (this.#lookDir.Equals(dir)) return;

        this.#lookDir = dir;

        this.LookAtTemp(dir)
    }

    LookAtChar (char)
    {
        this.LookAt(Vector2.Subtract(char.gridPos, this.gridPos));
    }

    LookAtCharTemp (char)
    {
        this.LookAtTemp(Vector2.Subtract(char.gridPos, this.gridPos));
    }

    Unlook ()
    {
        this.LookAtTemp(this.#lookDir);
    }

    TP (pos)
    {
        this.#allowDirChange = true;
        this.#targetDir = Vector2.zero;

        this.#node.RemoveOwner(this);
        this.lastNode = this.#node;
        this.#node = MapGrid.current.NodeOnGrid(pos);
        this.#node.AddOwner(this);

        this.transform.localPosition = Vector2.Add(MapGrid.current.CellToWorld(pos), new Vector2(0, 0.3125));
    }

    async Jump (by = Vector2.zero)
    {
        if (this.#jumpTime > 0 || !this._moveDir.Equals(Vector2.zero)) return;

        this.ResetAnimation();

        const targetNode = MapGrid.current.NodeOn(Vector2.Add(this.nodePos, by));

        if (!by.Equals(Vector2.zero))
        {
            this.LookAt(by);

            this.#node.RemoveOwner(this);
            this.lastNode = this.#node;
            this.#node = targetNode;
            this.#node.AddOwner(this);
        }

        this.#jumpTo = Vector2.Add(MapGrid.current.CellToWorld(targetNode.gridPos), new Vector2(0, 0.3125));

        this.#jumpPeak = (10 + by.magnitude - this.#speed / 60) * 0.05;
        this.#jumpDuration = ((10 + by.magnitude - this.#speed) / 60) * 2;
        this.#jumpTime = this.#jumpDuration;
        this.lockLook = true;

        await new Promise(resolve => this.#onJumpEnd = resolve);

        this.lockLook = false;
    }

    async MoveToChar (char)
    {
        const deltaX = char.gridPos.x - this.gridPos.x;
        const deltaY = char.gridPos.y - this.gridPos.y;

        if (Math.abs(deltaX) > Math.abs(deltaY))
        {
            const moved = await this.MoveTowards(new Vector2(deltaX, 0));
            if (!moved && deltaY !== 0) await this.MoveTowards(new Vector2(0, deltaY));
        }
        else if (deltaY !== 0)
        {
            const moved = await this.MoveTowards(new Vector2(0, deltaY));
            if (!moved && deltaX !== 0) await this.MoveTowards(new Vector2(deltaX, 0));
        }
    }

    async MoveAwayChar (char)
    {
        const deltaX = this.gridPos.x - char.gridPos.x;
        const deltaY = this.gridPos.y - char.gridPos.y;

        if (Math.abs(deltaX) > Math.abs(deltaY))
        {
            const moved = await this.MoveTowards(new Vector2(deltaX, 0));
            if (!moved && deltaY !== 0) await this.MoveTowards(new Vector2(0, deltaY));
        }
        else if (deltaY !== 0)
        {
            const moved = await this.MoveTowards(new Vector2(0, deltaY));
            if (!moved && deltaX !== 0) await this.MoveTowards(new Vector2(deltaX, 0));
        }
    }

    ResetAnimation ()
    {
        this.#animCount = 0;
        this.#animState = 0;
        this._sprResolver.label = `${this.#animState}`;
    }

    async StepBack ()
    {
        return this.MoveTowards(Vector2.Scale(this.#lookDir, -1));
    }
}