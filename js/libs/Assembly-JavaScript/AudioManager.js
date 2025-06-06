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

    #select = null;
    #confirm = null;
    #no = null;

    bgm = null;

    Start ()
    {
        AudioManager.instance = this;

        const sources = this.GetComponents("AudioSource");

        this.bgm = sources[0];
        this.bgm.volume = 0.24;

        AudioManager.onBGMVolumeChange.Add(vol => this.bgm.volume = 0.24 * vol);

        // Yes these are separate sources
        // just to replicate how RPG Maker MV does "AudioManager.playStaticSe"
        this.#select = sources[1];
        this.#select.volume = 0.4;

        this.#confirm = sources[2];
        this.#confirm.volume = 0.4;

        this.#no = sources[3];
        this.#no.volume = 0.6;

        AudioManager.onSEVolumeChange.Add(vol => {
            this.#select.volume = 0.4 * vol;
            this.#confirm.volume = 0.4 * vol;
            this.#no.volume = 0.6 * vol;
        });
    }

    PlayBGM (name)
    {
        this.bgm.clip = Resources.Find(`audio/bgm/${name}`);
        this.bgm.Play();
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