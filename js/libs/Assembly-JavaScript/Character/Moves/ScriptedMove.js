class ScriptedMove extends MovesBase
{
    #running = false;
    #callback = () => { };
    #timers = [];

    interval = 0;

    constructor (callback)
    {
        super();

        const waitCalls = Array.from(callback.matchAll(/await \$caller\.Wait\(-?\d*\.?\d+\)/g)).sort((a, b) => b.index - a.index);
        for (let i = 0; i < waitCalls.length; i++)
        {
            const endIndex = waitCalls[i].index + waitCalls[i][0].length;
            callback = `${callback.slice(0, endIndex)}; if ($hasResetTime()) return;${callback.slice(endIndex)}`;
        }
        
        this.#callback = new AsyncFunction("$caller", "$char", "$hasResetTime", callback);

        this.onAfterResetTime.Add(() => this.#EndTimers());
    }

    #UpdateTimers ()
    {
        let removingTimers = [];

        for (let i = 0; i < this.#timers.length; i++)
        {
            this.#timers[i].time += Time.deltaTime;
            
            if (this.#timers[i].time < this.#timers[i].duration) continue;

            this.#timers[i].callback();
            removingTimers.push(this.#timers[i]);
        }

        for (let i = 0; i < removingTimers.length; i++) this.#timers.splice(this.#timers.indexOf(removingTimers[i]), 1);
    }

    #EndTimers ()
    {
        for (let i = 0; i < this.#timers.length; i++) this.#timers[i].duration = -1;
    }

    EarlyUpdate ()
    {
        if (this.#running)
        {
            this.#UpdateTimers();
            return;
        }

        super.EarlyUpdate();
    }

    async Wait (duration)
    {
        duration = duration / 60;

        if (duration < Time.deltaTime) return;

        const timer = {
            time: 0,
            duration: duration,
            callback: () => { }
        };
        this.#timers.push(timer);
        
        await new Promise(resolve => timer.callback = resolve);
    }

    async Invoke ()
    {
        if (this.#running) return;
        this.#running = true;

        let resetTime = false;

        const checkCall = () => {
            this.onResetTime.Remove(checkCall);
            resetTime = true;
        };
        this.onResetTime.Add(checkCall);

        await this.#callback(this, this._char, () => resetTime);

        this.onResetTime.Remove(checkCall);
        this.#running = false;
    }
}
