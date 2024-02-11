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
        
        const min = this.bounds.min;
        const max = this.bounds.max;
        const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

        this.gameObject.scene.tree?.Relocate(this.gameObject, rect);
    }
}