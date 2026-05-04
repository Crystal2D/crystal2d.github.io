class MovesBase extends GameBehavior
{
    _time = 0;

    _char = null;

    interval = 1;
    onResetTime = new DelegateEvent();
    onAfterResetTime = new DelegateEvent();

    ResetTime ()
    {
        this._time = 0;
        this.onResetTime.Invoke();
        this.onAfterResetTime.Invoke();
    }

    Start ()
    {
        this._char = this.GetComponent(RPGMovement);
        this._time = this.interval;
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
