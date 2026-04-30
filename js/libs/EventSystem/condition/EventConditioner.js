class EventConditioner extends GameBehavior
{
    conditions = [];

    Awake ()
    {
        EventSystem.onUpdate.Add(() => this.#Process());
        this.#Process();
    }

    #Process ()
    {
        let met = true;

        for (let i = 0; i < this.conditions.length; i++)
        {
            if (this.conditions[i].Check()) continue;

            met = false;

            break;
        }

        this.gameObject.SetActive(met);
    }
}