class Viewport extends GameBehavior
{
    #fps = 0;

    constructor () { super(); }

    Start ()
    {
        Crispixels.effect = true;

        SceneManager.Load(1, 2);
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
        
        if (Input.GetKeyDown(KeyCode.Z)) this.#AddScene(-1);
        else if (Input.GetKeyDown(KeyCode.X)) this.#AddScene(1);

        FPSMeter.Update();
    }

    #AddScene (i)
    {
        if (SceneManager.loadedSceneCount === 0) return;

        let index = this.gameObject.scene.index + i;

        index = Math.Clamp(index, 0, SceneManager.sceneCount - 1);
        
        SceneManager.SetActiveScene(index);
    }
}