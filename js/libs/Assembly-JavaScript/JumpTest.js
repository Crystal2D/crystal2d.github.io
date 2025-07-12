class JumpTest extends GameBehavior
{
    #t = 0.1;
    #m = 0;
    #s = 1;
    #c = () => { };
    
    #pos = null;

    Start ()
    {
        this.#pos = this.transform.position.Duplicate();
    }
    
    Update ()
    {
        if (this.#t >= 0.1) return;

        this.#t += Time.deltaTime * this.#s;

        this.transform.position = new Vector2(
            this.#pos.x,
            this.#t <= 0.05 ? Math.Lerp(
                this.transform.position.y,
                this.#pos.y + this.#m,
                this.#t / 0.075
            ) : Math.Lerp(
                this.transform.position.y,
                this.#pos.y,
                (this.#t - 0.05) / 0.05
            )
        );

        if (this.#t >= 0.1) this.#c();
    }

    Jump (m, s, c = () => { })
    {
        this.#t = 0;
        this.#m = m ?? 0.75;
        this.#s = s ?? 1;
        this.#c = c;
    }
}