class SpriteLibraryAsset
{
    categories = [];

    mainLibrary = null;

    GetSprite (category, label)
    {
        return this.categories.find(item => item.name === category)?.GetSprite(label) ?? this.mainLibrary?.GetSprite(category, label);
    }

    Unload () { }
}