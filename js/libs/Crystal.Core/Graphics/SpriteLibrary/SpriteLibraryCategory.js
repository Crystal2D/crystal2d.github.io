class SpriteLibraryCategory
{
    entries = [];

    GetSprite (label)
    {
        return this.entries.find(item => item.label === label)?.sprite.Duplicate();
    }
}