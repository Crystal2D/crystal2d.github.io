class SortingLayer
{
    static #layers = [new SortingLayer("Default", 0, 0)];
    static #indexes = [];

    static get layers ()
    {
        return this.#layers;
    }

    static get ids ()
    {
        return this.#indexes;
    }
    
    id = 0;
    value = 0;
    name = "";

    static Add (layers)
    {
        for (let i = 0; i < layers.length; i++) this.#layers.push(new SortingLayer(layers[i].name, layers[i].id, layers[i].value));

        this.#layers.sort((a, b) => a.value - b.value);
        this.#indexes = this.#layers.map(item => item.id);
    }

    constructor (name, id, value)
    {
        this.name = name;
        this.id = id;
        this.value = value;
    }
}