class FPSMeter
{
    static #enabled = false;
    static #ms = false
    static #time = 0;

    static #text = null;

    static get enabled ()
    {
        return this.#enabled;
    }

    static set enabled (value)
    {
        this.SetActive(value);
    }

    static get msMode ()
    {
        return this.#ms;
    }

    static set msMode (value)
    {
        this.#ms = value;

        this.#time = 0.5;
    }

    static SetActive (state)
    {
        if (state === this.#enabled) return;

        if (this.#text == null)
        {
            this.#text = document.createElement("div");

            this.#text.style.position = "absolute";
            this.#text.style.background = "#ffffff7f";
            this.#text.style.margin = "4px";
            this.#text.style.fontSize = "20px";
            this.#text.style.minWidth = "67px";
            this.#text.style.height = "24px";
            this.#text.style.padding = "8px 6px";
            this.#text.style.whiteSpace = "pre-wrap";

            document.body.append(this.#text);
        }
        else this.#text.style.display = state ? "block" : "none";

        if (state) this.#time = 0.5;

        this.#enabled = state;
    }

    static Update ()
    {
        if (!this.#enabled) return;

        if (this.#time < 0.5)
        {
            this.#time += Time.deltaTime;
            
            return;
        }
        
        this.#time = 0;

        if (this.#ms)
        {
            const ms = parseInt(
                Math.max(
                    (Time.deltaTime || Time.maximumDeltaTime),
                    1 / Application.targetFrameRate
                ) * 1000
            );
            
            this.#text.textContent = `ms  ${ms}`;

            return;
        }
        
        const fps = Math.min(
            parseInt(1 / (Time.deltaTime || Time.maximumDeltaTime)),
            Application.targetFrameRate
        );
        
        this.#text.textContent = `FPS ${fps}`;
    }
}