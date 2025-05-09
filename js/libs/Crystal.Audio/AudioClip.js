class AudioClip
{
    #loaded = false;
    #src = "";

    #buffer = null;

    get isLoaded ()
    {
        return this.#loaded;
    }

    get channels ()
    {
        return this.#buffer.numberOfChannels;
    }

    get length ()
    {
        return this.#buffer.duration;
    }

    get samples ()
    {
        return this.#buffer.length;
    }

    get frequency ()
    {
        return this.#buffer.sampleRate;
    }

    constructor (src)
    {
        this.#src = src;
    }

    GetData ()
    {
        return this.#buffer;
    }

    async Load ()
    {
        const audio = await fetch(`audio/${this.#src}`);
        const arrayBuffer = await audio.arrayBuffer();
        
        this.#buffer = await AudioSettings.DecodeBuffer(arrayBuffer);
        
        this.#loaded = true;
    }
}