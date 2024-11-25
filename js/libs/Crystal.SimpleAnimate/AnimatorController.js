class AnimatorContoller
{
    #nodeIndex = 0;
    
    nodes = [];

    renderer = null;

    Update ()
    {
        const node = this.nodes[this.#nodeIndex];

        node.Update(this.renderer);

        if (!node.animation.loop && node.normalizedTime >= node.transitions[0].exitTime)
        {
            this.#nodeIndex = node.transitions[0].nextNode;

            this.nodes[this.#nodeIndex].Start();
        }
    }
}