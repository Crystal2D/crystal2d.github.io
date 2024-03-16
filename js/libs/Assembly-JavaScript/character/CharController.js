class CharController extends RPGMovement
{
    #tertriaryInput = false;
    #xTime = 0;
    #yTime = 0;

    Update ()
    {
        this.#GetInput();

        super.Update();
    }

    _OnMovementGet ()
    {
        const input = new Vector2(
            +Input.GetKey(KeyCode.ArrowRight) - +Input.GetKey(KeyCode.ArrowLeft),
            +Input.GetKey(KeyCode.ArrowUp) - +Input.GetKey(KeyCode.ArrowDown)
        );

        if (input.x !== 0) this.#xTime++;
        else if (this.#xTime !== 0) this.#xTime = 0;

        if (input.y !== 0) this.#yTime++;
        else if (this.#yTime !== 0) this.#yTime = 0;

        if (Vector2.Abs(input).Equals(Vector2.one))
        {
            if (this.#xTime > this.#yTime) input.x = 0;
            else input.y = 0;
        }

        this.MoveTowards(input);

        this.speedScale = this.#tertriaryInput ? 2 : 1;
    }

    #GetInput ()
    {
        this.#tertriaryInput = Input.GetKey(KeyCode.Shift);
    }
}


// class CharController extends GameBehavior
// {
//     #sprites = [];
//     #input = Vector2.zero;
    
//     #renderer = null;
    
//     speed = 1;
//     speedScale = 1;
    
//     #SetSprite (direction)
//     {
//         if (direction.Equals(Vector2.zero)) return;
        
//         const values = [
//             Vector2.down,
//             Vector2.left,
//             Vector2.right,
//             Vector2.up
//         ]
        
//         let index = 0;
        
//         for (let i = 0; i < 4; i++)
//         {
//             if (!direction.Equals(values[i])) continue;
            
//             index = i + 1;
            
//             break;
//         }
        
//         this.#renderer.sprite = this.#sprites[index];
//     }
    
//     Start ()
//     {
//         const sprites = Resources.Find("sprites/characters/yoki").sprites;
        
//         for (let i = 0; i < sprites.length; i++)
//         {
//             const sprite = sprites[i].Duplicate();
            
//             this.#sprites[i] = sprite;
//         }
        
//         this.#renderer = this.GetComponent("SpriteRenderer");
//     }
    
//     FixedUpdate ()
//     {
//         const movement = Vector2.Scale(this.#input, this.speed * this.speedScale * Time.fixedDeltaTime);
       
//         this.transform.position = Vector2.Add(this.transform.position, movement);
//     }
    
//     Update ()
//     {
//         this.#input = new Vector2(
//             +Input.GetKey(KeyCode.ArrowRight) - +Input.GetKey(KeyCode.ArrowLeft),
//             +Input.GetKey(KeyCode.ArrowUp) - +Input.GetKey(KeyCode.ArrowDown)
//         );
//         this.speedScale = Input.GetKey(KeyCode.Shift) ? 2 : 1;
        
//         if (this.#input.abs.Equals(Vector2.one)) this.#input.y = 0;
        
//         this.#SetSprite(this.#input);
//     }
// }