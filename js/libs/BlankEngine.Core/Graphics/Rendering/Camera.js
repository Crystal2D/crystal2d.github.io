class Camera extends Behavior
{
    #updateProjMat = true;
    
    #projMatrix = null;
    
    orthographicSize = 1;
    
    get projectionMatrix ()
    {
        return this.#projMatrix;
    }
    
    set projectionMatrix (value)
    {
        this.#updateProjMat = false;
        
        this.projMatrix = value;
    }
    
    get worldToCameraMatrix ()
    {
        const gOTrans = this.gameObject.transform;
        const output = Matrix3x3.TRS(
            gOTrans.localPosition,
            5.555555555555556e-3 * -gOTrans.localRotation * Math.PI,
            gOTrans.localScale
        );
        
        return output;
    }
    
    get cameraToWorldMatrix ()
    {
        return this.worldToCameraMatrix.inverse;
    }
    
    constructor ()
    {
        super();
    }
    
    Render ()
    {
        const camM = this.worldToCameraMatrix;
        
        if (this.#updateProjMat) this.#projMatrix = Matrix3x3.Ortho(0, this.orthographicSize, 0, this.orthographicSize);
        
        const mScale = new Vector2(1 / (Application.htmlCanvas.width / Application.htmlCanvas.height), -1);
        
        const transM = Matrix3x3.TRS(mScale, 0, mScale);
        
        const renderers = GameObject.FindComponents("Renderer");
        
        for (let i = 0; i < renderers.length; i++)
        {
            let lWM = renderers[i].transform.localToWorldMatrix;
            
            lWM.matrix[2][1] *= -1;
            lWM.matrix[2][0] *= -1;
            
            let renM = Matrix3x3.Multiply(
                Matrix3x3.Multiply(
                    Matrix3x3.Multiply(transM, this.#projMatrix),
                    camM
                ),
                lWM
            );
            
            renM.matrix[2][0] *= -1;
            
            renderers[i].localSpaceMatrix = renM;
            renderers[i].Render();
        }
    }
}