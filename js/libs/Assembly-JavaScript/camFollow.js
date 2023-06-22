class camFollow extends GameBehavior
{
    constructor () { super(); }
    
    Update ()
    {
        const newPos = SceneManager.GetActiveScene().gameObjects[0].transform.position;
        
        this.transform.position = newPos;
    }
}