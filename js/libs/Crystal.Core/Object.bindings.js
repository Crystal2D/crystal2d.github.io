Object.prototype.name = null;

Object.prototype.toString = function () { return this.name; };

Object.prototype.Duplicate = () => null;

Object.InstantiationQueue = new DelegateEvent();

Object.prototype.Instantiate = async function (obj, parent, transform, rotation)
{
    if (!(obj instanceof GameObject) && !(obj instanceof Component) && !obj.__isPrefab) return null;

    let isPrefab = false;

    if (obj instanceof Component) obj = obj.gameObject;
    else if (obj.__isPrefab) isPrefab = true;

    const scene = SceneManager.GetActiveScene();
    const components = [];

    for (let i = +!isPrefab; i < obj.components.length; i++)
    {
        if (isPrefab)
        {
            components.push(await SceneManager.CreateObject(obj.components[i].type, obj.components[i].args));

            continue;
        }

        const classData = CrystalEngine.Inner.GetClassOfType(obj.components[i].constructor.name, 0);

        if (classData == null) return;
        
        const newComp = obj.components[i].Duplicate();

        if (newComp != null) components.push(newComp);
    }
    
    let objID = 0;

    do objID++;
    while (GameObject.FindByID(objID) != null)

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

    const renderer = gameObj.GetComponent("Renderer");

    Object.InstantiationQueue.Add(() => {
        if (renderer != null)
        {
            const min = renderer.bounds.min;
            const max = renderer.bounds.max;
            const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);
        
            scene.tree.Insert(gameObj, rect);
        }
        
        scene.gameObjects.push(gameObj);

        parent?.AttachChild(transform);
    });

    return gameObj;
};

Object.prototype.DontDestroyOnLoad = function (obj, res = [])
{
    if (!(obj instanceof GameObject) && !(obj instanceof Component)) return null;

    if (obj instanceof Component) obj = obj.gameObject;

    obj.keepOnLoad = true;

    Resources.DontDestroyOnLoad(...res);
};

Object.prototype.DestroyOnLoad = function (obj, res = [])
{
    if (!(obj instanceof GameObject) && !(obj instanceof Component)) return null;

    if (obj instanceof Component) obj = obj.gameObject;

    obj.keepOnLoad = false;

    Resources.DestroyOnLoad(...res);
}