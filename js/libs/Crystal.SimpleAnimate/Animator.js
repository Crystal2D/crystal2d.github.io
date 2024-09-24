class Animator extends GameBehavior
{
    #renderer = null;
    #ctrl = null;

    get controller ()
    {
        return this.#ctrl;
    }

    set controller (value)
    {
        this.#ctrl = value;

        this.#ctrl.renderer = this.#renderer;
    }

    // a = new AnimatorNode();

    Start ()
    {
        this.#renderer = this.GetComponent("SpriteRenderer");

        this.controller = new AnimatorContoller();

        const a = Resources.Find("animations/characters/yoki");
        a.loop = false;
        const b = new AnimatorNode();
        b.animation = a;
        b.speed = -0.5;
        b.transitions = [
            new AnimatorTransition()
        ];

        const c = Resources.Find("animations/characters/spin");
        const d = new AnimatorNode();
        d.animation = c;
        d.speed = 10;
        // c.loop = false;
        d.transitions = [
            new AnimatorTransition()
        ];
        d.transitions[0].nextNode = 0;

        this.#ctrl.nodes.push(b, d);
    }

    Update ()
    {
        this.#ctrl?.Update();
    }
}