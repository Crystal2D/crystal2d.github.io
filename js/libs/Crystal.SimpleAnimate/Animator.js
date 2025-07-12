class Animator extends GameBehavior
{
    controller = null;
    
    Update ()
    {
        this.controller?.Update(this.gameObject);
    }

    LateUpdate ()
    {
        if (this.controller == null) return;

        const triggers = this.controller.parameters.filter(item => item.type === AnimatorControllerParameterType.Trigger);

        for (let i = 0; i < triggers.length; i++)
        {
            if (triggers[i].value && triggers[i].value === triggers[i].lastTriggerState) triggers[i].value = false;

            triggers[i].lastTriggerState = triggers[i].value;
        }
    }

    #GetParam (name, type)
    {
        return this.controller.parameters.find(item => item.name === name && item.type === type);
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
        const output = new Animator();

        output.controller = this.controller.Duplicate();

        return output;
    }
}