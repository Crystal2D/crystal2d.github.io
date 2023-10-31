class CameraController extends GameBehavior
{
    clampMin = new Vector2(0, -4);
    clampMax = new Vector2(8, 0);
    
    constructor () { super(); }
    
    Update ()
    {
        if (Input.GetKeyDown(KeyCode.F4)) Window.fullScreen = !Window.fullScreen;
    }
    
    LateUpdate ()
    {
        const charPos = SceneManager.GetActiveScene().gameObjects[1].transform.position;
        
        const newPos = new Vector2(
            Math.Clamp(charPos.x, this.clampMin.x, this.clampMax.x),
            Math.Clamp(charPos.y, this.clampMin.y, this.clampMax.y)
        );
        
        this.transform.position = newPos;
    }
}