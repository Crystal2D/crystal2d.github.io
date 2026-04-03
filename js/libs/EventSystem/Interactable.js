class Interactable
{
    pos = Vector2.zero;
    event = null;

    async Invoke ()
    {
        if (this.event == null) return;

        await EventSystem.Run(this.event);
    }
}