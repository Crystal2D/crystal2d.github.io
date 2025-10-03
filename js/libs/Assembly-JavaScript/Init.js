class Init extends GameBehavior
{
    Awake ()
    {
        FPSMeter.detailed = true;

        Loader.ReadyLoader();
        Loader.Ready(2);
        Loader.Switch(2);
    }
}