class AnimationFrame
{
    #actions = [];
    #cachedActions = [];

    index = 0;

    get actions ()
    {
        return [...this.#actions];
    }

    set actions (value)
    {
        this.#actions = [...value];

        this.#cachedActions = [];

        for (let i = 0; i < this.#actions.length; i++)
        {
            const classData = CrystalEngine.Inner.GetClassOfType(this.actions[i].component, 0);
            const classKeys = [...classData.args, ...classData.keys];
            const propData = classKeys.find(item => item.name === this.actions[i].property);

            this.#cachedActions.push({
                component: this.#actions[i].component,
                type: propData.type,
                value: this.#actions[i].value,
                name: propData.realName ?? propData.name,
            });
        }
    }

    async Invoke (gameObject)
    {
        for (let i = 0; i < this.#cachedActions.length; i++)
        {
            const action = this.#cachedActions[i];
            const component = gameObject.GetComponent(action.component);
            const newObj = await SceneManager.CreateObject(action.type, action.value);

            eval(`component.${action.name} = newObj`);
        }
    }
}