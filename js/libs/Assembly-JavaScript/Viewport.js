class Viewport extends GameBehavior
{
    constructor () { super(); }

    Start ()
    {
        Crispixels.effect = true;
    }

    Update ()
    {
        if (Input.GetKeyDown(KeyCode.F4)) Window.fullScreen = !Window.fullScreen;
    }
}