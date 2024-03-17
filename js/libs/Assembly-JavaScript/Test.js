class Test extends GameBehavior
{
    i = 0;

    ren = null;
    spr = null;

    Start ()
    {
        this.ren = this.GetComponent("Renderer");

        this.spr = this.ren.sprite.texture.sprites;
    }

    Update ()
    {
        if (Input.GetKeyDown(KeyCode.ArrowRight)) this.i++;
        else if (Input.GetKeyDown(KeyCode.ArrowLeft)) this.i--;

        if (this.i < 0) this.i = this.spr.length - 1;
        else if (this.i === this.spr.length) this.i = 0;

        this.ren.sprite = this.spr[this.i];
    }
}