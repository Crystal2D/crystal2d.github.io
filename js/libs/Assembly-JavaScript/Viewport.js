class Viewport extends GameBehavior
{
    #fps = 0;

    Awake ()
    {
        Crispixels.effect = true;

        SceneManager.Load(0, 1, 2);
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
        
        if (Input.GetKeyDown(KeyCode.Z) || GamepadInput.GetKeyDown(KeyCode.SouthButton)) this.#AddScene(-1);
        else if (Input.GetKeyDown(KeyCode.X) || GamepadInput.GetKeyDown(KeyCode.EastButton)) this.#AddScene(1);

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