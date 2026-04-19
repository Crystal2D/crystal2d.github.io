/*

Plugin that adds a simple FPS meter.

Version : 1.3f - Raw


Copyright (c) 2025 Desert Lake

Licensed under MIT (https://github.com/crystal2d/extras/blob/main/LICENSE.md)

*/


/**
 * Class for managing the meter.
 * 
 * @public
 * @static
 * @class
 */
class FPSMeter
{
    // Private Static Properties

    static #enabled = false;
    static #ms = false;
    static #more = false;
    static #time = 0;
    static #duration = 0.5;
    static #sum = 0;
    static #count = 0;

    static #text = null;
    static #low = null;
    static #high = null;


    // Static Properties

    /**
     * Enables/disables the meter display.
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @type {boolean}
     */
    static get enabled ()
    {
        return this.#enabled;
    }

    /**
     * Enables/disables the meter display.
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @type {boolean}
     */
    static set enabled (value)
    {
        this.SetActive(value);
    }

    /**
     * When true, milliseconds are displayed rather than FPS.
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @type {boolean}
     */
    static get msMode ()
    {
        return this.#ms;
    }

    /**
     * When true, milliseconds are displayed rather than FPS.
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @type {boolean}
     */
    static set msMode (value)
    {
        this.#ms = value;
        this.#time = this.#duration;
    }

    /**
     * Whether to display more details like the min and max. 
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @type {boolean}
     */
    static get detailed ()
    {
        return this.#more;
    }

    /**
     * Whether to display more details like the min and max. 
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @type {boolean}
     */
    static set detailed (value)
    {
        this.#more = value;
        this.#time = this.#duration;
    }

    /**
     * The time in seconds it takes to update and calculate the meter.
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @type {number}
     */
    static get duration ()
    {
        return this.#duration;
    }

    /**
     * The time in seconds it takes to update and calculate the meter.
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @type {number}
     */
    static set duration (value)
    {
        this.#duration = value;
        this.#time = value;
    }


    // Static Methods

    static #EvalFPS (time)
    {
        return parseInt(1 / (time || Time.maximumDeltaTime));
    }

    static #EvalMS (time)
    {
        return parseInt((time || Time.maximumDeltaTime) * 1e3);
    }

    /**
     * Enables/disables the meter display.
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @method
     * 
     * @param {boolean} state - New state to take.
     */
    static SetActive (state)
    {
        if (state === this.#enabled) return;

        if (this.#text == null)
        {
            this.#text = document.createElement("div");

            this.#text.style.position = "absolute";
            this.#text.style.background = "#000000b3";
            this.#text.style.margin = "4px";
            this.#text.style.fontSize = "16px";
            this.#text.style.padding = "8px";
            this.#text.style.whiteSpace = "pre-wrap";

            document.body.append(this.#text);

            Application.unloading.Add(() => FPSMeter.enabled = false);
        }
        else this.#text.style.display = state ? "block" : "none";

        if (state) this.#time = this.#duration;

        this.#enabled = state;
    }

    /**
     * Updates the meter and its values.
     * 
     * @memberof FPSMeter
     * 
     * @public
     * @static
     * @method
     */
    static Update ()
    {
        this.#sum += Time.unscaledDeltaTime;
        this.#count++;

        this.#low = this.#low == null ? Time.unscaledDeltaTime : Math.max(this.#low, Time.unscaledDeltaTime);
        this.#high = this.#high == null ? Time.unscaledDeltaTime : Math.min(this.#high, Time.unscaledDeltaTime);

        if (this.#time < this.#duration)
        {
            this.#time += Time.unscaledDeltaTime;
            
            return;
        }

        this.#time = 0;

        if (!this.#enabled) return;

        const time = this.#sum / this.#count;
        this.#sum = 0;
        this.#count = 0;

        const low = this.#low;
        const high = this.#high;
        this.#low = null;
        this.#high = null;

        if (this.#ms)
        {
            if (this.#more) this.#text.textContent = `ms @ ${this.#duration}s\nAve: ${this.#EvalMS(time)}\nLow: ${this.#EvalMS(low)}\nHigh: ${this.#EvalMS(high)}`;
            else this.#text.textContent = `ms  ${this.#EvalMS(time)}`;

            return;
        }
        
        if (this.#more) this.#text.textContent = `FPS @ ${this.#duration}s\nAve: ${this.#EvalFPS(time)}\nLow: ${this.#EvalFPS(low)}\nHigh: ${this.#EvalFPS(high)}`;
        else this.#text.textContent = `FPS ${this.#EvalFPS(time)}`;
    }
}