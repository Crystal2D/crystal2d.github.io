class Interactable
{
    // 0: Key
    // 1: Touch
    trigger = 0;
    
    pos = Vector2.zero;
    conditions = [];

    event = null;

    get isEnabled ()
    {
        for (let i = 0; i < this.conditions.length; i++)
        {
            if (!this.conditions[i].Check()) return false;
        }

        return true;
    }

    async Invoke ()
    {
        if (this.event == null) return;

        return EventSystem.Run(this.event);
    }
}