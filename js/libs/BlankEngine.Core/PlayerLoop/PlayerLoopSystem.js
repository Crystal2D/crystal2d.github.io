class PlayerLoopSystem
{
    name = "";
    loopConditionFunction = () => { return true; };
    subSystemList = [];
    updateDelegate = () => { };
    updateFunction = () => {
        if (!this.loopConditionFunction()) return;
        
        this.updateDelegate();
        
        const subSystems = this.subSystemList;
        
        for (let i = 0; i < subSystems.length; i++) subSystems[i].updateFunction();
    };
    
    constructor (name, data)
    {
        this.name = name;
        
        const dat = data ?? { };
        
        if (dat.loopConditionFunction != null) this.loopConditionFunction = dat.loopConditionFunction;
        if (dat.subSystemList != null) this.subSystemList = dat.subSystemList;
        if (dat.updateDelegate != null) this.updateDelegate = dat.updateDelegate;
        if (dat.updateFunction != null) this.updateFunction = dat.updateFunction;
    }
}