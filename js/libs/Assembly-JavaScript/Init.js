class Init extends GameBehavior
{
    async Awake ()
    {
        FPSMeter.detailed = true;

        Loader.ReadyLoader();
        Loader.Ready(2);

        await RPGSave.Init();

        await Options.Load();

        await LocaleManager.Set("en_US");

        Loader.Switch(2);
    }
}