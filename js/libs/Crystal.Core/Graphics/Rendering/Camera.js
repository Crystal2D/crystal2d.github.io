class Camera extends Behavior
{
    static sortingAxis = Vector2.zero;

    static get main ()
    {
        return GameObject.FindComponents(Camera)[0];
    }

    #updateProjMat = true;
    
    #projMatrix = null;

    get #sortingDir ()
    {
        return this.sortingAxis ?? Camera.sortingAxis;
    }
    
    orthographicSize = 9;
    backgroundColor = new Color();
    sortingAxis = null;
    
    get bounds ()
    {
        const size = this.orthographicSize;
        
        return new Bounds(
            this.transform.position,
            new Vector2(
                GameWindow.aspect * size,
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
        const pointMat = Matrix3x3.Translate(new Vector2(
            ((point.x - (window.innerWidth - GameWindow.canvasWidth) * 0.5) / GameWindow.canvasWidth) - 0.5,
            ((point.y - (window.innerHeight - GameWindow.canvasHeight) * 0.5) / GameWindow.canvasHeight) - 0.5
        ));
        const targetMat = Matrix3x3.Multiply(viewMat, pointMat);

        return new Vector2(targetMat.GetValue(2, 0), -targetMat.GetValue(2, 1));
    }

    WorldToScreenPoint (point)
    {
        const viewMat = Matrix3x3.TRS(
            Vector2.Scale(this.transform.position, new Vector2(1, -1)),
            5.555555555555556e-3 * -this.transform.rotation * Math.PI,
            this.bounds.size
        );
        const pointMat = Matrix3x3.Multiply(viewMat.inverse, Matrix3x3.Translate(point));
        const targetMat = Matrix3x3.Translate(new Vector2(
            ((pointMat.GetValue(2, 0) + 0.5) * GameWindow.canvasWidth) + (window.innerWidth - GameWindow.canvasWidth) * 0.5,
            ((-pointMat.GetValue(2, 1) + 0.5) * GameWindow.canvasHeight) + (window.innerHeight - GameWindow.canvasHeight) * 0.5
        ));

        return new Vector2(targetMat.GetValue(2, 0), targetMat.GetValue(2, 1));
    }
    
    Render ()
    {
        const camM = this.worldToCameraMatrix;
        
        if (this.#updateProjMat) this.#projMatrix = Matrix3x3.Ortho(0, this.orthographicSize, 0, this.orthographicSize);
        
        const mScale = new Vector2(1 / GameWindow.aspect, -1);
        const transM = Matrix3x3.TRS(mScale, 0, mScale);
        const min = this.bounds.min;
        const max = this.bounds.max;

        const sortingDir = this.#sortingDir;

        const objs = this.gameObject.scene.tree.Find(Rect.MinMaxRect(min.x, min.y, max.x, max.y))
            .filter(item => item.GetComponent(Renderer).isLoaded && item.activeInHierarchy)
            .map(item => item.GetComponent(Renderer))
            .sort((a, b) => {
                const aPos = Vector2.Add(a.transform.position, a.sortingAxisOffset);
                const bPos = Vector2.Add(b.transform.position, b.sortingAxisOffset);

                const x = (aPos.x - bPos.x) * -sortingDir.x;
                const y = (aPos.y - bPos.y) * -sortingDir.y;

                return x + y; // idk lol
            })
            .sort((a, b) => a.sortingOrder - b.sortingOrder);
            
        if (SortingLayer.ids.length > 1) objs.sort((a, b) => SortingLayer.ids.indexOf(a.sortingLayer) - SortingLayer.ids.indexOf(b.sortingLayer));

        for (let i = 0; i < objs.length; i++)
        {
            const lWM = objs[i].localToWorldMatrix;
            const renM = Matrix3x3.Multiply(
                Matrix3x3.Multiply(
                    Matrix3x3.Multiply(transM, this.#projMatrix),
                    camM,
                ),
                lWM
            );
            
            objs[i].renderMatrix = renM;
            objs[i].Render();
        }
    }

    Duplicate ()
    {
        const output = new Camera();

        output.orthographicSize = this.orthographicSize;
        output.backgroundColor = this.backgroundColor.Duplicate();

        return output;
    }
}