class AnimationClip
{
    loop = true;
    framerate = 1;
    duration = 1;
    frames = [];

    async InvokeFrames (lastIndex, index, gameObject)
    {
        const frames = this.frames.filter(item => item.index > lastIndex && item.index <= index)
            .sort((a, b) => a.index - b.index);

        for (let i = 0; i < frames.length; i++) await frames[i].Invoke(gameObject);
    }

    async InvokeFramesReverse (lastIndex, index, gameObject)
    {
        const frames = this.frames.filter(item => item.index < lastIndex && item.index >= index)
            .sort((a, b) => b.index - a.index);

        for (let i = 0; i < frames.length; i++) await frames[i].Invoke(gameObject);
    }

    Unload () { }
}