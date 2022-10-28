class Camera extends Behavior
{
    orthographicSize = 1;
    projectionMatrix = Matrix3x3.Ortho();
    
    get worldToCameraMatrix ()
    {
        let gOTrans = this.gameObject.transform;
        let output = Matrix3x3.TRS(gOTrans.position, gOTrans.rotation * Math.PI / 180, gOTrans.scale);
        
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
        let projM = this.projectionMatrix.matrix;
        let camM = this.worldToCameraMatrix;
        
        let mPos = new Vector2(-camM.matrix[2][0], -camM.matrix[2][1]);
        let mRot = 0;
        let mScale = new Vector2(1 / (Application.htmlCanvas.width / (Application.htmlCanvas.height / this.orthographicSize)), -1 / this.orthographicSize);
        
        let transM = Matrix3x3.TRS(mPos, mRot * Math.PI / 180, mScale);
        let viewM = Matrix3x3.Multiply(transM, camM);
        
        for (let iA = 0; iA < SceneManager.GetActiveScene().gameObjects.length; iA++)
        {
            let renderers = SceneManager.GetActiveScene().gameObjects[iA].GetComponents("SpriteRenderer");
            
            for (let iB = 0; iB < renderers.length; iB++)
            {
                renderers[iB].localSpaceMatrix = viewM;
                renderers[iB].render();
            }
        }
    }
}