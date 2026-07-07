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

Math.RandomRanged = function (a, b)
{
    const min = Math.min(a, b ?? 0);
    const max = Math.max(a, b ?? 0);

    return Math.random() * (max - min) + min;
}

Math.RandomInt = function (a, b)
{
    const min = Math.min(a, b ?? 0);
    const max = Math.max(a, b ?? 0);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Math.Translate = function (fromA, toA, fromB, toB, value)
{
    const slope = (toB - toA) / (fromB - fromA);
    const intercept = toA - slope * fromA;

    return slope * value + intercept;
}

Math.InRange = function (min, max, value, exclusive)
{
    if (exclusive) return value > min && value < max;
    return value >= min && value <= max;
}