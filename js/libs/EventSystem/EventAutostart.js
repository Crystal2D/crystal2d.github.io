class EventAutostart extends GameBehavior
{
    event = null;

    Awake ()
    {
        EventSystem.Run(this.event);
    }
}