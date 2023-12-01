class TextLookup extends GameBehavior
{
    #i = 1;
    #sprites = [];
    
    #renderer = null;
    
    constructor () { super(); }
    
    Start ()
    {
        this.#sprites = Resources.Find("font_main").texture.sprites;
        
        this.#renderer = this.GetComponent("SpriteRenderer");
        
        this.#UpdateSprite();
    }
    
    Update ()
    {
        const end = this.#sprites.length - 1;
        
        if (Input.GetKeyDown(KeyCode.Z))
        {
            if (this.#i === 1) this.#i = end;
            else this.#i--;
        }
        else if (Input.GetKeyDown(KeyCode.X))
        {
            if (this.#i === end) this.#i = 1;
            else this.#i++;
        }
        else return;
        
        this.#UpdateSprite();
    }
    
    #UpdateSprite ()
    {
        this.#renderer.sprite = this.#sprites[this.#i];
    }
}
