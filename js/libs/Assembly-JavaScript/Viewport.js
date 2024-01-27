class Viewport extends GameBehavior
{
    #fps = 0;

    constructor () { super(); }

    Start ()
    {
        Crispixels.effect = true;
    }

    Update ()
    {
        if (Input.GetKeyDown(KeyCode.F2))
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
        if (Input.GetKeyDown(KeyCode.F4)) Window.fullScreen = !Window.fullScreen;

        FPSMeter.Update();
    }
}