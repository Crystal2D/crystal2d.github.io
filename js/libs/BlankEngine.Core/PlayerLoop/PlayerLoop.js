class PlayerLoop
{
    static #loadedApp = false;
    static #loop = [];
    
    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static async #Update ()
    {
        if (!this.#loadedApp && !Application.isLoaded)
        {
            Application.Load();
            
            this.#loadedApp = true;
        }
        
        if (!Application.isLoaded || !SceneManager.GetActiveScene().isLoaded) return this.#RequestUpdate();
        
        const systems = this.#loop;
        
        for (let i = 0; i < systems.length; i++) systems[i].updateFunction();
        
        this.#RequestUpdate();
    }
    
    static Init ()
    {
        if (this.#loadedApp) return;
        
        let callUpdate = false;
        
        this.#loop = [
            new PlayerLoopSystem("Initialization", {
                subSystemList : [
                    new PlayerLoopSystem("ScriptRunBehaviorStart", {
                        loopConditionFunction : () => {
                            return document.hasFocus();
                        },
                        updateDelegate : () => {
                            for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++) SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("Start", null, { clearAfter : true });
                        }
                    })
                ]
            }),
            new PlayerLoopSystem("TimeUpdate", {
                updateFunction : function () {
                    const slice = (1 / Application.targetFrameRate) - 5e-3;
                    
                    let accumulator = (1e-3 * performance.now()) - Time.unscaledTime;
                    
                    while (accumulator >= slice)
                    {
                        Time.unscaledDeltaTime = (1e-3 * performance.now()) - Time.unscaledTime;
                        Time.unscaledTime += Time.unscaledDeltaTime;
                        
                        let deltaT = Time.unscaledDeltaTime;
                        
                        if (deltaT > Time.maximumDeltaTime) deltaT = Time.maximumDeltaTime;
                        
                        Time.deltaTime = deltaT * Time.timeScale;
                        Time.time += Time.deltaTime;
                        
                        Time.frameCount += Time.timeScale;
                        
                        this.updateDelegate();
                        
                        const subSystems = this.subSystemList;
                        
                        for (let i = 0; i < subSystems.length; i++) subSystems[i].updateFunction();
                        
                        accumulator -= slice;
                    }
                },
                updateDelegate : () => {
                    callUpdate = true;
                }
            }),
            new PlayerLoopSystem("EarlyUpdate", {
                loopConditionFunction : () => {
                    return callUpdate;
                },
                subSystemList : [
                    new PlayerLoopSystem("UpdateMainGameViewRect", {
                        loopConditionFunction : () => {
                            return document.hasFocus() && Time.timeScale !== 0;
                        },
                        updateDelegate : () => {
                            Application.gl.viewport(0, 0, Application.htmlCanvas.width, Application.htmlCanvas.height);
                            Application.gl.clear(Application.gl.COLOR_BUFFER_BIT | Application.gl.DEPTH_BUFFER_BIT);
                            Application.gl.enable(Application.gl.BLEND);
                            Application.gl.blendFunc(Application.gl.SRC_ALPHA, Application.gl.ONE_MINUS_SRC_ALPHA);
                        }
                    }),
                    new PlayerLoopSystem("UpdateInputManager", {
                        loopConditionFunction : () => {
                            return document.hasFocus() && Time.timeScale !== 0;
                        },
                        updateDelegate : () => {
                            Input.Update();
                        }
                    })
                ]
            }),
            new PlayerLoopSystem("FixedUpdate", {
                updateFunction : function () {
                    const fixedSlice = Time.fixedDeltaTime;
                    
                    while (Time.fixedTime < Time.time)
                    {
                        Time.fixedUnscaledDeltaTime = (1e-3 * performance.now()) - Time.fixedUnscaledTime;
                        Time.fixedUnscaledTime += Time.fixedUnscaledDeltaTime;
                        
                        Time.fixedTime += Time.fixedDeltaTime * Time.timeScale;
                        
                        const subSystems = this.subSystemList;
                        
                        for (let i = 0; i < subSystems.length; i++) subSystems[i].updateFunction();
                    }
                },
                subSystemList : [
                    new PlayerLoopSystem("ScriptRunBehaviorFixedUpdate", {
                        loopConditionFunction : () => {
                            return document.hasFocus() && Time.timeScale !== 0;
                        },
                        updateDelegate : () => {
                            for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++) SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("FixedUpdate");
                        }
                    })
                ]
            }),
            new PlayerLoopSystem("Update", {
                loopConditionFunction : () => {
                    return callUpdate;
                },
                subSystemList : [
                    new PlayerLoopSystem("ScriptRunBehaviorUpdate", {
                        loopConditionFunction : () => {
                            return document.hasFocus() && Time.timeScale !== 0;
                        },
                        updateDelegate : () => {
                            for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++) SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("Update");
                        }
                    })
                ]
            }),
            new PlayerLoopSystem("PreLateUpdate", {
                loopConditionFunction : () => {
                    return callUpdate;
                },
                subSystemList : [
                    new PlayerLoopSystem("ScriptRunBehaviorLateUpdate", {
                        loopConditionFunction : () => {
                            return document.hasFocus() && Time.timeScale !== 0;
                        },
                        updateDelegate : () => {
                            for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++) SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("LateUpdate");
                        }
                    })
                ]
            }),
            new PlayerLoopSystem("PostLateUpdate", {
                loopConditionFunction : () => {
                    if (!callUpdate) return false;
                    
                    callUpdate = false;
                    
                    return true;
                },
                subSystemList : [
                    new PlayerLoopSystem("UpdateAllRenderers", {
                        loopConditionFunction : () => {
                            return document.hasFocus() && Time.timeScale !== 0;
                        },
                        updateDelegate : () => {
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
                    }),
                    new PlayerLoopSystem("UpdateAllRenderers", {
                        loopConditionFunction : () => {
                            return document.hasFocus() && Time.timeScale !== 0;
                        },
                        updateDelegate : () => {
                            Application.gl.flush();
                        }
                    }),
                    new PlayerLoopSystem("InputEndFrame", {
                        updateDelegate : () => {
                            Input.End();
                        }
                    })
                ]
            })
        ];
        
        this.#RequestUpdate();
    }
}