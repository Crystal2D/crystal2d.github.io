class DynamicRenderer extends Renderer
{
    #onMUpdate = [];
    
    get meshChanged ()
    {
        return false;
    }
    
    set onMeshUpdate (value)
    {
        if (this.#onMUpdate.length === 0) this.#onMUpdate[0] = value;
        else this.#onMUpdate.push(value);
    }
    
    ForceMeshUpdate ()
    {
        for (let i = 0; i < this.#onMUpdate.length; i++) this.#onMUpdate[i]();
    }
}