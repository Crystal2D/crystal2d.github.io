class TexturedRenderer extends Renderer
{   
    textureBufferID = 0;
    aTexturePosID = 0;
    
    _OnLoad ()
    {
        this.material.SetSampler2D("uSampler", 0);
        
        this.textureBufferID = this.material.AddBuffer("texture", null, 2);
        this.aTexturePosID = this.material.GetAttributeNameID("aTexturePos");
    }
}