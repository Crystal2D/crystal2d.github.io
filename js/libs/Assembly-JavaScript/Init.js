class Init extends GameBehavior
{
    async Awake ()
    {
        GameWindow.Center();

        FPSMeter.detailed = true;
        Cursor.visible = false;

        if (Application.isMobilePlatform) Options.resolution = 4;
        else Crispixels.effect = true;

        Loader.ReadyLoader();
        Loader.Ready(2);

        await RPGSave.Init();

        await Options.Load();

        await LocaleManager.Set("en_US");

        Loader.Switch(2);
    }
}