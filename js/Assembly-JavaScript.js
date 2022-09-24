class testGB extends GameBehavior
{
    constructor () { super(); }
    
    Start ()
    {
        console.log("Start");
        Application.gl.clearColor(0.25, 0.25, 0.25, 1.0);
    }
}