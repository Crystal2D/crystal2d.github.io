class RPGMovement extends GameBehavior
{
    #allowDirChange = true;
    #checkedDir = false;
    #moveStart = false;
    #currentSpeedScale = 0;
    #moveSpeed = 0;
    #animCount = 0;
    #animState = 0;
    #targetDir = Vector2.zero;
    #lookDir = Vector2.down;
    #movement = Vector2.zero;
    #lastPos = Vector2.zero;

    #lastNode = null;
    #node = null;

    _moveDir = Vector2.zero;

    _sprResolver = null;

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

    get gridPos ()
    {
        return this.#node.pos;
    }

    updateMovement = true;
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
        const checkedNode = MapGrid.current.NodeOn(Vector2.Add(this.gridPos, this._moveDir));

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

            // Window.SetTitle(`${this.#node.gridPos.toString()} ${this.transform.localPosition.x} ${this.transform.localPosition.y}`);

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

        this.#Animate();
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
        if (this.#lookDir.Equals(dir)) return;

        this.#lookDir = dir;

        if (dir.y > 0) this._sprResolver.category = "up";
        else if (dir.y < 0) this._sprResolver.category = "down";
        else if (dir.x < 0) this._sprResolver.category = "left";
        else if (dir.x > 0) this._sprResolver.category = "right";
    }

    TP (pos)
    {
        this.#node = MapGrid.current.NodeOnGrid(pos);
        this.#node.owner = this;

        this.transform.position = MapGrid.current.CellToWorld(pos);
        this.transform.localPosition = Vector2.Add(this.transform.localPosition, new Vector2(0, 0.3125));
    }
}