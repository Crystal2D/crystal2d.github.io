class Camera extends Behavior
{
    useQuad = false;
    counter = 0;
    tree = new QuadTree();

    #updateProjMat = true;
    
    #projMatrix = null;
    
    orthographicSize = 1;
    
    get bounds ()
    {
        const size = this.orthographicSize;
        
        return new Bounds(
            this.transform.localPosition,
            new Vector2(
                Window.aspect * size,
                1 * size
            )
        );
    }
    
    get projectionMatrix ()
    {
        return this.#projMatrix;
    }
    
    set projectionMatrix (value)
    {
        this.#updateProjMat = false;
        
        this.projMatrix = value;
    }

    get cameraToWorldMatrix ()
    {
        return this.transform.localToWorldMatrix
    }
    
    get worldToCameraMatrix ()
    {
        return this.transform.worldToLocalMatrix;
    }
    
    constructor ()
    {
        super();
    }
    
    Render ()
    {
        const camM = this.worldToCameraMatrix;
        
        if (this.#updateProjMat) this.#projMatrix = Matrix3x3.Ortho(0, this.orthographicSize, 0, this.orthographicSize);
        
        const mScale = new Vector2(1 / Window.aspect, -1);
        
        const transM = Matrix3x3.TRS(mScale, 0, mScale);

        if (Input.GetKeyDown(KeyCode.F1)) this.useQuad = !this.useQuad;

        if (this.useQuad)
        {
            const min = this.bounds.min;
            const max = this.bounds.max;
            const camRect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

            const objs = this.tree.Find(camRect);

            this.counter = objs.length;

            for (let i = 0; i < objs.length; i++)
            {
                let renderer = objs[i].GetComponent("Renderer");

                const lWM = renderer.localToWorldMatrix;

                const renM = Matrix3x3.Multiply(
                    Matrix3x3.Multiply(
                        Matrix3x3.Multiply(transM, this.#projMatrix),
                        camM,
                    ),
                    lWM
                );
                    
                renderer.localSpaceMatrix = renM;
                renderer.Render();
            }
        }
        else
        {
            this.counter = 0;

            const renderers = GameObject.FindComponents("Renderer");
            
            for (let i = 0; i < renderers.length; i++)
            {
                if (!this.bounds.Intersects(renderers[i].bounds)) continue;

                this.counter++;

                const lWM = renderers[i].localToWorldMatrix;

                const renM = Matrix3x3.Multiply(
                    Matrix3x3.Multiply(
                        Matrix3x3.Multiply(transM, this.#projMatrix),
                        camM,
                    ),
                    lWM
                );
                    
                renderers[i].localSpaceMatrix = renM;
                renderers[i].Render();
            }
        }
    }
}