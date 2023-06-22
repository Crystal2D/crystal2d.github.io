class testGB extends GameBehavior
{
    speed = 1;
    
    constructor () { super(); }
    
    Start ()
    {
        console.log("Start");
        crispixels.effect = true;
        Application.gl.clearColor(0.25, 0.25, 0.25, 1);
    }
    
    Update ()
    {
        const input = new Vector2(
            +Input.GetKey(KeyCode.ArrowRight) - +Input.GetKey(KeyCode.ArrowLeft),
            +Input.GetKey(KeyCode.ArrowUp) - +Input.GetKey(KeyCode.ArrowDown)
        );
        
        this.transform.position.x += input.x * this.speed * Time.deltaTime;
        this.transform.position.y += input.y * this.speed * Time.deltaTime;
    }
}