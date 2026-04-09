class EventCondition
{
    // 0: Switch
    // 1: Variable
    type = 0;

    name = "";

    // If Switch, then
    // 0: false
    // 1: true
    threshold = 0;

    Check ()
    {
        if (this.type === 0) return +EventSystem.GetSwitch(this.name) === this.threshold;

        return EventSystem.GetVariable(this.name) >= this.threshold; 
    }
}