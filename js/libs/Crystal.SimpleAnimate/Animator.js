class Animator extends GameBehavior
{
    #ctrl = null;

    speed = 1;

    get parameters ()
    {
        return this.#ctrl.parameters.map(item => item.Duplicate());
    }

    constructor (ctrl)
    {
        super();

        this.#ctrl = ctrl;
        ctrl.animator = this;
    }

    Awake ()
    {
        this.#ctrl.gameObject = this.gameObject;
    }
    
    Update ()
    {
        this.#ctrl?.Update();
    }

    LateUpdate ()
    {
        if (this.#ctrl == null) return;

        const triggers = this.#ctrl.parameters.filter(item => item.type === AnimatorControllerParameterType.Trigger);

        for (let i = 0; i < triggers.length; i++)
        {
            if (triggers[i].value && triggers[i].value === triggers[i].lastTriggerState) triggers[i].value = false;

            triggers[i].lastTriggerState = triggers[i].value;
        }
    }

    #GetParam (name, type)
    {
        return this.#ctrl.parameters.find(item => item.name === name && item.type === type);
    }

    GetBool (name)
    {
        return this.#GetParam(name, AnimatorControllerParameterType.Bool).value;
    }

    GetNumber (name)
    {
        return this.#GetParam(name, AnimatorControllerParameterType.Number).value;
    }

    SetBool (name, value)
    {
        this.#GetParam(name, AnimatorControllerParameterType.Bool).value = value;
    }

    SetNumber (name, value)
    {
        this.#GetParam(name, AnimatorControllerParameterType.Number).value = value;
    }

    SetTrigger (name)
    {
        this.#GetParam(name, AnimatorControllerParameterType.Trigger).value = true;
    }

    Duplicate ()
    {
        return new Animator(this.#ctrl.Duplicate());
    }
}