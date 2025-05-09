class AudioSettings
{
    static #terminating = false;
    static #context = new AudioContext();
    static #worker = new Worker("js/libs/Crystal.Audio/AudioWorker.js");

    static dspTime = 0;
    static dspDeltaTime = 0;

    static get latency ()
    {
        return this.#context.baseLatency;
    }

    static Init ()
    {
        Application.unloading.Add(() => this.#terminating = true);
        
        this.#worker.onmessage = event => this.#Update(event.data);
        this.#worker.postMessage(0);
    }
    
    static #Update (data)
    {
        this.dspTime = data.time;
        this.dspDeltaTime = data.deltaTime;

        const sources = AudioSource.instances;

        let removing = [];

        for (let i = 0; i < sources.length; i++)
        {
            const gameObj = sources[i].gameObject;

            if (gameObj.activeSelf && sources[i].enabled) sources[i].Update();
            else if (sources[i].isPlaying)
            {
                sources[i].Stop();
                sources[i].Update();
            }

            if (gameObj.destroying)
            {
                sources[i].Stop();
                sources[i].Update();

                removing.push(sources[i]);
            }
        }

        for (let i = 0; i < removing.length; i++) sources.splice(sources.indexOf(removing[i]), 1);

        if (this.#terminating) this.#worker.terminate();

        this.#worker.postMessage(0);
    }

    static DecodeBuffer (buffer)
    {
        return this.#context.decodeAudioData(buffer);
    }

    static GetContext ()
    {
        return this.#context;
    }
}

AudioSettings.Init();