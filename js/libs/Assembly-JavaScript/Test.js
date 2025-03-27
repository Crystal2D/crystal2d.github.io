class Test extends GameBehavior
{
    #animator = null;

    Start ()
    {
        this.#animator = this.GetComponent("Animator");
    }

    Update ()
    {
        if (Input.GetMouseButtonDown(0)) this.#animator.SetTrigger("toggle");
    }
}