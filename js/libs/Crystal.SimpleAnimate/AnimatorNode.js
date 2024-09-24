class AnimatorNode extends AnimatorNodeBase
{
    #started = false;
    #end = false;
    #frameTime = 0;
    #time = 0;
    #frame = 0;

    speed = 1;
    name = "animation";

    animation = null;

    get hasStarted ()
    {
        return this.#started;
    }

    get hasEnded ()
    {
        return this.#end;
    }

    get currentTime ()
    {
        return Math.min(this.#time, this.duration);
    }

    get duration ()
    {
        return this.animation.sprites.length * this.animation.interval;
    }

    get normalizedTime ()
    {
        return this.currentTime / this.duration;
    }

    get reversed ()
    {
        return this.speed < 0;
    }

    set reversed (value)
    {
        this.speed = Math.abs(this.speed) * (value ? -1 : 1);
    }

    Update (renderer)
    {
        if (this.#end || this.speed === 0 || this.animation.sprites.length === 0) return;

        if (this.#frameTime > 0)
        {
            const deltaT = Time.deltaTime * Math.abs(this.speed);

            this.#frameTime -= deltaT;
            this.#time += deltaT;

            return;
        }

        if (this.reversed && this.#frame < 0) this.End();
        else if (this.#frame >= this.animation.sprites.length) this.End();

        if (!this.#started) this.Start();
        else if (this.#end) return;

        renderer.sprite = this.animation.sprites[this.#frame];
        
        this.#frame += this.reversed ? -1 : 1;

        this.#frameTime = this.animation.interval;
    }

    Start ()
    {
        this.#started = true;
        this.#end = false;

        this.#time = 0;

        this.#frame = this.reversed ? this.animation.sprites.length - 1 : 0;
    }

    End ()
    {
        this.#end = true;

        if (this.animation.loop) this.#started = false;
    }
}