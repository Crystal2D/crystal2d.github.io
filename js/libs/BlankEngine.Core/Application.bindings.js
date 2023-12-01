Application.Bind(async () => {
    Debug.Set(BlankEngine.Inner.buildData.debugMode);
    
    await SceneManager.Load(0);
}, () => {
    Input.Terminate();
    // SceneManager.Unload();
    Resources.UnloadAll();
    
    Application.htmlCanvas.style.display = "none";
});