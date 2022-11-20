class testGB extends GameBehavior
{
    speed = new Vector2();
    minClamp = new Vector2();
    maxClamp = new Vector2();
    
    constructor () { super(); }
    
    Start ()
    {
        console.log("Start");
        crispixels.effect = true;
        Application.gl.clearColor(0.25, 0.25, 0.25, 1.0);
    }
    
    Update ()
    {
        const oldPos = this.gameObject.transform.position;
        
        let newPos = new Vector2(oldPos.x + (this.speed.x * Time.deltaTime), oldPos.y + (this.speed.y * Time.deltaTime));
        
        if (newPos.x < this.minClamp.x) newPos.x = this.maxClamp.x;
        else if (newPos.x > this.maxClamp.x) newPos.x = this.minClamp.x;
        
        if (newPos.y < this.minClamp.y) newPos.y = this.maxClamp.y;
        else if (newPos.y > this.maxClamp.y) newPos.y = this.minClamp.y;
        
        this.gameObject.transform.position = newPos;
    }
}