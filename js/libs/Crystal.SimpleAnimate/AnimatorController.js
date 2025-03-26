class AnimatorController
{
    nodes = [];
    parameters = [];

    currentNode = null;
    currentTransition = null;
    renderer = null;

    Start ()
    {
        this.currentNode = this.nodes[0];
        this.currentNode.Start();

        this.currentTransition = this.currentNode.transitions[0];
    }

    Update ()
    {
        this.currentNode.Update(this.renderer);

        if (!this.currentNode.animation.loop && this.currentNode.normalizedTime >= this.currentTransition.exitTime)
        {
            this.currentNode = this.nodes.find(item => item.name === this.currentTransition.nextNode);
            this.currentNode.Start();

            this.currentTransition = this.currentNode.transitions[0];
        }
    }
}