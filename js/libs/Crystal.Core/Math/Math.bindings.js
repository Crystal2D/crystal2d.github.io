Math.Clamp = function (value, min, max)
{
    return Math.min(Math.max(value, min), max);
};

Math.LerpUnclamped = function (a, b, t)
{
    return a + (b - a) * t;
};

Math.Lerp = function (a, b, t)
{
    return this.LerpUnclamped(a, b, Math.Clamp(t, 0, 1));
};

Math.RandomInt = function (a, b)
{
    const min = Math.min(a, b);
    const max = Math.max(a, b);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}