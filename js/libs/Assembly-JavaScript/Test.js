class Test extends GameBehavior
{
    #a = null;

    Start ()
    {
        this.#a = GameObject.Find("obj").GetComponent("Animator");
    }

    Update ()
    {
        this.#a.SetBool("turn", Input.GetKey(KeyCode.Z));
    }
}