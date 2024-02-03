class DynamicRenderer extends Renderer
{
    #onMUpdate = [];
    
    get meshChanged ()
    {
        return false;
    }
    
    set onMeshUpdate (value)
    {
        this.#onMUpdate.push(value);
    }
    
    ForceMeshUpdate ()
    {
        for (let i = 0; i < this.#onMUpdate.length; i++) this.#onMUpdate[i]();
    }
}