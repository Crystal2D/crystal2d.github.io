class Camera extends Behavior
{
    #updateProjMat = true;
    
    #projMatrix = null;
    
    orthographicSize = 9;
    backgroundColor = new Color();
    
    get bounds ()
    {
        const size = this.orthographicSize;
        
        return new Bounds(
            this.transform.position,
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
        
        this.#projMatrix = value;
    }

    get cameraToWorldMatrix ()
    {
        return this.transform.localToWorldMatrix
    }
    
    get worldToCameraMatrix ()
    {
        return this.transform.worldToLocalMatrix;
    }

    ScreenToWorldPoint (point)
    {
        const viewMat = Matrix3x3.TRS(
            Vector2.Scale(this.transform.position, new Vector2(1, -1)),
            5.555555555555556e-3 * -this.transform.rotation * Math.PI,
            this.bounds.size
        );
        const mouseMat = Matrix3x3.Translate(new Vector2(
            (point.x / Window.canvasWidth) - 0.5,
            (point.y / Window.canvasHeight) - 0.5
        ));
        const targetMat = Matrix3x3.Multiply(viewMat, mouseMat);

        return new Vector2(targetMat.GetValue(2, 0), -targetMat.GetValue(2, 1));
    }
    
    Render ()
    {
        const camM = this.worldToCameraMatrix;
        
        if (this.#updateProjMat) this.#projMatrix = Matrix3x3.Ortho(0, this.orthographicSize, 0, this.orthographicSize);
        
        const mScale = new Vector2(1 / Window.aspect, -1);
        
        const transM = Matrix3x3.TRS(mScale, 0, mScale);

        const min = this.bounds.min;
        const max = this.bounds.max;

        const objs = this.gameObject.scene.tree.Find(Rect.MinMaxRect(min.x, min.y, max.x, max.y));

        objs.sort((a, b) => a.GetComponent("Renderer").sortingOrder - b.GetComponent("Renderer").sortingOrder);
        if (SortingLayer.ids.length > 1) objs.sort((a, b) => SortingLayer.ids.indexOf(a.GetComponent("Renderer").sortingLayer) - SortingLayer.ids.indexOf(b.GetComponent("Renderer").sortingLayer));

        for (let i = 0; i < objs.length; i++)
        {
            const renderer = objs[i].GetComponent("Renderer");

            const lWM = renderer.localToWorldMatrix;
            const renM = Matrix3x3.Multiply(
                Matrix3x3.Multiply(
                    Matrix3x3.Multiply(transM, this.#projMatrix),
                    camM,
                ),
                lWM
            );
            
            renderer.renderMatrix = renM;
            renderer.Render();
        }
    }
}