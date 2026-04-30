class EventAutostart extends GameBehavior
{
    #processing = false;

    done = false;
    conditions = [];

    event = null;

    Awake ()
    {
        EventSystem.onUpdate.Add(() => this.#Process());
        this.#Process();
    }

    #Process ()
    {
        if (this.done || this.#processing || this.event == null) return;

        this.#processing = true;

        let met = true;

        for (let i = 0; i < this.conditions.length; i++)
        {
            if (this.conditions[i].Check()) continue;

            met = false;

            break;
        }

        if (!met)
        {
            this.#processing = false;
            return;
        }
        
        EventSystem.Run(this.event);

        this.done = true;
        this.#processing = false;
    }
}