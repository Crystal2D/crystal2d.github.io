class Behavior extends Component
{
    enabled = true;
    
    get isActiveAndEnabled ()
    {
        return this.gameObject.activeSelf && this.enabled;
    }
}