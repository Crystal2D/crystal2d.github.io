class SpriteLibrary extends Component
{
    categories = [];

    asset = null;

    GetSprite (category, label)
    {
        return this.categories.find(item => item.name === category)?.GetSprite(label) ?? this.asset?.GetSprite(category, label);
    }
}