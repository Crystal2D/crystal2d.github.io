class AudioManager extends GameBehavior
{
    static #bgVol = 100;
    static #seVol = 100;

    static onBGMVolumeChange = new DelegateEvent();
    static onSEVolumeChange = new DelegateEvent();

    static instance = null;

    static get bgmVolume ()
    {
        return this.#bgVol;
    }

    static set bgmVolume (value)
    {
        this.#bgVol = value;

        this.onBGMVolumeChange.Invoke(0.01 * value);
    }

    static get seVolume ()
    {
        return this.#seVol;
    }

    static set seVolume (value)
    {
        this.#seVol = value;

        this.onSEVolumeChange.Invoke(0.01 * value);
    }

    #flushBGM = false;
    #localBgVol = 1;
    #fadePool = [];

    #clipName = null;
    #select = null;
    #confirm = null;
    #no = null;

    bgm = null;
    se = null;

    #FadingBGM = class
    {
        done = false;
        duration = 0;
        time = 0;
        volume = 0;

        source = null;
        name = null;

        get bgFadeVol ()
        {
            return (this.duration - this.time) / this.duration || 1;
        }

        Update ()
        {
            if (this.time >= this.duration) return;

            this.time += Time.deltaTime;
            this.source.volume = this.volume * this.bgFadeVol * 0.01 * AudioManager.bgmVolume;

            if (this.time >= this.duration) this.End();
        }

        End ()
        {
            this.duration = 0;
            this.time = 0;
            this.done = true;

            AudioManager.instance.gameObject.RemoveComponent(this.source);
            Resources.DestroyOnLoad(this.name);
        }
    }

    Awake ()
    {
        this.DontDestroyOnLoad(this, [
            "audio/se/select",
            "audio/se/confirm",
            "audio/se/no"
        ]);

        Loader.onSwitchEnd.Add(() => this.#flushBGM = true);
    }

    Start ()
    {
        AudioManager.instance = this;

        const sources = this.GetComponents(AudioSource);

        this.bgm = new AudioSource();
        this.bgm.loop = true;
        this.gameObject.AddComponent(this.bgm);

        AudioManager.onBGMVolumeChange.Add(vol => this.bgm.volume = this.#localBgVol * vol);

        const seVol = 0.01 * AudioManager.seVolume;

        this.se = sources[0];
        this.se.volume = 0.6 * seVol;

        // Yes these are separate sources
        // just to replicate how RPG Maker MV does "AudioManager.playStaticSe"
        this.#select = sources[1];
        this.#select.volume = 0.6 * seVol;

        this.#confirm = sources[2];
        this.#confirm.volume = 0.6 * seVol;

        this.#no = sources[3];
        this.#no.volume = 0.9 * seVol;

        AudioManager.onSEVolumeChange.Add(vol => {
            this.se.volume = 0.6 * vol;
            this.#select.volume = 0.6 * vol;
            this.#confirm.volume = 0.6 * vol;
            this.#no.volume = 0.9 * vol;
        });
    }

    Update ()
    {
        let removing = [];

        for (let i = 0; i < this.#fadePool.length; i++)
        {
            if (this.#flushBGM) this.#fadePool[i].End();
            else this.#fadePool[i].Update();

            if (this.#flushBGM || this.#fadePool[i].done) removing.push(this.#fadePool[i]);
        }

        this.#flushBGM = false;

        for (let i = 0; i < removing.length; i++) this.#fadePool.splice(this.#fadePool.indexOf(removing[i]), 1);
    }

    async PlayBGM (name, volume, pitch)
    {
        this.#localBgVol = volume ?? 1;
        this.bgm.volume = this.#localBgVol * 0.01 * AudioManager.bgmVolume;
        this.bgm.pitch = pitch ?? 1;

        if (name === this.#clipName) return;

        this.StopBGM();

        this.#clipName = name;

        Resources.DontDestroyOnLoad(`audio/bgm/${this.#clipName}`);

        await Resources.Load(`audio/bgm/${this.#clipName}`);

        this.bgm.clip = Resources.Find(`audio/bgm/${this.#clipName}`);
        this.bgm.Play();
    }

    FadeOutBGM (duration)
    {
        const bgm = new this.#FadingBGM();
        bgm.duration = duration;
        bgm.volume = this.#localBgVol;
        bgm.source = this.bgm;
        bgm.name = this.#clipName;
        this.#fadePool.push(bgm);
        
        this.#clipName = null;

        this.bgm = new AudioSource();
        this.bgm.loop = true;
        this.gameObject.AddComponent(this.bgm);
    }

    StopBGM ()
    {
        if (this.#clipName == null) return;

        this.bgm.Stop();
        Resources.DestroyOnLoad(`audio/bgm/${this.#clipName}`);

        this.#clipName = null;
    }

    BGMSave ()
    {
        if (this.#clipName == null) return null;

        return {
            name: this.#clipName,
            volume: this.#localBgVol * 100,
            pitch: this.bgm.pitch * 100
        };
    }

    PlaySE (name, volume, pitch)
    {
        this.se.PlayOneShot(Resources.Find(`audio/se/${name}`), volume, pitch);
    }

    PlaySelect ()
    {
        if (Application.isMobilePlatform)
        {
            this.#select.PlayOneShot(this.#select.clip);

            return;
        }
        
        this.#select.Stop();
        this.#select.Play();
    }

    PlayConfirm ()
    {
        if (Application.isMobilePlatform)
        {
            this.#confirm.PlayOneShot(this.#confirm.clip);

            return;
        }
        
        this.#confirm.Stop();
        this.#confirm.Play();
    }

    PlayNo ()
    {
        if (Application.isMobilePlatform)
        {
            this.#no.PlayOneShot(this.#no.clip);

            return;
        }
        
        this.#no.Stop();
        this.#no.Play();
    }
}