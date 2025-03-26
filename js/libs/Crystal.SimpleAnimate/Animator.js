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

    #GetParam (name, type)
    {
        return this.#ctrl.parameters.find(item => item.name === name && item.type === type);
    }

    GetBool (name)
    {
        const param = this.#GetParam(name, 0);

        if (param.value == null) param.value = param.defaultBool;

        return param.value;
    }

    GetNumber (name)
    {
        const param = this.#GetParam(name, 1);

        if (param.value == null) param.value = param.defaultNumber;

        return param.value;
    }

    SetBool (name, value)
    {
        this.#GetParam(name, 0).value = value;
    }

    SetNumber (name, value)
    {
        this.#GetParam(name, 1).value = value;
    }

    SetTrigger (name, value)
    {
        this.#GetParam(name, 2).value = value;
    }
}