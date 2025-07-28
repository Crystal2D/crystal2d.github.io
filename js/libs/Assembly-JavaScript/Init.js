class Init extends GameBehavior
{
    Awake ()
    {
        Loader.ReadyLoader();
        Loader.Ready(2);
        Loader.Switch(2);
    }
}