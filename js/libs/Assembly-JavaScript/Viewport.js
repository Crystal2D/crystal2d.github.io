class Viewport extends GameBehavior
{
    static current = null;
    
    #fps = 0;

    Awake ()
    {
        Viewport.current = this;
    }

    Update ()
    {
        if (Input.GetKeyDown(KeyCode.F2) || GamepadInput.GetKeyDown(KeyCode.Select))
        {
            this.#fps++;

            if (this.#fps === 3) this.#fps = 0;

            switch (this.#fps)
            {
                case 0:
                    FPSMeter.enabled = false;
                    FPSMeter.msMode = false;
                    break;
                case 1:
                    FPSMeter.enabled = true;
                    break;
                case 2:
                    FPSMeter.msMode = true;
                    break;
            }
        }
        if (Input.GetKeyDown(KeyCode.F4) || GamepadInput.GetKeyDown(KeyCode.Start))
        {
            GameWindow.fullscreen = !GameWindow.fullscreen;
            Options.Save();
        }
    }

    LateUpdate ()
    {
        if (Options.resolution === 4)
        {
            const width = window.innerWidth * window.devicePixelRatio;
            const height = window.innerHeight * window.devicePixelRatio;
            const sizer = Math.max(width < height ? width / 480 : height / 432, 1);

            GameWindow.SetResolution(480 * sizer, 432 * sizer);
        }

        FPSMeter.Update();
    }
}