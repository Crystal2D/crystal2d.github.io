class CameraController extends Viewport
{
    #targetTrans = null;
    
    clampMin = new Vector2(0, 0);
    clampMax = new Vector2(9.5, 0);
    
    Start ()
    {
        this.#targetTrans = GameObject.Find("char_yoki").transform;
    }
    
    LateUpdate ()
    {
        const charPos = this.#targetTrans.position;
        
        const newPos = new Vector2(
            // charPos.x,
            // charPos.y

            Math.Clamp(charPos.x, this.clampMin.x, this.clampMax.x),
            Math.Clamp(charPos.y, this.clampMin.y, this.clampMax.y)
        );
        
        this.transform.position = newPos;
    }
}