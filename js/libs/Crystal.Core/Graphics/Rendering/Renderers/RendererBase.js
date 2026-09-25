class RendererBase extends Component
{
    sortingLayer = 0;
    sortingOrder = 0;
    
    color = Color.white;
    sortingAxisOffset = Vector2.zero;
    renderMatrix = new Matrix3x3();
    onMeshUpdate = new DelegateEvent();
    
    get isLoaded ()
    {
        return false;
    }
    
    get meshChanged ()
    {
        return false;
    }
    
    get bounds ()
    {
        return new Bounds();
    }

    get localToWorldMatrix ()
    {
        return Matrix3x3.identity;
    }
    
    async Reload () { }

    async _OnLoad () { }

    RecalcBounds ()
    {
        const min = this.bounds.min;
        const max = this.bounds.max;
        const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

        this.gameObject?.scene.tree?.Relocate(this.gameObject, rect);
    }

    ForceMeshUpdate ()
    {
        this.onMeshUpdate.Invoke();
        this.RecalcBounds();
    }
    
    Render () { }
}