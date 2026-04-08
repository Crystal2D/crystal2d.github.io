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

    #localBgVol = 1;
    #bgFadeDuration = 0;
    #bgFadeTime = 0;

    #clipName = null;
    #select = null;
    #confirm = null;
    #no = null;

    get #bgFadeVol ()
    {
        return (this.#bgFadeDuration - this.#bgFadeTime) / this.#bgFadeDuration || 1;
    }

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

        const sources = this.GetComponents(AudioSource);
        
        this.bgm = sources[0];

        AudioManager.onBGMVolumeChange.Add(vol => this.bgm.volume = this.#localBgVol * this.#bgFadeVol * vol);

        const seVol = 0.01 * AudioManager.seVolume;

        this.se = sources[1];
        this.se.volume = 0.6 * seVol;

        // Yes these are separate sources
        // just to replicate how RPG Maker MV does "AudioManager.playStaticSe"
        this.#select = sources[2];
        this.#select.volume = 0.6 * seVol;

        this.#confirm = sources[3];
        this.#confirm.volume = 0.6 * seVol;

        this.#no = sources[4];
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
        if (this.#bgFadeTime >= this.#bgFadeDuration) return;

        this.#bgFadeTime += Time.deltaTime;
        this.bgm.volume = this.#localBgVol * this.#bgFadeVol * 0.01 * AudioManager.bgmVolume;

        if (this.#bgFadeTime < this.#bgFadeDuration) return;

        this.StopBGM();
        this.#bgFadeDuration = 0;
        this.#bgFadeTime = 0;
    }

    async PlayBGM (name, volume, pitch)
    {
        this.#localBgVol = volume ?? 1;
        this.bgm.volume = this.#localBgVol * this.#bgFadeVol * 0.01 * AudioManager.bgmVolume;
        this.bgm.pitch = pitch ?? 1;

        if (name === this.#clipName) return;

        this.#clipName = name;
        Resources.DontDestroyOnLoad(`audio/bgm/${this.#clipName}`);

        this.bgm.clip = Resources.Find(`audio/bgm/${this.#clipName}`);
        this.bgm.Play();
    }

    FadeOutBGM (duration)
    {
        if (this.#bgFadeDuration > 0) return;

        this.#bgFadeDuration = duration;
    }

    StopBGM ()
    {
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