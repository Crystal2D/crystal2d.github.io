class Animator extends GameBehavior
{
    #renderer = null;
    #ctrl = null;

    get controller ()
    {
        return this.#ctrl;
    }

    set controller (value)
    {
        this.#ctrl = value;

        this.#ctrl.renderer = this.#renderer;

        if (this.#renderer != null) this.#ctrl.Start();
    }

    Start ()
    {
        this.#renderer = this.GetComponent("SpriteRenderer");

        this.#ctrl.renderer = this.#renderer;
        this.#ctrl.Start();
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
}