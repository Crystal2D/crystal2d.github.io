Math.clamp = function (value, min, max)
{
    var output = value;
    
    if (output < min) output = min;
    if (output > max) output = max;
    
    return output;
};