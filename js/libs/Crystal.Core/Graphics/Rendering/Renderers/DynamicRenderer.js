class DynamicRenderer extends Renderer
{
    onMeshUpdate = new DelegateEvent();
    
    get meshChanged ()
    {
        return false;
    }
    
    ForceMeshUpdate ()
    {
        this.onMeshUpdate.Invoke();
        
        const min = this.bounds.min;
        const max = this.bounds.max;
        const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

        this.gameObject.scene.tree?.Relocate(this.gameObject, rect);
    }
}