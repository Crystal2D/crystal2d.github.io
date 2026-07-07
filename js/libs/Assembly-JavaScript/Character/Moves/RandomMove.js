class RandomMove extends MovesBase
{
    turnOnly = false;

    Start ()
    {
        super.Start();
        this._time = this.interval * Math.RandomRanged(0.5, 1);
    }
    
    Invoke ()
    {
        const dir = new Vector2(
            Math.RandomInt(-1, 1),
            Math.RandomInt(-1, 1)
        );

        if (Math.RandomInt(1) > 0) dir.x = 0;

        if (this.turnOnly) this._char.LookAt(dir);
        else this._char.MoveTowards(dir);
    }
}