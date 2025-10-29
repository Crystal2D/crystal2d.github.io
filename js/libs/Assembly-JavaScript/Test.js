class Test extends GameBehavior
{
    #box = null;

    Start ()
    {
        Crispixels.effect = true;
        this.#box = this.GetComponent("ItsABox");
        this.#box.AddChoice()
    }

    Update ()
    {
        if (Input.GetMouseButtonDown(0)) this.#box.Toggle();
    }
}