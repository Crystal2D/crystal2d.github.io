class Interactable
{
    pos = Vector2.zero;
    event = null;

    async Invoke ()
    {
        await EventSystem.Run(this.event);
    }
}