class Test extends GameBehavior
{
    Awake ()
    {
        SceneManager.Load(1);

        this.DontDestroyOnLoad(this, ["sprites/title"]);
    }

    Update ()
    {
        if (Input.GetKeyDown(KeyCode.Z)) SceneManager.SetActiveScene(1);
    }
}