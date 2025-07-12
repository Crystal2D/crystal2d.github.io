class AnimatorNode
{
    transitions = [];

    get hasStarted ()
    {
        return false;
    }

    get hasEnded ()
    {
        return false;
    }

    get time ()
    {
        return 0;
    }

    get duration ()
    {
        return 0;
    }
    
    Update (gameObject) { }

    Start () { }

    End () { }

    Duplicate () { }
}