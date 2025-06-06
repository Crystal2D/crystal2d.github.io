class CameraController extends Viewport
{
    #cam = null;
    #targetTrans = null;
    
    clampMin = new Vector2(-3.75, -26.75);
    clampMax = new Vector2(16.25, 4.25);
    
    Start ()
    {
        this.#cam = this.GetComponent("Camera");
        this.#targetTrans = GameObject.Find("char_yoki").transform;
    }
    
    LateUpdate ()
    {
        const charPos = this.#targetTrans.GetComponent("RPGMovement").realPos;
        
        const newPos = new Vector2(
            // charPos.x,
            // charPos.y

            Math.Clamp(charPos.x, this.clampMin.x, this.clampMax.x),
            Math.Clamp(charPos.y, this.clampMin.y, this.clampMax.y)
        );

        const step = 0.0625 * 0.5;

        newPos.x -= newPos.x % step;
        newPos.y -= newPos.y % step;
        
        this.transform.position = newPos;

        super.LateUpdate();
    }
}