class Init extends GameBehavior
{
    async Awake ()
    {
        GameWindow.Center();

        FPSMeter.detailed = true;
        FPSMeter.enabled = true;
        Cursor.visible = false;

        Crispixels.effect = true;

        Loader.ReadyLoader();
        Loader.Ready(2);

        await RPGSave.Init();

        await Options.Load();

        await LocaleManager.Set("en_US");

        Loader.Switch(2);
    }
}