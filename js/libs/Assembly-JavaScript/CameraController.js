class CameraController extends GameBehavior
{
    constructor () { super(); }
    
    LateUpdate ()
    {
        const newPos = SceneManager.GetActiveScene().gameObjects[1].transform.position;
        
        this.transform.position = newPos;
    }
}