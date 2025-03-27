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

        this.currentTransition = this.currentNode.transitions.find(item => item.isExit);
    }

    Update ()
    {
        this.currentNode.Update(this.renderer);

        if (this.currentTransition == null)
        {
            const transitions = this.currentNode.transitions;

            for (let i = 0; i < transitions.length; i++)
            {
                const transition = transitions[i];

                let useTransition = true;

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

                        if (condition.mode === AnimatorConditionMode.Equals && !value) useTransition = false;
                        else if (condition.mode === AnimatorConditionMode.NotEquals && value) useTransition = false;
                    }

                    if (param.type === AnimatorControllerParameterType.Trigger)
                    {
                        const value = +param.value === condition.threshold;

                        if (condition.mode === AnimatorConditionMode.If && !value) useTransition = false;
                        else if (condition.mode === AnimatorConditionMode.IfNot && value) useTransition = false;
                    }

                    if (param.type === AnimatorControllerParameterType.Number)
                    {
                        if (condition.mode === AnimatorConditionMode.Greater && param.value <= condition.threshold) useTransition = false;
                        else if (condition.mode === AnimatorConditionMode.Less && param.value >= condition.threshold) useTransition = false;
                        else if (condition.mode === AnimatorConditionMode.Equals && param.value !== condition.threshold) useTransition = false;
                        else if (condition.mode === AnimatorConditionMode.NotEquals && param.value === condition.threshold) useTransition = false;
                    }
                }

                if (!useTransition) continue;

                this.currentTransition = transition;

                break;
            }
        }

        if (this.currentTransition == null) return;

        if (!(this.currentNode.animation.loop && this.currentTransition.isExit) && this.currentNode.normalizedTime >= this.currentTransition.exitTime)
        {
            this.currentNode.End();

            this.currentNode = this.nodes.find(item => item.name === this.currentTransition.nextNode);
            this.currentNode.Start();

            this.currentTransition = this.currentNode.transitions.find(item => item.hasExitTime);
        }
    }
}