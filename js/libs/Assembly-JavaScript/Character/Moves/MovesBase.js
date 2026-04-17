class MovesBase extends GameBehavior
{
    _time = 0;

    _char = null;

    turnOnly = false;
    interval = 1;

    ResetTime ()
    {
        this._time = 0;
    }

    Start ()
    {
        this._char = this.GetComponent(RPGMovement);
        this._time = Math.random() * this.interval;
    }

    EarlyUpdate ()
    {
        this._time += Time.deltaTime;

        if (this._time < this.interval) return;

        this.ResetTime();
        this.Invoke();
    }

    Invoke () { }
}
