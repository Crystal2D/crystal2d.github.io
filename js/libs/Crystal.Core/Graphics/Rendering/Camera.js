class Camera extends Behavior
{
    static sortingAxis = Vector2.zero;

    static get main ()
    {
        return GameObject.FindComponents(Camera)[0];
    }

    #updateProjMat = true;
    #orthoSize = 9;
    #bounds = new Bounds();
    
    #projMatrix = null;

    get #sortingDir ()
    {
        return this.sortingAxis ?? Camera.sortingAxis;
    }
    
    backgroundColor = new Color();
    sortingAxis = null;

    get gameObject ()
    {
        return super.gameObject;
    }

    set gameObject (value)
    {
        super.gameObject = value;
        this.RecalcBounds();
    }

    get orthographicSize ()
    {
        return this.#orthoSize;
    }

    set orthographicSize (value)
    {
        this.#orthoSize = value;

        this.RecalcBounds();
    }

    get viewportSize ()
    {
        const size = this.orthographicSize;
        return new Vector2(
            GameWindow.aspect * size,
            1 * size
        );
    }
    
    get bounds ()
    {
        return this.#bounds.Duplicate();
    }
    
    get projectionMatrix ()
    {
        return this.#projMatrix.Duplicate();
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

    RecalcBounds ()
    {
        if (this.gameObject == null) return;

        const bounds = new Bounds(Vector2.zero, this.viewportSize);

        const pointA = Matrix3x3.Multiply(this.cameraToWorldMatrix, Matrix3x3.Translate(bounds.min));
        const pointB = Matrix3x3.Multiply(this.cameraToWorldMatrix, Matrix3x3.Translate(new Vector2(bounds.min.x, bounds.max.y)));
        const pointC = Matrix3x3.Multiply(this.cameraToWorldMatrix, Matrix3x3.Translate(new Vector2(bounds.max.x, bounds.min.y)));
        const pointD = Matrix3x3.Multiply(this.cameraToWorldMatrix, Matrix3x3.Translate(bounds.max));

        bounds.SetMinMax(
            new Vector2(
                Math.min(pointA.GetValue(2, 0), pointB.GetValue(2, 0), pointC.GetValue(2, 0), pointD.GetValue(2, 0)),
                Math.min(-pointA.GetValue(2, 1), -pointB.GetValue(2, 1), -pointC.GetValue(2, 1), -pointD.GetValue(2, 1))
            ),
            new Vector2(
                Math.max(pointA.GetValue(2, 0), pointB.GetValue(2, 0), pointC.GetValue(2, 0), pointD.GetValue(2, 0)),
                Math.max(-pointA.GetValue(2, 1), -pointB.GetValue(2, 1), -pointC.GetValue(2, 1), -pointD.GetValue(2, 1))
            ),
        );
        bounds.center = this.transform.position;

        this.#bounds = bounds;
    }

    ScreenToWorldPoint (point)
    {
        const viewMat = Matrix3x3.TRS(
            Vector2.Scale(this.transform.position, new Vector2(1, -1)),
            5.555555555555556e-3 * -this.transform.rotation * Math.PI,
            this.viewportSize
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
            this.viewportSize
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
            .map(item => item.GetComponent(Renderer))
            .filter(item => item.isLoaded && item.gameObject.activeInHierarchy)
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