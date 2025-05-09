Math.Clamp = function (value, min, max)
{
    return Math.min(Math.max(value, min), max);
};

Math.Lerp = function (a, b, t)
{
    return a + (b - a) * t;
};