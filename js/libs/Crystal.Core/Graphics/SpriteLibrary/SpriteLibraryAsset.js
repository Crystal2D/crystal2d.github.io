class SpriteLibraryAsset
{
    categories = [];

    mainLibrary = null;

    // Note that texture overriding only works when all
    // sprites in the main library ARE assigned BY "name"
    // and NOT BY "index"
    constructor (categories, mainLibrary, texture)
    {
        this.categories = categories;
        this.mainLibrary = mainLibrary;

        if (mainLibrary == null || texture == null) return;

        const mainCategories = mainLibrary.categories;

        for (let i = 0; i < mainCategories.length; i++)
        {
            let category = categories.find(item => item.name === mainCategories[i].name);

            if (category == null)
            {
                category = new SpriteLibraryCategory();
                category.name = mainCategories[i].name;
                categories.push(category);
            }

            const mainEntries = mainCategories[i].entries;

            for (let j = 0; j < mainEntries.length; j++)
            {
                let entry = category.entries.find(item => item.label === mainEntries[j].label);

                if (entry != null) continue;

                const sprName = mainEntries[j].sprite.name;
                
                entry = {
                    label: mainEntries[j].label,
                    sprite: texture.sprites.find(item => item.name === sprName).Duplicate()
                };
                category.entries.push(entry);
            }
        }
    }

    GetSprite (category, label)
    {
        return this.categories.find(item => item.name === category)?.GetSprite(label) ?? this.mainLibrary?.GetSprite(category, label);
    }

    Unload () { }
}