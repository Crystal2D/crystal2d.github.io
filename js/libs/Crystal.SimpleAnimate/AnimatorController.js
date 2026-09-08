class AnimatorController
{
    #started = false;

    nodes = [];
    parameters = [];

    gameObject = null;
    animator = null;
    currentNode = null;
    currentTransition = null;

    #IsProperTransition (transition)
    {
        let proper = true;

        for (let j = 0; j < transition.conditions.length; j++)
        {
            const condition = transition.conditions[j];
            const param = this.parameters.find(item => item.name === condition.parameter);

            if (param.value == null)
            {
                if (param.type === AnimatorControllerParameterType.Bool) param.value = param.defaultBool;
                else if (param.type === AnimatorControllerParameterType.Number) param.value = param.defaultNumber;
            }

            if (param.type === AnimatorControllerParameterType.Bool)
            {
                const value = +param.value === condition.threshold;

                if (condition.mode === AnimatorConditionMode.Equals && !value) proper = false;
                else if (condition.mode === AnimatorConditionMode.NotEquals && value) proper = false;
            }

            if (param.type === AnimatorControllerParameterType.Trigger)
            {
                const value = +param.value === condition.threshold;
                param.value = false;

                if (condition.mode === AnimatorConditionMode.If && !value) proper = false;
                else if (condition.mode === AnimatorConditionMode.IfNot && value) proper = false;
            }

            if (param.type === AnimatorControllerParameterType.Number)
            {
                if (condition.mode === AnimatorConditionMode.Greater && param.value <= condition.threshold) proper = false;
                else if (condition.mode === AnimatorConditionMode.Less && param.value >= condition.threshold) proper = false;
                else if (condition.mode === AnimatorConditionMode.Equals && param.value !== condition.threshold) proper = false;
                else if (condition.mode === AnimatorConditionMode.NotEquals && param.value === condition.threshold) proper = false;
            }
        }

        return proper;
    }

    Update ()
    {
        // Start
        if (!this.#started)
        {
            this.#started = true;

            this.currentNode = this.nodes[0].Duplicate();
            this.currentNode.Start(this.gameObject, this.animator);
        }

        // Update Node
        this.currentNode.Update(this.gameObject, this.animator);

        // Get Transition
        if (this.currentTransition == null)
        {
            const transitions = this.currentNode.transitions;

            for (let i = 0; i < transitions.length; i++)
            {
                const transition = transitions[i];

                if (!transition.isExit && transition.conditions.length === 0) continue;
                if (!this.#IsProperTransition(transition)) continue;

                this.currentTransition = transition;
                break;
            }
        }

        // Process Transition
        if (this.currentTransition == null) return;

        if (!(this.currentNode.animation.loop && this.currentTransition.isExit) && this.currentNode.normalizedTime >= this.currentTransition.exitTime)
        {
            this.currentNode.End(this.gameObject, this.animator);

            this.currentNode = this.nodes.find(item => item.name === this.currentTransition.nextNode).Duplicate();
            this.currentNode.Start(this.gameObject, this.animator);

            this.currentTransition = null;
        }
    }

    Unload () { }

    Duplicate ()
    {
        const output = new AnimatorController();

        output.parameters = this.parameters.map(item => item.Duplicate());
        output.nodes = this.nodes;
        output.currentNode = this.currentNode?.Duplicate();
        output.currentTransition = this.currentTransition;

        return output;
    }
}