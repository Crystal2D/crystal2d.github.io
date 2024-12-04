class DelegateEvent
{
    #calls = [];

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
        for (let i = 0; i < this.#calls.length; i++) this.#calls[i](...params);
    }
}