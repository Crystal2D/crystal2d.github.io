class Test extends Viewport
{
    #iter = 5000;
    #area = 500;
    #sizeMin = 0.5;
    #sizeMax = 4;
    #speed = 18;
    #scale = 0;
    #scaleDelta = 0
    #scaleSpeed = 50;
    #scaleMin = 0;
    #scaleMax = 550;
    #t = 0.5;
    
    #input = Vector2.zero;
    
    #camera = null;
    
    constructor () { super(); }
    
    #Rand (min, max)
    {
        return Math.random() * (max - min) + min;
    }

    Start ()
    {
        super.Start();

        Window.resizable = true;
        Window.fillWindow = true;

        Window.SetTitle("DEP - Loading Environment (0)");

        this.#camera = this.GetComponent("Camera");

        this.#camera.r = GameObject.FindByID(69420);
        
        this.#scaleMin = this.#camera.orthographicSize;
        this.#scale = this.#scaleMin;
        
        const sprite = Resources.Find("sprites/square").sprites[0];
        const area = this.#area * 0.5;
        
        let objs = [];
        
        for (let i = 1; i <= this.#iter; i++)
        {
            const renderer = new SpriteRenderer(sprite.Duplicate());
            
            renderer.color = new Color(
                Math.random(),
                Math.random(),
                Math.random()
            );
            
            const transform = new Transform();
            
            transform.position = new Vector2(
                this.#Rand(-area, area),
                this.#Rand(-area, area)
            );
            transform.scale = new Vector2(
                this.#Rand(this.#sizeMin, this.#sizeMax),
                this.#Rand(this.#sizeMin, this.#sizeMax)
            )
            
            const obj = new GameObject(
                "",
                [renderer],
                true,
                transform,
                i
            );
            
            objs.push(obj);

            const bounds = new Bounds(transform.position, transform.scale);
            const min = bounds.min;
            const max = bounds.max;

            const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

            this.#camera.tree.Insert(obj, rect);

            if (i % 10 === 0) Window.SetTitle(`DEP - Loading Environment (${i}/5000)`);
        }
        
        SceneManager.GetActiveScene().gameObjects.push(...objs);
    }
    
    FixedUpdate ()
    {
        if (this.#scaleDelta !== 0)
        {
            this.#scale = Math.Clamp(
                this.#scale + this.#scaleDelta * this.#scaleSpeed * Time.fixedDeltaTime,
                this.#scaleMin,
                this.#scaleMax
            );
            
            this.#camera.orthographicSize = this.#scale;
        }
        
        const movement = Vector2.Scale(this.#input, (this.#scale / this.#scaleMin) * this.#speed * Time.fixedDeltaTime);
       
        this.transform.position = Vector2.Add(this.transform.position, movement);

        if (this.#t < 0.5)
        {
            this.#t += Time.fixedDeltaTime;
            
            return;
        }
        
        this.#t = 0;

        const useQuad = this.#camera.useQuad;

        Window.SetTitle(`DEP - ${useQuad ? "Optimally" : "Linearly"} Rendered (${this.#camera.counter}/${useQuad ? this.#camera.tree.count : 5000})`);
    }
    
    Update ()
    {
        super.Update();

        this.#input = new Vector2(
            +Input.GetKey(KeyCode.ArrowRight) - +Input.GetKey(KeyCode.ArrowLeft),
            +Input.GetKey(KeyCode.ArrowUp) - +Input.GetKey(KeyCode.ArrowDown)
        );
        
        this.#scaleDelta = +Input.GetKey(KeyCode.Z) - +Input.GetKey(KeyCode.X);
    }
}