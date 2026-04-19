class Behavior extends Component
{
    #enabled = true;

    get enabled ()
    {
        return this.#enabled;
    }

    set enabled (value)
    {
        this.#enabled = value;
    }
    
    get isActiveAndEnabled ()
    {
        return this.gameObject.activeSelf && this.enabled;
    }
}