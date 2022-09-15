class testGB extends GameBehavior
{
    constructor () { super(); }
    
    Start ()
    {
        console.log("Start");
        Application.gl.clearColor(0.4, 0.4, 0.4, 1.0);
    }
}