Math.Clamp = function (value, min, max)
{
    let output = value;
    
    if (output < min) output = min;
    if (output > max) output = max;
    
    return output;
};