class GridAdjusted extends GameBehavior
{
    OnEnable ()
    {
        this.transform.localPosition = Vector2.Add(this.transform.localPosition, new Vector2(0, 0.3125));
    }

    OnDisable ()
    {
        this.transform.localPosition = Vector2.Add(this.transform.localPosition, new Vector2(0, -0.3125));
    }
}