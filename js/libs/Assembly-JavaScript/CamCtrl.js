class CamCtrl extends Viewport
{   
    clampMin = Vector2.zero;
    clampMax = Vector2.zero;

    target = null;
    
    LateUpdate ()
    {
        const charPos = this.target.position;
        this.transform.position = Vector2.Clamp(charPos, this.clampMin, this.clampMax);

        super.LateUpdate();
    }
}