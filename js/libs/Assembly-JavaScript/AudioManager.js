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

        this.onBGMVolumeChange.Invoke(value / 100);
    }

    static get seVolume ()
    {
        return this.#seVol;
    }

    static set seVolume (value)
    {
        this.#seVol = value;

        this.onSEVolumeChange.Invoke(value / 100);
    }

    #clipName = null;
    #select = null;
    #confirm = null;
    #no = null;

    bgm = null;
    se = null;

    Awake ()
    {
        this.DontDestroyOnLoad(this, [
            "audio/se/select",
            "audio/se/confirm",
            "audio/se/no"
        ]);
    }

    Start ()
    {
        AudioManager.instance = this;

        const sources = this.GetComponents("AudioSource");
        
        this.bgm = sources[0];
        this.bgm.volume = 0.24;

        AudioManager.onBGMVolumeChange.Add(vol => this.bgm.volume = 0.24 * vol);

        this.se = sources[1];
        this.se.volume = 0.6;

        // Yes these are separate sources
        // just to replicate how RPG Maker MV does "AudioManager.playStaticSe"
        this.#select = sources[2];
        this.#select.volume = 0.4;

        this.#confirm = sources[3];
        this.#confirm.volume = 0.4;

        this.#no = sources[4];
        this.#no.volume = 0.6;

        AudioManager.onSEVolumeChange.Add(vol => {
            this.se.volume = 0.6 * vol;
            this.#select.volume = 0.4 * vol;
            this.#confirm.volume = 0.4 * vol;
            this.#no.volume = 0.6 * vol;
        });
    }

    PlayBGM (name)
    {
        this.#clipName = `audio/bgm/${name}`;

        Resources.DontDestroyOnLoad(this.#clipName);

        this.bgm.clip = Resources.Find(this.#clipName);
        this.bgm.Play();
    }

    StopBGM ()
    {
        this.bgm.Stop();
        Resources.DestroyOnLoad(this.#clipName);

        this.#clipName = null;
    }

    PlaySE (name)
    {
        this.se.PlayOneShot(Resources.Find(`audio/se/${name}`));
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