class EventCondition
{
    // 0: Switch
    // 1: Variable
    type = 0;

    equal = false;
    not = false;
    name = "";
    or = [];

    // If Switch, then
    // 0: false
    // 1: true
    threshold = 1;

    Check ()
    {
        let met = false;
        
        if (this.type === 0) met = +EventSystem.GetSwitch(this.name) === this.threshold;
        else if (this.equal) met = EventSystem.GetVariable(this.name) === this.threshold;
        else met = EventSystem.GetVariable(this.name) >= this.threshold;

        if (this.not) met = !met;

        if (met) return true;

        if (this.or.length === 0) return false;

        for (let i = 0; i < this.or.length; i++)
        {
            if (!this.or[i].Check()) return false;
        }

        return true;
    }
}