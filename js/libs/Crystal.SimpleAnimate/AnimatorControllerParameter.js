class AnimatorControllerParameter
{
    defaultBool = false;
    lastTriggerState = false;
    defaultNumber = 0;
    type = 0;

    value = null;

    Duplicate ()
    {
        const output = new AnimatorControllerParameter();

        output.name = this.name;
        output.defaultBool = this.defaultBool;
        output.lastTriggerState = this.lastTriggerState;
        output.defaultNumber = this.defaultNumber;
        output.type = this.type;
        output.value = this.value;

        return output;
    }
}