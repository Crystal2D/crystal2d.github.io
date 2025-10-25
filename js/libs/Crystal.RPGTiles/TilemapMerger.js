class TilemapMerger
{
    static #queue = [];

    static #worker = null;

    static async Merge (data)
    {
        if (this.#worker == null)
        {
            this.#worker = new Worker("js/libs/Crystal.RPGTiles/MergeWorker.js");
            this.#worker.onmessage = event => this.#OnMerged(event.data);
            this.#worker.postMessage(data);
        }

        const item = { data: data };
        this.#queue.push(item);

        await new Promise(resolve => item.resolve = resolve);

        return item.output;
    }

    static #OnMerged (output)
    {
        const item = this.#queue.shift();
        item.output = URL.createObjectURL(output);
        item.resolve();

        if (this.#queue.length > 0)
        {
            this.#worker.postMessage(this.#queue[0].data);

            return;
        }

        this.#worker.terminate();
        this.#worker = null;
    }
}