class MapInit extends GameBehavior
{
    Awake ()
    {
        Loader.Ready(4);

        const transfer = new MapTransfer();
        transfer.pos = new Vector2(2, -3);
        MapTransfer.last = transfer;

        const switchCall = () => {
            Loader.onSwitchEnd.Remove(switchCall);
            Transitioner.instance.TintOut(() => Player.instance.avoidInputs = false);
        };
        Loader.onSwitchEnd.Add(switchCall);

        Loader.Switch(4);
    }
}