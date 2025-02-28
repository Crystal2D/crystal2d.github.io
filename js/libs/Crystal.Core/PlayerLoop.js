class PlayerLoop
{
    static #loaded = false;
    static #callUpdate = false;
    static #quitState = 0;
    
    static #RequestUpdate ()
    {
        if (Application.targetFrameRate === 0 || Application.vSyncCount === 1) requestAnimationFrame(this.#Update.bind(this));
        else if (Application.vSyncCount === 2) requestAnimationFrame(() => requestAnimationFrame(this.#Update.bind(this)));
        else setTimeout(this.#Update.bind(this), 0);
    }

    static #TimeUpdateBase ()
    {
        Time.unscaledDeltaTime = (1e-3 * performance.now()) - Time.unscaledTime;
        Time.unscaledTime += Time.unscaledDeltaTime;
        
        let deltaT = Time.unscaledDeltaTime;
        
        if (deltaT > Time.maximumDeltaTime) deltaT = Time.maximumDeltaTime;
        
        Time.deltaTime = deltaT * Time.timeScale;
        Time.time += Time.deltaTime;
        
        Time.frameCount++;
        
        this.#callUpdate = true;
    }
    
    static async #Update ()
    {
        if (!this.#loaded && !Application.isLoaded)
        {
            Application.Load();
            
            this.#loaded = true;
        }
        
        if (!Application.isLoaded && !Application.isUnloaded)
        {
            this.#RequestUpdate();

            return;
        }


        // Initialization
        // SetLoopData
        const activeScene = SceneManager.GetActiveScene();
        const gameObjs = activeScene.gameObjects;
        
        // PlayerStart
        if (document.hasFocus())
        {
            // ScriptRunBehaviorAwake
            for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("Awake", null, {
                specialCall : 1,
                clearAfter : true
            });

            // ScriptRunBehaviorOnEnable
            for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("OnEnable", null, { specialCall : 2 });

            // ScriptRunBehaviorStart
            for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("Start", null, { clearAfter : true });
        }


        // TimeUpdate
        if (Application.targetFrameRate > 0 && Application.vSyncCount === 0)
        {
            const slice = (1 / Application.targetFrameRate) - 5e-3;
                    
            let accumulator = (1e-3 * performance.now()) - Time.unscaledTime;
        
            while (accumulator >= slice)
            {
                this.#TimeUpdateBase();
            
                accumulator -= slice;
            }
        }
        else this.#TimeUpdateBase();


        // EarlyUpdate
        if (this.#callUpdate)
        {
            // UpdateMainGameViewRect
            if (document.hasFocus() && Time.timeScale !== 0)
            {
                const gl = Application.gl;

                gl.viewport(0, 0, Application.htmlCanvas.width, Application.htmlCanvas.height);

                const cameras = GameObject.FindComponents("Camera");

                if (cameras.length > 0)
                {
                    const color = cameras[cameras.length - 1].backgroundColor;

                    gl.clearColor(color.r, color.g, color.b, color.a);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.enable(gl.BLEND);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                }
            }

            // UpdateInputManager
            if (document.hasFocus() && Time.timeScale !== 0) Input.Update();
        }


        // FixedUpdate
        while (Time.fixedTime < Time.time)
        {
            Time.fixedUnscaledDeltaTime = (1e-3 * performance.now()) - Time.fixedUnscaledTime;
            Time.fixedUnscaledTime += Time.fixedUnscaledDeltaTime;
            
            Time.fixedTime += Time.fixedDeltaTime * Time.timeScale;
            
            // ScriptRunBehaviorFixedUpdate
            if (document.hasFocus() && Time.timeScale !== 0)
            {
                for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("FixedUpdate");
            }
        }


        // Update
        if (this.#callUpdate)
        {
            // ScriptRunBehaviorUpdate
            if (document.hasFocus() && Time.timeScale !== 0)
            {
                for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("Update");
            }
        }


        // PreLateUpdate
        if (this.#callUpdate)
        {
            // ScriptRunBehaviorLateUpdate
            if (document.hasFocus() && Time.timeScale !== 0)
            {
                for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("LateUpdate");
            }
        }


        // PostLateUpdate
        if (this.#callUpdate)
        {
            this.#callUpdate = false;

            // UpdateAllRenderers
            if (document.hasFocus() && Time.timeScale !== 0)
            {
                const renderers = GameObject.FindComponents("Renderer");
                        
                for (let i = 0; i < renderers.length; i++)
                {
                    if (renderers[i].meshChanged) renderers[i].ForceMeshUpdate();
                }
                
                const cameras = GameObject.FindComponents("Camera");
                            
                for (let i = 0; i < cameras.length; i++) cameras[i].Render();
                            
                Application.gl.flush();
            }

            // InputEndFrame
            Input.End();

            // PlayerEnd
            if (document.hasFocus() && Time.timeScale !== 0)
            {
                // ScriptRunBehaviorOnApplicationQuit
                if (this.#quitState === 2)
                {
                    for (let i = 0; i < gameObjs.length; i++)
                    {
                        gameObjs[i].BroadcastMessage("OnApplicationQuit");

                        GameObject.Destroy(gameObjs[i]);
                    }

                    Application.quitting.Invoke();
                }

                // ScriptRunBehaviorOnDisable
                for (let i = 0; i < gameObjs.length; i++)
                {
                    if (gameObjs[i].destroying) gameObjs[i].SetActive(false);
                    
                    gameObjs[i].BroadcastMessage("OnDisable", null, {
                        passActive : true,
                        specialCall : 3
                    });
                }
    
                // ScriptRunBehaviorOnDestroy
                const tree = activeScene.tree;
                const deadGameObjs = gameObjs.filter(item => item.destroying);
    
                for (let i = 0; i < deadGameObjs.length; i++)
                {
                    deadGameObjs[i].BroadcastMessage("OnDestroy");
    
                    tree.Remove(deadGameObjs[i]);
    
                    const index = activeScene.gameObjects.indexOf(deadGameObjs[i]);
    
                    activeScene.gameObjects.splice(index, 1);
                }
    
                // ApplicationQuit
                if (this.#quitState === 2)
                {
                    Application.Unload();
                
                    window.close();
                
                    return;
                }
            
                if (!Application.isPlaying)
                {
                    Application.wantsToQuit.Invoke();
                    
                    this.#quitState = 1;
                }
            
                if (this.#quitState === 1)
                {
                    if (Application.isPlaying) this.#quitState = 0;
                    else this.#quitState++;
                }
            }
        }

        
        this.#RequestUpdate();
    }

    static Init ()
    {
        if (this.#loaded) return;
        
        this.#RequestUpdate();
    }
}