class MapTransfer
{
    static last = null;

    scene = 0;
    min = Vector2.zero;
    max = Vector2.zero;
    pos = Vector2.zero;
    conditions = [];

    get isEnabled ()
    {
        for (let i = 0; i < this.conditions.length; i++)
        {
            if (!this.conditions[i].Check()) return false;
        }

        return true;
    }
}