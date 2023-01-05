class camFollow extends GameBehavior
{
    #amog = 0;
    
    constructor () { super(); }
    
    Start ()
    {
        const gOCount = SceneManager.GetActiveScene().gameObjects.length - 1;
        
        document.onclick = () => {
            if (this.#amog == gOCount - 1) return this.#amog = 0;
            
            this.#amog++;
        };
    }
    
    Update ()
    {
        const newPos = SceneManager.GetActiveScene().gameObjects[this.#amog].transform.position;
        
        this.gameObject.transform.position = newPos;
    }
}