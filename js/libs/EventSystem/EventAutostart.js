class EventAutostart extends GameBehavior
{
    event = null;

    Awake ()
    {
        if (this.event != null) EventSystem.Run(this.event);
    }
}