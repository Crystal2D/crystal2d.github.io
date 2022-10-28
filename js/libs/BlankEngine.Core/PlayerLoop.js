class PlayerLoop
{
    static #loadedApp = false;
    
    static #requestUpdate ()
    {
        requestAnimationFrame(this.#update.bind(this));
    }
    
    static async #update ()
    {
        if (!this.#loadedApp && !Application.isLoaded)
        {
            Application.Load();
            
            this.#loadedApp = true;
        }
        
        if (!Application.isLoaded || !SceneManager.GetActiveScene().isLoaded) return this.#requestUpdate();
        
        this.Start();
        
        await this.Update();
        
        this.Render();
        
        this.#requestUpdate();
    }
    
    static init ()
    {
        this.#requestUpdate();
    }
    
    static async Start ()
    {
        for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++)
        {
            if (document.hasFocus()) SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("Start", null, { clearAfter : true });
        }
    }
    
    static async Update ()
    {
        var accumulator = (performance.now() / 1000) - Time.unscaledTime;
        
        while (accumulator >= 1 / Application.targetFrameRate)
        {
            Time.unscaledDeltaTime = (performance.now() / 1000) - Time.unscaledTime;
            Time.unscaledTime += Time.unscaledDeltaTime;
            
            var deltaT = Time.unscaledDeltaTime;
            
            if (deltaT > Time.maximumDeltaTime) deltaT = Time.maximumDeltaTime;
            
            Time.deltaTime = deltaT * Time.timeScale;
            Time.time += Time.deltaTime;
            
            for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++)
            {
                if (Time.timeScale != 0 && document.hasFocus()) SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("Update");
            }
            
            if (Time.timeScale != 0 && document.hasFocus()) Time.frameCount++;
            
            accumulator -= 1 / Application.targetFrameRate;
        }
    }
    
    static Render ()
    {
        if (!document.hasFocus()) return;
        
        Application.gl.viewport(0, 0, Application.htmlCanvas.width, Application.htmlCanvas.height);
        Application.gl.clear(Application.gl.COLOR_BUFFER_BIT | Application.gl.DEPTH_BUFFER_BIT);
        Application.gl.enable(Application.gl.BLEND);
        Application.gl.blendFunc(Application.gl.SRC_ALPHA, Application.gl.ONE_MINUS_SRC_ALPHA);
        
        for (let iA = 0; iA < SceneManager.GetActiveScene().gameObjects.length; iA++)
        {
            let cameras = SceneManager.GetActiveScene().gameObjects[iA].GetComponents("Camera");
            
            for (let iB = 0; iB < cameras.length; iB++)
            {
                if (document.hasFocus()) cameras[iB].Render();
            }
        }
        
        Application.gl.flush();
    }
}