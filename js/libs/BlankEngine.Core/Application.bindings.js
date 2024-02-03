Application.Bind(async () => {
    await SceneManager.Load(0);
}, () => {
    Input.Terminate();
    // SceneManager.Unload();
    Resources.UnloadAll();
    
    Application.htmlCanvas.style.display = "none";
});