class AudioSource extends Behavior
{
    static instances = [];

    #becameActive = false;
    #playing = false;
    #paused = false;
    #started = false;
    #mute = false;
    #pausedByUnfocus = false;
    #volume = 1;
    #pitch = 1;
    #time = 0;
    #seekTime = 0;
    #onParamUpdate = new DelegateEvent();

    #context = null;
    #source = null;
    #sourceOld = null;
    #gain = null;
    #clip = null;
    #scheduledPlay = null;

    playOnAwake = false;
    loop = false;

    get clip ()
    {
        return this.#clip;
    }

    set clip (value)
    {
        this.#clip = value;

        this.Stop();
    }

    get volume ()
    {
        return this.#gain.gain.value;
    }

    set volume (value)
    {
        this.#volume = Math.Clamp(value, 0, 1);

        this.#UpdateVolume();
    }
    
    get mute ()
    {
        return this.#mute;
    }
    
    set mute (value)
    {
        this.#mute = value;
        
        this.#UpdateVolume();
    }

    get time ()
    {
        return this.#time + AudioSettings.latency;
    }

    set time (value)
    {
        this.Pause();
        this.#seekTime = value;
        this.UnPause();
    }

    get timeSamples ()
    {
        return parseInt(this.time * AudioSettings.outputSampleRate);
    }

    set timeSamples (value)
    {
        this.Pause();
        this.#seekTime = value / AudioSettings.outputSampleRate;
        this.UnPause();
    }

    get isPlaying ()
    {
        return this.#playing && this.#started;
    }

    get pitch ()
    {
        return this.#pitch;
    }

    set pitch (value)
    {
        this.#pitch = Math.Clamp(value, -3, 3);

        this.#onParamUpdate.Invoke();

        if (this.#source != null) this.#source.playbackRate.value = this.#pitch;
    }

    constructor ()
    {
        super();

        this.#context = AudioSettings.GetContext();
        
        this.#gain = this.#context.createGain();
        this.#gain.connect(this.#context.destination);

        AudioSource.instances.push(this);
    }

    #UpdateVolume ()
    {
        if (this.#mute) return this.#gain.gain.value = 0;
        
        this.#gain.gain.value = this.#volume;

        this.#onParamUpdate.Invoke();
    }

    Update ()
    {
        if (!PlayerLoop.isPlaying && this.#playing)
        {
            this.#pausedByUnfocus = true;

            this.Pause();
        }
        
        if (PlayerLoop.isPlaying && this.#pausedByUnfocus)
        {
            this.#pausedByUnfocus = false;

            this.UnPause();
        }

        if (this.#sourceOld != null)
        {
            this.#sourceOld.stop();
            this.#sourceOld.disconnect();
            this.#sourceOld = null;
        }

        if (this.#scheduledPlay != null && AudioSettings.dspTime + AudioSettings.latency >= this.#scheduledPlay)
        {
            this.Play();

            this.#scheduledPlay = null;
        }

        if (this.#started)
        {
            this.#time += AudioSettings.dspDeltaTime * this.#pitch;

            if (this.time >= this.#clip.length)
            {
                this.#sourceOld = this.#source;
                this.#source = null;

                this.Stop();

                if (this.loop) this.Play();
            }

            return;
        }

        if (this.playOnAwake && !this.#becameActive)
        {
            this.Play();

            this.#becameActive = true;
        }

        if (this.#playing && !this.#started)
        {
            this.#source = this.#context.createBufferSource();
            this.#source.connect(this.#gain);
            this.#source.buffer = this.#clip.GetData();
            this.#source.playbackRate.value = this.#pitch;
            this.#source.start(0, this.#seekTime);

            this.#time = this.#seekTime;
            this.#seekTime = 0;
            this.#started = true;
        }
    }

    Play ()
    {
        this.Stop();

        this.#playing = true;
    }

    PlayScheduled (time)
    {
        this.#scheduledPlay = time;
    }

    PlayDelayed (delay)
    {
        this.#scheduledPlay = AudioSettings.dspTime + delay;

        console.log(this.#scheduledPlay);
    }

    Pause ()
    {
        if (this.#paused || !this.#playing || !this.#started) return;

        if (this.#source != null)
        {
            this.#source.stop();
            this.#source.disconnect();
        }

        this.#seekTime = this.#time;
        this.#started = false;
        this.#playing = false;
        this.#paused = true;
    }
    
    UnPause ()
    {
        if (!this.#paused || this.#playing || this.#started) return;

        this.#playing = true;
        this.#paused = false;
    }

    Stop ()
    {
        this.Pause();

        this.#seekTime = 0;
        this.#paused = false;
    }

    PlayOneShot (clip, volumeScale)
    {
        const gain = this.#context.createGain();
        gain.connect(this.#context.destination);

        const source = this.#context.createBufferSource();
        source.connect(gain);
        source.buffer = clip.GetData();

        const updateParams = () => {
            gain.gain.value = this.volume * Math.max(volumeScale ?? 1, 0);
            source.playbackRate.value = this.#pitch;
        };
        updateParams();
        this.#onParamUpdate.Add(updateParams);

        source.onended = () => {
            this.#onParamUpdate.Remove(updateParams);

            source.disconnect();
            gain.disconnect();
        };
        source.start();
    }

    Duplicate ()
    {
        const output = new AudioSource();

        output.clip = this.clip;
        output.playOnAwake = this.playOnAwake;
        output.loop = this.loop;
        output.volume = this.volume;
        output.mute = this.mute;
        output.pitch = this.pitch;

        return output;
    }
}