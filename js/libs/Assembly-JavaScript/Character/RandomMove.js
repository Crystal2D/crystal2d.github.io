class RandomMove extends GameBehavior
{
    #time = 0;

    #char = null;

    turnOnly = false;
    interval = 1;

    Start ()
    {
        this.#char = this.GetComponent(RPGMovement);
    }

    Update ()
    {
        this.#time += Time.deltaTime;

        if (this.#time < this.interval) return;

        this.#time = 0;

        const dir = new Vector2(
            Math.RandomInt(1, -1),
            Math.RandomInt(1, -1)
        );

        if (this.turnOnly) this.#char.LookAt(dir);
        else this.#char.MoveTowards(dir);
    }
}