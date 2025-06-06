HTMLUI.Button = class extends HTMLUI.Image
{
    #pressed = false;
    #pressedOld = false;

    registerSlide = false;

    get pressed ()
    {
        return this.#pressed;
    }

    get pressedDown ()
    {
        return this.#pressed && !this.#pressedOld;
    }

    get pressedUp ()
    {
        return !this.#pressed && this.#pressedOld;
    }

    Update ()
    {
        const touches = Input.touches;

        let pointerInBound = false;
        let pressedDown = false;
        let pressedUp = false;

        for (let i = 0; i < touches.length; i++)
        {
            const inBound = this.bounds.Contains(HTMLUI.ScreenToUIPoint(touches[i].position));

            if (!inBound) continue;

            pointerInBound = true;

            if (touches[i].phase === TouchPhase.Began)
            {
                pressedDown = true;

                break;
            }

            if (([TouchPhase.Ended, TouchPhase.Cancelled]).includes(touches[i].phase)) pressedUp = true;
            else if (this.registerSlide) pressedDown = true;
        }

        if (this.bounds.Contains(HTMLUI.ScreenToUIPoint(Input.mousePosition)))
        {
            pointerInBound = true;

            if (Input.GetMouseButtonDown(0) || (this.registerSlide && Input.GetMouseButton(0))) this.#pressed = true;
            else if (Input.GetMouseButtonUp(0)) this.#pressed = false;
        }

        if (pressedDown) this.#pressed = true;
        else if (pressedUp || !pointerInBound) this.#pressed = false;
    }

    UpdateEnd ()
    {
        this.#pressedOld = this.#pressed;
    }
}