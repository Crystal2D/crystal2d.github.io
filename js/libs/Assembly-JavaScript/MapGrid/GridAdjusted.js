class GridAdjusted extends GameBehavior
{
    OnEnable ()
    {
        this.transform.position = Vector2.Add(this.transform.position, new Vector2(0, 0.3125));
    }

    OnDisable ()
    {
        this.transform.position = Vector2.Add(this.transform.position, new Vector2(0, -0.3125));
    }
}