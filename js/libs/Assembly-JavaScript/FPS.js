class FPS extends GameBehavior
{
    #time = 0;

    #text = null;
    
    constructor () { super(); }
    
    Start ()
    {
        this.#text = this.GetComponent("Text");
    }
    
    Update ()
    {
        if (this.#time < 0.5)
        {
            this.#time += Time.deltaTime;
            
            return;
        }
        
        this.#time = 0;
        
        const fps = Math.min(
            parseInt(1 / (Time.deltaTime || Time.maximumDeltaTime)),
            Application.targetFrameRate
        );

        console.log(fps);
        
        this.#text.text = `${fps}`;
    }
}