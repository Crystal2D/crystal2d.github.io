class PlayerLoop
{
    static #loaded = false;
    static #loop = [];
    
    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static async #Update ()
    {
        if (!this.#loaded && !Application.isLoaded)
        {
            Application.Load();
            
            this.#loaded = true;
        }
        
        if (!Application.isLoaded)
        {
            this.#RequestUpdate();

            return;
        }
        
        const systems = this.#loop;
        
        for (let i = 0; i < systems.length; i++) systems[i].updateFunction();
        
        this.#RequestUpdate();
    }
    
    static Init ()
    {
        if (this.#loaded) return;
        
        let callUpdate = false;
        let quitState = 0;
        let gameObjs = [];

        let activeScene = null;
        
        this.#loop = [
            new PlayerLoopSystem("Initialization", {
                subSystemList : [
                    new PlayerLoopSystem("SetLoopData", {
                        updateDelegate : () =>
                        {
                            activeScene = SceneManager.GetActiveScene();
                            gameObjs = activeScene.gameObjects;
                        }
                    }),
                    new PlayerLoopSystem("PlayerStart", {
                        loopConditionFunction : () => document.hasFocus(),
                        subSystemList : [
                            new PlayerLoopSystem("ScriptRunBehaviorAwake", {
                                updateDelegate : () => {
                                    for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("Awake", null, {
                                        specialCall : 0,
                                        clearAfter : true
                                    });
                                }
                            }),
                            new PlayerLoopSystem("ScriptRunBehaviorOnEnable", {
                                updateDelegate : () => {
                                    for (let i = 0; i < gameObjs.length; i++)gameObjs[i].BroadcastMessage("OnEnable", null, { specialCall : 1 });
                                }
                            }),
                            new PlayerLoopSystem("ScriptRunBehaviorStart", {
                                updateDelegate : () => {
                                    for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("Start", null, { clearAfter : true });
                                }
                            })
                        ]
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
                loopConditionFunction : () => callUpdate,
                subSystemList : [
                    new PlayerLoopSystem("UpdateMainGameViewRect", {
                        loopConditionFunction : () => document.hasFocus() && Time.timeScale !== 0,
                        updateDelegate : () => {
                            const gl = Application.gl;

                            gl.viewport(0, 0, Application.htmlCanvas.width, Application.htmlCanvas.height);

                            const cameras = GameObject.FindComponents("Camera");
                            const color = cameras[cameras.length - 1].backgroundColor;
                            
                            gl.clearColor(color.r, color.g, color.b, color.a);
                            gl.clear(gl.COLOR_BUFFER_BIT);
                            gl.enable(gl.BLEND);
                            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                        }
                    }),
                    new PlayerLoopSystem("UpdateInputManager", {
                        loopConditionFunction : () => document.hasFocus() && Time.timeScale !== 0,
                        updateDelegate : () => Input.Update()
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
                        loopConditionFunction : () => document.hasFocus() && Time.timeScale !== 0,
                        updateDelegate : () => {
                            for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("FixedUpdate");
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
                            for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("Update");
                        }
                    })
                ]
            }),
            new PlayerLoopSystem("PreLateUpdate", {
                loopConditionFunction : () => callUpdate,
                subSystemList : [
                    new PlayerLoopSystem("ScriptRunBehaviorLateUpdate", {
                        loopConditionFunction : () => document.hasFocus() && Time.timeScale !== 0,
                        updateDelegate : () => {
                            for (let i = 0; i < gameObjs.length; i++) gameObjs[i].BroadcastMessage("LateUpdate");
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
                        loopConditionFunction : () => document.hasFocus() && Time.timeScale !== 0,
                        updateDelegate : () => {
                            const dynamicRenderers = GameObject.FindComponents("DynamicRenderer");
                            
                            for (let i = 0; i < dynamicRenderers.length; i++)
                            {
                                if (dynamicRenderers[i].meshChanged) dynamicRenderers[i].ForceMeshUpdate();
                            }
                            
                            const cameras = GameObject.FindComponents("Camera");
                            
                            for (let i = 0; i < cameras.length; i++) cameras[i].Render();
                            
                            Application.gl.flush();
                        }
                    }),
                    new PlayerLoopSystem("InputEndFrame", {
                        updateDelegate : () => Input.End()
                    }),
                    new PlayerLoopSystem("PlayerEnd", {
                        loopConditionFunction : () => document.hasFocus() && Time.timeScale !== 0,
                        subSystemList : [
                            new PlayerLoopSystem("ScriptRunBehaviorOnApplicationQuit", {
                                loopConditionFunction : () => quitState === 2,
                                updateDelegate : () => {
                                    for (let i = 0; i < gameObjs.length; i++)
                                    {
                                        gameObjs[i].BroadcastMessage("OnApplicationQuit");

                                        GameObject.Destroy(gameObjs[i]);
                                    }

                                    Application.quitting.Invoke();
                                }
                            }),
                            new PlayerLoopSystem("ScriptRunBehaviorOnDisable", {
                                updateDelegate : () => {
                                    for (let i = 0; i < gameObjs.length; i++)
                                    {
                                        if (gameObjs[i].destroying) gameObjs[i].SetActive(false);

                                        gameObjs[i].BroadcastMessage("OnDisable", null, {
                                           passActive : true,
                                           specialCall : 2
                                        });
                                    }
                                }
                            }),
                            new PlayerLoopSystem("ScriptRunBehaviorOnDestroy", {
                                updateDelegate : () => {
                                    const tree = activeScene.tree;
                                    const gameObjs = activeScene.gameObjects.filter(item => item.destroying);

                                    for (let i = 0; i < gameObjs.length; i++)
                                    {
                                        gameObjs[i].BroadcastMessage("OnDestroy");

                                        tree.Remove(gameObjs[i]);

                                        const index = activeScene.gameObjects.indexOf(gameObjs[i]);

                                        activeScene.gameObjects.splice(index, 1);
                                    }
                                }
                            }),
                            new PlayerLoopSystem("ApplicationQuit", {
                                updateDelegate : () => {
                                    if (quitState === 2)
                                    {
                                        Application.Unload();
                                    
                                        window.close();
                                    
                                        return;
                                    }
                                
                                    if (!Application.isPlaying)
                                    {
                                        Application.wantsToQuit.Invoke();
                                        
                                        quitState = 1;
                                    }
                                
                                    if (quitState === 1)
                                    {
                                        if (Application.isPlaying) quitState = 0;
                                        else quitState++;
                                    }
                                }
                            }),
                        ]
                    })
                ]
            })
        ];
        
        this.#RequestUpdate();
    }
}