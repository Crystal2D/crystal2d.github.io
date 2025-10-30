class PlayerLoop
{
    static #loaded = false;
    static #playing = false;
    static #focused = false;
    static #callUpdate = false;
    static #crashed = false;
    static #noRAF = false;
    static #quitState = 0;

    static noFixedUpdate = false;
    static onBeforeAwake = new DelegateEvent();
    static onAfterFixedUpdate = new DelegateEvent();
    static onAfterUpdate = new DelegateEvent();
    static onAfterMeshUpdate = new DelegateEvent();
    static onFrameEnd = new DelegateEvent();

    static get #supportsScheduler ()
    {
        return scheduler != null;
    }

    static get isPlaying ()
    {
        return this.#playing;
    }
    
    static #RequestUpdate ()
    {
        const vsyncCall = callback => {
            if (this.#noRAF) setTimeout(callback, 0);
            else requestAnimationFrame(callback);
        };

        if (Application.targetFrameRate === 0 || Application.vSyncCount === 1) vsyncCall(this.#Update.bind(this));
        else if (Application.vSyncCount === 2) vsyncCall(() => vsyncCall(this.#Update.bind(this)));
        else if (Application.targetFrameRate === -1 || !this.#supportsScheduler) setTimeout(this.#Update.bind(this), 0);
        else scheduler.postTask(this.#Update.bind(this));
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
    
    static async #Update (vsyncTime)
    {
        if (vsyncTime > 0 && this.#noRAF) return;

        if (!this.#loaded && !Application.isLoaded)
        {
            Application.Load();
            
            this.#loaded = true;
        }
        
        if (!Application.isLoaded && !Application.isUnloaded)
        {
            this.#focused = Application.isFocused;

            this.#RequestUpdate();

            return;
        }


        // Initialization
        // SetLoopData
        const activeScene = SceneManager.GetActiveScene();
        const gameObjs = activeScene.gameObjects;

        const BroadcastMessage = (method, params, data) => {
            if (this.#crashed || !SceneManager.active) return;

            for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage(method, params, data);
        };
        
        // PlayerStart
        if (this.#playing)
        {
            Object.InstantiationQueue.Invoke();
            Object.InstantiationQueue.RemoveAll();
            Object.InstantiationIDs = [];

            // ScriptRunBehaviorAwake
            this.onBeforeAwake.Invoke();
            BroadcastMessage("Awake", null, {
                specialCall : 1,
                passActive : true,
                clearAfter : true
            });

            // ScriptRunBehaviorOnEnable
            BroadcastMessage("OnEnable", null, {
                specialCall : 2,
                passActive : true
            });

            // ScriptRunBehaviorStart
            BroadcastMessage("Start", null, { clearAfter : true });
        }


        // TimeUpdate
        if (Application.targetFrameRate > 0 && Application.vSyncCount === 0)
        {
            const slice = (1 / Application.targetFrameRate) - (+!this.#supportsScheduler * 5e-3);
                    
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
            if (!this.#crashed && this.#playing && Time.timeScale !== 0)
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
            Input.Update();

            // ScriptRunBehaviorEarlyUpdate
            if (this.#playing && Time.timeScale !== 0) BroadcastMessage("EarlyUpdate");
        }


        // FixedUpdate
        if (!this.noFixedUpdate) while (Time.fixedTime < Time.time)
        {
            Time.fixedUnscaledDeltaTime = (1e-3 * performance.now()) - Time.fixedUnscaledTime;
            Time.fixedUnscaledTime += Time.fixedUnscaledDeltaTime;
            
            Time.fixedTime += Time.fixedDeltaTime * Time.timeScale;
            
            // ScriptRunBehaviorFixedUpdate
            if (this.#playing && Time.timeScale !== 0)
            {
                BroadcastMessage("FixedUpdate");
                this.onAfterFixedUpdate.Invoke();
            }
        }


        if (!this.#callUpdate)
        {
            this.#RequestUpdate();

            return
        }


        // Update
        (() => {
            // ScriptRunBehaviorUpdate
            if (this.#playing && Time.timeScale !== 0)
            {
                BroadcastMessage("Update");
                this.onAfterUpdate.Invoke();
            }
        })();


        // PreLateUpdate
        (() => {
            // ScriptRunBehaviorLateUpdate
            if (this.#playing && Time.timeScale !== 0) BroadcastMessage("LateUpdate");

            // UpdateAllRenderers
            if (!this.#crashed && this.#playing && Time.timeScale !== 0)
            {
                const renderers = GameObject.FindComponents("Renderer");
                        
                for (let i = 0; i < renderers.length; i++) if (renderers[i].meshChanged) renderers[i].ForceMeshUpdate();

                this.onAfterMeshUpdate.Invoke();
                
                const cameras = GameObject.FindComponents("Camera");
                            
                for (let i = 0; i < cameras.length; i++) cameras[i].Render();
                            
                Application.gl.flush();
            }
        })();


        // PostLateUpdate
        (() => {
            // InputEndFrame
            Input.End();


            // ScriptRunBehaviorOnApplicationPause
            const playing = Application.isFocused || Application.runInBackground;

            if (this.#playing != playing) BroadcastMessage("OnApplicationPause", !playing);


            // ScriptRunBehaviorOnApplicationFocus
            const focused = Application.isFocused;

            if (this.#focused != focused)
            {
                this.#focused = focused;

                BroadcastMessage("OnApplicationFocus", focused);
            }

            
            // ScriptRunBehaviorOnApplicationQuit
            if (!Application.isPlaying && this.#quitState === 0)
            {
                for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("OnApplicationQuit");

                try {
                    if (Application.wantsToQuit.Invoke().includes(false)) Application.CancelQuit();
                }
                catch { }
            }

            // ApplicationVerifyQuit
            if (!Application.isPlaying && this.#quitState === 0) this.#quitState = 1;

            // DecommissionStart
            if (this.#quitState === 1)
            {
                for (let i = 0; i < gameObjs.length; i++) GameObject.Destroy(gameObjs[i]);

                Application.quitting.Invoke();
            }

            // ScriptRunBehaviorOnDisable
            for (let i = 0; i < gameObjs.length; i++)
            {
                if (gameObjs[i].destroying) gameObjs[i].SetActive(false);

                gameObjs[i].BroadcastMessage("OnDisable", null, {
                    specialCall : 3,
                    passActive : true
                });
            }
    
            // ScriptRunBehaviorOnDestroy
            const tree = activeScene.tree;
            const deadGameObjs = gameObjs.filter(item => item.destroying);
    
            for (let i = 0; i < deadGameObjs.length; i++)
            {
                deadGameObjs[i].BroadcastMessage("OnDestroy", { passActive : true });
    
                tree.Remove(deadGameObjs[i]);
    
                const index = activeScene.gameObjects.indexOf(deadGameObjs[i]);
    
                activeScene.gameObjects.splice(index, 1);
            }
    
            // ApplicationQuit
            if (this.#quitState === 1)
            {
                Application.Unload();
            
                this.#quitState = 2;
                window.close();
            
                return;
            }


            this.onFrameEnd.Invoke();


            this.#playing = playing;
            this.#callUpdate = false;
        })();


        this.#RequestUpdate();
    }

    static OnError ()
    {
        if (this.#crashed) return;

        this.#crashed = true;

        Application.vSyncCount = 1;

        this.#RequestUpdate();
    }

    static Init ()
    {
        if (this.#loaded) return;

        setInterval(() => {
            if (this.#noRAF === !Application.isFocused) return;

            this.#noRAF = !Application.isFocused;

            if (Application.vSyncCount > 0 && this.#noRAF) this.#RequestUpdate();
        }, 0);

        if (Application.isInElectron) window.addEventListener("beforeunload", event => {
            if (this.#quitState === 2) return;
            
            event.preventDefault();
            Application.Quit();
        });
        
        this.#RequestUpdate();
    }
}