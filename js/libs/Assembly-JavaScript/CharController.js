class CharController extends GameBehavior
{
    #zoom = 0;
    #halt = 0;
    #sprites = [];
    
    #input = new Vector2();
    
    #renderer = null;
    
    speed = 1;
    
    constructor () { super(); }
    
    #SetSprite (direction)
    {
        if (direction.Equals(Vector2.zero)) return;
        
        const values = [
            Vector2.down,
            Vector2.left,
            Vector2.right,
            Vector2.up
        ]
        
        let index = 0;
        
        for (let i = 0; i < 4; i++)
        {
            if (!direction.Equals(values[i])) continue;
            
            index = i + 1;
            
            break;
        }
        
        this.#renderer.sprite = this.#sprites[index];
    }
    
    Start ()
    {
        const sprites = Resources.Find("sprites/characters/yoki").sprites;
        
        for (let i = 0; i < sprites.length; i++)
        {
            const sprite = sprites[i].Duplicate();
            
            if (this.#sprites.length === 0) this.#sprites[0] = sprite;
            else this.#sprites.push(sprite);
        }
        
        this.#renderer = this.GetComponent("SpriteRenderer");
    }
    
    FixedUpdate ()
    {
        const movement = Vector2.Scale(this.#input, this.speed * (this.#zoom > 0 ? 10 : 1) * Time.fixedDeltaTime);
       
        this.transform.position = Vector2.Add(this.transform.position, movement);
    }
    
    Update ()
    {
        if (this.#zoom <= 0)
        {
            this.#input = new Vector2(
                +Input.GetKey(KeyCode.ArrowRight) - +Input.GetKey(KeyCode.ArrowLeft),
                +Input.GetKey(KeyCode.ArrowUp) - +Input.GetKey(KeyCode.ArrowDown)
            );
            
            if (this.#input.abs.Equals(Vector2.one)) this.#input.y = 0;
            
            this.#SetSprite(this.#input);
            
            if (!this.#input.Equals(Vector2.zero) && this.#halt <= 0 && Input.GetKeyDown(KeyCode.Shift)) this.#zoom = 0.125;
            
            if (this.#zoom > 0) this.#renderer.material = Resources.Find("materials/mat_invert");
        }
        else
        {
            if (this.#zoom - Time.deltaTime <= 0) this.#halt = 2;
            
            this.#zoom -= Time.deltaTime;
        }
        
        if (this.#halt <= 0) return;
        
        if (this.#halt - Time.deltaTime <= 0) this.#renderer.material = new Material();
        
        this.#halt -= Time.deltaTime;
    }
}