class Viewport extends GameBehavior
{
    #fps = 0;

    Awake ()
    {
        Crispixels.effect = true;
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
        if (Input.GetKeyDown(KeyCode.F4) || GamepadInput.GetKeyDown(KeyCode.Start)) Window.fullscreen = !Window.fullscreen;
    }

    LateUpdate ()
    {
        if (Options.resolution === 4)
        {
            if (window.innerWidth < window.innerHeight)
            {
                const sizer = (window.innerWidth - window.innerWidth % 480) / 480;

                Window.SetResolution(480 * sizer, 432 * sizer);
            }
            else
            {
                const sizer = (window.innerHeight - window.innerHeight % 432) / 432;

                Window.SetResolution(480 * sizer, 432 * sizer);
            }
        }

        FPSMeter.Update();
    }
}