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