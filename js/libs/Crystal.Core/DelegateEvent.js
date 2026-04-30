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

        if (index >= 0) this.#calls.splice(index, 1);
    }

    RemoveAll ()
    {
        this.#calls = [];
    }

    Invoke (...params)
    {
        const calls = [...this.#calls];
        let output = [];

        for (let i = 0; i < calls.length; i++) output.push(calls[i](...params));

        return output;
    }

    InvokeReversed (...params)
    {
        const calls = [...this.#calls];
        let output = [];
        
        for (let i = calls.length - 1; i >= 0; i--) output.push(calls[i](...params));

        return output;
    }

    async AsyncInvoke (...params)
    {
        const calls = [...this.#calls];
        let output = [];

        for (let i = 0; i < calls.length; i++) output.push(await calls[i](...params));

        return output;
    }

    async AsyncInvokeReversed (...params)
    {
        const calls = [...this.#calls];
        let output = [];
        
        for (let i = calls.length - 1; i >= 0; i--) output.push(await calls[i](...params));

        return output;
    }
}