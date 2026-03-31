class RPGMovement extends GameBehavior
{
    #allowDirChange = true;
    #checkedDir = false;
    #moveStart = false;
    #currentSpeedScale = 0;
    #moveSpeed = 0;
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

    #lastNode = null;
    #node = null;

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
        return this.#lookDir;
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

    updateMovement = true;
    animateWalk = false;
    speed = 1.875;
    speedScale = 1;
    tileSize = new Vector2(0.5, 0.5);
    onMoveStart = new DelegateEvent();
    onStop = new DelegateEvent();

    #GetMovement ()
    {
        this._moveDir = this.#targetDir;

        this.#movement = Vector2.Scale(this._moveDir, this.tileSize);
    }

    #DirBlocked ()
    {
        const checkedNode = MapGrid.current.NodeOn(Vector2.Add(this.nodePos, this._moveDir));

        if (this._DirCheck(checkedNode)) return true;

        this.#lastNode = this.#node;
        this.#node = checkedNode;
        this.#node.owner = this;
    }

    #Move ()
    {
        if (!this.#checkedDir)
        {
            this.#checkedDir = true;

            if (this.#DirBlocked())
            {
                this.lookingAt = this._moveDir;
                this._moveDir = Vector2.zero;
                this.transform.position = this.#lastPos;

                return;
            }
        }

        if (!this.#moveStart)
        {
            this.#moveStart = true;

            this.onMoveStart.Invoke();
        }

        const nextPos = Vector2.Add(
            this.transform.position,
            Vector2.Scale(this._moveDir, Time.deltaTime * this.#moveSpeed)
        );

        if (Vector2.Abs(Vector2.Subtract(nextPos, this.#lastPos)).Greater(Vector2.Abs(this.#movement)))
        {
            this.#lastNode.owner = null;
            this.#lastNode = null;

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
        this._sprResolver = this.GetComponent("SpriteResolver");
    }

    OnEnable ()
    {
        this.#node = MapGrid.current.NodeOnWorld(this.transform.position);
        this.#node.owner = this;

        this.transform.localPosition = Vector2.Add(this.transform.localPosition, new Vector2(0, 0.3125));
    }

    Update ()
    {
        if (this.isJumping) this.#UpdateJump();
        else this.#UpdateMove();

        if (this.animateWalk) this.#Animate();
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
        }
    }

    #UpdateMove ()
    {
        if (this._moveDir.Equals(Vector2.zero))
        {
            this._OnMovementGet();

            this.#GetMovement();

            this.#currentSpeedScale = this.speedScale;
            this.#moveSpeed = this.speed * this.#currentSpeedScale;

            this.#lastPos = this.transform.position;

            this.#checkedDir = false;
        }

        if (!this._moveDir.Equals(Vector2.zero))
        {
            if (this._shouldMove) this.#Move();
        }
        else
        {
            this.#allowDirChange = true;

            this._OnStay();
        }
    }

    #Animate ()
    {
        if (this.#moveStart) this.#animCount += 1.5 * Time.deltaTime;
        else if (this.#animState === 1) this.#animCount += Time.deltaTime;

        if (this.#animCount >= (this.#currentSpeedScale === 2 ? 0.2 : 0.25))
        {
            this.#animState = +(this.#animState === 0);
            this._sprResolver.label = `${this.#animState}`;

            this.#animCount = 0;
        }
    }

    _DirCheck (node) { return node.collider; }

    _OnMovementGet () { }

    _OnMove () { }

    _OnStop () { }

    _OnStay () { }

    MoveTowards (dir)
    {
        if (!this.#allowDirChange) return;

        this.#allowDirChange = true;

        this.#targetDir = Vector2.Clamp(dir, Vector2.Scale(Vector2.one, -1), Vector2.one);
    }

    LookAt (dir)
    {
        dir = dir.normalized;

        if (this.#lookDir.Equals(dir)) return;

        this.#lookDir = dir;

        if (dir.y > 0) this._sprResolver.category = "up";
        else if (dir.y < 0) this._sprResolver.category = "down";
        else if (dir.x < 0) this._sprResolver.category = "left";
        else if (dir.x > 0) this._sprResolver.category = "right";
    }

    LookAtChar (char)
    {
        this.LookAt(Vector2.Subtract(char.gridPos, this.gridPos));
    }

    TP (pos)
    {
        this.#node = MapGrid.current.NodeOnGrid(pos);
        this.#node.owner = this;

        this.transform.position = MapGrid.current.CellToWorld(pos);
        this.transform.localPosition = Vector2.Add(this.transform.localPosition, new Vector2(0, 0.3125));
    }

    async Jump (by = Vector2.zero)
    {
        if (this.#jumpTime > 0 || !this._moveDir.Equals(Vector2.zero)) return;

        const animator = this.GetComponent("Animator");

        if (animator != null) animator.SetTrigger("jump");
        else
        {
            this.#animCount = 0;
            this.#animState = 0;
            this._sprResolver.label = `${this.#animState}`;
        }

        if (!by.Equals(Vector2.zero)) this.LookAt(by);

        const targetNode = MapGrid.current.NodeOn(Vector2.Add(this.nodePos, by));

        this.#node.owner = null;
        this.#lastNode = null;
        this.#node = targetNode;
        this.#node.owner = this;
        this.#jumpTo = Vector2.Add(MapGrid.current.CellToWorld(targetNode.gridPos), new Vector2(0, 0.3125));

        const moveSpeed = (Math.log(this.#moveSpeed / 30 * 256) / Math.log(2));
        this.#jumpPeak = (10 + by.magnitude - moveSpeed / 60) * 0.05;
        this.#jumpDuration = ((10 + by.magnitude - moveSpeed) / 60) * 2;
        this.#jumpTime = this.#jumpDuration;

        await CrystalEngine.Wait(() => this.#jumpTime <= 0);
    }
}