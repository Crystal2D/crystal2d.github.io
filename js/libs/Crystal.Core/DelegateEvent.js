class DelegateEvent
{
    #calls = [];

    get count ()
    {
        return this.#calls.length;
    }

    Add (callback)
    {
        this.#calls.push(callback);

        return callback;
    }

    Remove (callback)
    {
        const index = this.#calls.indexOf(callback);

        if (index < 0) return;

        this.#calls.splice(index, 1);
    }

    RemoveAll ()
    {
        this.#calls = [];
    }

    Invoke (...params)
    {
        const calls = [...this.#calls];

        for (let i = 0; i < calls.length; i++) calls[i](...params);
    }

    InvokeReversed (...params)
    {
        const calls = [...this.#calls];
        
        for (let i = calls.length - 1; i >= 0; i--) calls[i](...params);
    }
}