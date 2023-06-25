class charController extends GameBehavior
{
    #input = new Vector2();
    #zoom = 0;
    #halt = 0;
    
    speed = 1;
    
    constructor () { super(); }
    
    Start ()
    {
        console.log("Start");
        crispixels.effect = true;
        Application.gl.clearColor(0.25, 0.25, 0.25, 1);
    }
    
    FixedUpdate ()
    {
        const speed = this.speed * (this.#zoom > 0 ? 10 : 1) * Time.fixedDeltaTime;
       
        this.transform.position.x += this.#input.x * speed;
        this.transform.position.y += this.#input.y * speed;
    }
    
    Update ()
    {
        if (this.#zoom <= 0)
        {
            this.#input = new Vector2(
                +Input.GetKey(KeyCode.ArrowRight) - +Input.GetKey(KeyCode.ArrowLeft),
                +Input.GetKey(KeyCode.ArrowUp) - +Input.GetKey(KeyCode.ArrowDown)
            );
            
            if (!this.#input.Equals(Vector2.zero) && this.#halt <= 0 && Input.GetKeyDown(KeyCode.Shift)) this.#zoom = 0.125;
            
            if (this.#zoom > 0) this.gameObject.components[1].material = Resources.Find("materials/mat_invert");
        }
        else
        {
            if (this.#zoom - Time.deltaTime <= 0) this.#halt = 2;
            
            this.#zoom -= Time.deltaTime;
        }
        
        if (this.#halt > 0)
        {
            if (this.#halt - Time.deltaTime <= 0) this.gameObject.components[1].material = new Material();
            
            this.#halt -= Time.deltaTime;
        }
    }
}