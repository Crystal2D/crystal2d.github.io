Object.prototype.name = null;

Object.prototype.Duplicate = () => null;

Object.InstantiationQueue = new DelegateEvent();
Object.InstantiationIDs = [];
Object.InstantiationCount = 0;

Object.prototype.Instantiate = async function (obj, parent, transform, rotation, skipComplete)
{
    if (!(obj instanceof GameObject) && !(obj instanceof Component) && !obj.__isPrefab) return null;

    Object.InstantiationCount++;

    let isPrefab = false;

    if (obj instanceof Component) obj = obj.gameObject;
    else if (obj.__isPrefab) isPrefab = true;

    const scene = SceneManager.GetActiveScene();
    const components = [];

    for (let i = +!isPrefab; i < obj.components?.length ?? 0; i++)
    {
        if (isPrefab)
        {
            components.push(await SceneManager.CreateObject(obj.components[i].type, obj.components[i].args));

            continue;
        }

        const classData = CrystalEngine.Inner.GetClassOfType(obj.components[i].constructor.name, 0);

        if (classData == null) continue;
        
        const newComp = obj.components[i].Duplicate() ?? eval(`new ${obj.components[i].constructor.name}()`);
        components.push(newComp);
    }
    
    let objID = 0;
    while (GameObject.FindByID(objID) != null || Object.InstantiationIDs.includes(objID)) objID++;
    Object.InstantiationIDs.push(objID);

    let trans = null;

    if (transform instanceof Vector2)
    {
        trans = isPrefab ? await SceneManager.CreateObject("Transform", obj.transform) : obj.transform.Duplicate();
        trans.position = transform.Duplicate();
    }
    else trans = transform ?? (isPrefab ? await SceneManager.CreateObject("Transform", obj.transform) : obj.transform.Duplicate());

    if (rotation != null) trans.rotation = rotation;

    const gameObj = new GameObject(
        `${obj.name} (Clone)`,
        components,
        obj.active,
        trans,
        objID
    );

    gameObj.scene = scene;

    const renderer = gameObj.GetComponent(Renderer);

    Object.InstantiationQueue.Add(() => {
        if (renderer != null)
        {
            const min = renderer.bounds.min;
            const max = renderer.bounds.max;
            const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);
        
            scene.tree.Insert(gameObj, rect);
        }
        
        scene.gameObjects.push(gameObj);

        parent?.AttachChild(trans);
    });

    if (isPrefab) for (let i = 0; i < obj.children?.length ?? 0; i++) await this.Instantiate(obj.children[i], trans, null, null, true);

    if (!skipComplete) await new Promise(resolve => Object.InstantiationQueue.Add(resolve));

    if (parent?.gameObject.keepOnLoad) this.DontDestroyOnLoad(gameObj);

    Object.InstantiationCount--;

    return gameObj;
};

Object.prototype.DontDestroyOnLoad = function (obj, res = [])
{
    if (!(obj instanceof GameObject) && !(obj instanceof Component)) return;

    if (obj instanceof Component) obj = obj.gameObject;
    
    if (obj.keepOnLoad)
    {
        Resources.DontDestroyOnLoad(...res);
        return;
    }

    const parent = obj.transform.parent;
    
    if (parent != null) obj.transform.parent = null;

    const child = obj.transform.GetChildren();

    for (let i = 0; i < child.length; i++) this.DontDestroyOnLoad(child[i]);

    obj.keepOnLoad = true;

    obj.transform.parent = parent;

    Resources.DontDestroyOnLoad(...res);
};

Object.prototype.DestroyOnLoad = function (obj, res = [])
{
    if (!(obj instanceof GameObject) && !(obj instanceof Component)) return;

    if (obj instanceof Component) obj = obj.gameObject;

    if (!obj.keepOnLoad)
    {
        Resources.DestroyOnLoad(...res);
        return;
    }

    const child = obj.transform.GetChildren();
    for (let i = 0; i < child.length; i++) this.DestroyOnLoad(child[i]);

    obj.keepOnLoad = false;

    Resources.DestroyOnLoad(...res);
}