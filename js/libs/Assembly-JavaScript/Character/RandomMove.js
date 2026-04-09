class RandomMove extends GameBehavior
{
    #time = 0;

    #char = null;

    turnOnly = false;
    interval = 1;

    ResetTime ()
    {
        this.#time = 0;
    }

    Start ()
    {
        this.#char = this.GetComponent(RPGMovement);
        this.#time = Math.random() * this.interval;
    }

    Update ()
    {
        this.#time += Time.deltaTime;

        if (this.#time < this.interval) return;

        this.ResetTime();

        const dir = new Vector2(
            Math.RandomInt(-1, 1),
            Math.RandomInt(-1, 1)
        );

        if (Math.RandomInt(1) > 0) dir.x = 0;

        if (this.turnOnly) this.#char.LookAt(dir);
        else this.#char.MoveTowards(dir);
    }
}