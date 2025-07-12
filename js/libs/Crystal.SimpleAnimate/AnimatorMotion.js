class AnimatorMotion extends AnimatorNode
{
    #started = false;
    #end = false;
    #time = 0;
    #frame = -1;

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

    get framerate ()
    {
        return this.animation.framerate;
    }

    get time ()
    {
        return Math.min(this.#time, this.duration);
    }

    get frameTime ()
    {
        return Math.min(this.#frame, this.frameDuration);
    }

    get frameDuration ()
    {
        return this.animation.duration;
    }
    
    get duration ()
    {
        return this.frameDuration / this.framerate;
    }

    get normalizedTime ()
    {
        if (this.reversed) return (this.duration - this.#time) / this.duration;

        return this.time / this.duration;
    }

    get reversed ()
    {
        return this.speed < 0;
    }

    set reversed (value)
    {
        this.speed = Math.abs(this.speed) * (value ? -1 : 1);
    }

    Update (gameObject)
    {
        if (!this.#started) this.Start();

        if (this.#end || this.speed === 0 || this.animation.frames.length === 0) return;

        const deltaT = Time.deltaTime * this.speed;
        this.#time += deltaT;

        const currentFrame = Math.floor(this.#time * this.animation.framerate);

        if (this.reversed && currentFrame < 0) this.End();
        else if (currentFrame >= this.frameDuration) this.End();

        if (this.#frame !== currentFrame)
        {
            if (this.speed > 0) this.animation.InvokeFrames(this.#frame, currentFrame, gameObject);
            else this.animation.InvokeFramesReverse(this.#frame, currentFrame, gameObject);

            this.#frame = currentFrame;
        }
        
        if (this.#end) return;
    }

    Start ()
    {
        this.#started = true;
        this.#end = false;

        this.#time = this.reversed ? this.duration : 0;
        this.#frame = this.reversed ? this.frameDuration : -1;
    }

    End ()
    {
        this.#end = true;

        if (this.animation.loop) this.#started = false;
    }

    Duplicate ()
    {
        const output = new AnimatorMotion();

        output.transitions = this.transitions;
        output.speed = this.speed;
        output.name = this.name;
        output.reversed = this.reversed;
        output.animation = this.animation;

        return output;
    }
}