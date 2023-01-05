class Camera extends Behavior
{
    orthographicSize = 1;
    projectionMatrix = Matrix3x3.Ortho();
    
    get worldToCameraMatrix ()
    {
        const gOTrans = this.gameObject.transform;
        const output = Matrix3x3.TRS(gOTrans.position, -gOTrans.rotation * Math.PI / 180, gOTrans.scale);
        
        return output;
    }
    
    get cameraToWorldMatrix ()
    {
        
    }
    
    constructor ()
    {
        super();
    }
    
    Render ()
    {
        const projM = this.projectionMatrix.matrix;
        let camM = this.worldToCameraMatrix;
        
        const mScale = new Vector2(1 / (Application.htmlCanvas.width / (Application.htmlCanvas.height / this.orthographicSize)), -1 / this.orthographicSize);
        
        const transM = Matrix3x3.TRS(Vector2.zero, 0, mScale);
        
        for (let iA = 0; iA < SceneManager.GetActiveScene().gameObjects.length; iA++)
        {
            if (!SceneManager.GetActiveScene().gameObjects[iA].activeSelf) continue;
            
            const renderers = SceneManager.GetActiveScene().gameObjects[iA].GetComponents("SpriteRenderer");
            
            for (let iB = 0; iB < renderers.length; iB++)
            {
                let lWM = renderers[iB].gameObject.transform.localToWorldMatrix;
                
                lWM.matrix[2][1] *= -1;
                lWM.matrix[2][0] *= -1;
                
                let renM = Matrix3x3.Multiply(Matrix3x3.Multiply(transM, camM), lWM);
                
                renM.matrix[2][0] *= -1;
                
                renderers[iB].localSpaceMatrix = renM;
                renderers[iB].render();
            }
        }
    }
}