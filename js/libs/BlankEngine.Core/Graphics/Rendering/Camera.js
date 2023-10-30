class Camera extends Behavior
{
    #updateProjMat = true;
    #projMatrix = null;
    
    orthographic = true;
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
        const output = Matrix3x3.TRS(gOTrans.position, 5.555555555555556e-3 * -gOTrans.rotation * Math.PI, gOTrans.scale);
        
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
        
        if (this.#updateProjMat)
        {
            if (this.orthographic) this.#projMatrix = Matrix3x3.Ortho(0, this.orthographicSize, 0, this.orthographicSize);
        }
        
        const mScale = new Vector2(1 / (Application.htmlCanvas.width / Application.htmlCanvas.height), -1);
        
        const transM = Matrix3x3.TRS(mScale, 0, mScale);
        
        for (let iA = 0; iA < SceneManager.GetActiveScene().gameObjects.length; iA++)
        {
            if (!SceneManager.GetActiveScene().gameObjects[iA].activeSelf) continue;
            
            const renderers = SceneManager.GetActiveScene().gameObjects[iA].GetComponents("SpriteRenderer");
            
            for (let iB = 0; iB < renderers.length; iB++)
            {
                let lWM = renderers[iB].gameObject.transform.localToWorldMatrix;
                
                lWM.matrix[2][1] *= -1;
                lWM.matrix[2][0] *= -1;
                
                let renM = Matrix3x3.Multiply(Matrix3x3.Multiply(Matrix3x3.Multiply(transM, this.#projMatrix), camM), lWM);
                
                renM.matrix[2][0] *= -1;
                
                renderers[iB].localSpaceMatrix = renM;
                renderers[iB].Render();
            }
        }
    }
}