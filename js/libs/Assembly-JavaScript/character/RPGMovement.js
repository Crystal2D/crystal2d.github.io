class RPGMovement extends GameBehavior
{
    #allowDirChange = true;
    #moveStart = false;
    #currentSpeedScale = 0;
    #moveSpeed = 0;
    #targetDir = Vector2.zero;
    #movement = Vector2.zero;
    #lastPos = Vector2.zero;

    _moveDir = Vector2.zero;

    get _shouldMove ()
    {
        return this.updateMovement;
    }

    updateMovement = true;
    speed = 1;
    speedScale = 1;
    tileSize = new Vector2(0.5, 0.5);
    onMoveStart = new DelegateEvent();
    onStop = new DelegateEvent();

    #GetMovement ()
    {
        this._moveDir = this.#targetDir;

        this.#movement = Vector2.Scale(this._moveDir, this.tileSize);
    }

    #Move ()
    {
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
            this.#targetDir = Vector2.zero;
            this._moveDir = Vector2.zero;

            this.transform.position = Vector2.Add(this.#lastPos, this.#movement);

            this.#moveStart = false;

            this.#allowDirChange = true;

            this._OnStop();

            this.onStop.Invoke();

            return;
        }

        this.transform.position = nextPos;

        this._OnMove();
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

    _OnMovementGet () { }

    _OnMove () { }

    _OnStop () { }

    _OnStay () { }

    MoveTowards (direction)
    {
        if (!this.#allowDirChange) return;

        this.#allowDirChange = true;

        this.#targetDir = Vector2.Clamp(direction, Vector2.Scale(Vector2.one, -1), Vector2.one);
    }
}