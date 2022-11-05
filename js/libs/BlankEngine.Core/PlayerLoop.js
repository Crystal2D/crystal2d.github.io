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
        
        const docFocus = document.hasFocus();
        
        if (docFocus) this.Start();
        
        const slice = (1 / Application.targetFrameRate) - 0.005;
        
        let accumulator = (performance.now() / 1000) - Time.unscaledTime;
        
        while (accumulator >= slice)
        {
            Time.unscaledDeltaTime = (performance.now() / 1000) - Time.unscaledTime;
            Time.unscaledTime += Time.unscaledDeltaTime;
            
            let deltaT = Time.unscaledDeltaTime;
            
            if (deltaT > Time.maximumDeltaTime) deltaT = Time.maximumDeltaTime;
            
            Time.deltaTime = deltaT * Time.timeScale;
            Time.time += Time.deltaTime;
            
            if (docFocus)
            {
                this.Update();
                
                if (Time.timeScale != 0) Time.frameCount++;
            }
            
            accumulator -= slice;
        }
        
        if (docFocus) this.Render();
        
        this.#requestUpdate();
    }
    
    static init ()
    {
        this.#requestUpdate();
    }
    
    static Start ()
    {
        for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++)
        {
            SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("Start", null, { clearAfter : true });
        }
    }
    
    static Update ()
    {
        for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++)
        {
            if (Time.timeScale != 0) SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("Update");
        }
    }
    
    static Render ()
    {
        Application.gl.viewport(0, 0, Application.htmlCanvas.width, Application.htmlCanvas.height);
        Application.gl.clear(Application.gl.COLOR_BUFFER_BIT | Application.gl.DEPTH_BUFFER_BIT);
        Application.gl.enable(Application.gl.BLEND);
        Application.gl.blendFunc(Application.gl.SRC_ALPHA, Application.gl.ONE_MINUS_SRC_ALPHA);
        
        for (let iA = 0; iA < SceneManager.GetActiveScene().gameObjects.length; iA++)
        {
            const cameras = SceneManager.GetActiveScene().gameObjects[iA].GetComponents("Camera");
            
            for (let iB = 0; iB < cameras.length; iB++)
            {
                cameras[iB].Render();
            }
        }
        
        Application.gl.flush();
    }
}