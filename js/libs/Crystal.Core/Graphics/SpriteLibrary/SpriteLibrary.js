class SpriteLibrary extends Component
{
    #asset = null;

    categories = [];

    get asset ()
    {
        return this.#asset;
    }

    set asset (value)
    {
        this.#asset = value;

        if (this.gameObject == null) return;

        const resolver = this.GetComponent(SpriteResolver);
        if (resolver != null) resolver.Reload();
    }

    GetSprite (category, label)
    {
        return this.categories.find(item => item.name === category)?.GetSprite(label) ?? this.asset?.GetSprite(category, label);
    }
}