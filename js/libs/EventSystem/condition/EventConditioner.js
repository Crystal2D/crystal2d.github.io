class EventConditioner extends GameBehavior
{
    conditions = [];

    Awake ()
    {
        let met = true;

        for (let i = 0; i < this.conditions.length; i++)
        {
            if (this.conditions[i].Check()) continue;

            met = false;

            break;
        }

        if (!met) this.gameObject.SetActive(false);
    }
}