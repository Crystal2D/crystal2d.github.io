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
    
    Update (gameObject, animator) { }

    Start (gameObject, animator) { }

    End (gameObject, animator) { }

    Duplicate () { }
}