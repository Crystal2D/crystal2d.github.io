class CameraController extends GameBehavior
{
    #targetTrans = null;
    
    clampMin = new Vector2(0, -4);
    clampMax = new Vector2(8, 0);
    
    constructor () { super(); }
    
    Start ()
    {
        Crispixels.effect = true;
        Application.gl.clearColor(0.25, 0.25, 0.25, 1);
        
        this.#targetTrans = GameObject.Find("char_yoki").transform;
    }
    
    Update ()
    {
        if (Input.GetKeyDown(KeyCode.F4)) Window.fullScreen = !Window.fullScreen;
    }
    
    LateUpdate ()
    {
        const charPos = this.#targetTrans.position;
        
        const newPos = new Vector2(
            Math.Clamp(charPos.x, this.clampMin.x, this.clampMax.x),
            Math.Clamp(charPos.y, this.clampMin.y, this.clampMax.y)
        );
        
        this.transform.position = newPos;
    }
}