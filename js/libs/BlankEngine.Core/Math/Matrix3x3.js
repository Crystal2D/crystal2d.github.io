class Matrix3x3
{
    matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    
    static get zero ()
    {
        let output = new Matrix3x3(
            [0, 0 ,0],
            [0, 0, 0],
            [0, 0, 0]
        );
        
        return output;
    }
    
    static get identity ()
    {
        let output = new Matrix3x3(
            [1, 0 ,0],
            [0, 1, 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    get transpose ()
    {
        let m = this.matrix;
        let output = new Matrix3x3(
            [m[0][0], m[1][0], m[2][0]],
            [m[0][1], m[1][1], m[2][1]],
            [m[0][2], m[1][2], m[2][2]]
        );
        
        return output;
    }
    
    constructor (a, b, c)
    {
        this.matrix = [
            a ?? [1, 0, 0],
            b ?? [0, 1, 0],
            c ?? [0, 0, 1]
        ];
    }
    
    static Translate (translation)
    {
        let output = new Matrix3x3(
            [1, 0, 0],
            [0, 1, 0],
            [translation.x, translation.y, 1]
        );
        
        return output;
    }
    
    static Rotate (rotation)
    {
        let output = new Matrix3x3(
            [Math.cos(rotation), Math.sin(rotation), 0],
            [-Math.sin(rotation), Math.cos(rotation), 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    static Scale (scale)
    {
        let output = new Matrix3x3(
            [scale.x, 0, 0],
            [0, scale.y, 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    static TRS (translation, rotation, scale)
    {
        let output = new Matrix3x3(
            [Math.cos(rotation) * scale.x, Math.sin(rotation) * scale.y, 0],
            [-Math.sin(rotation) * scale.x, Math.cos(rotation) * scale.y, 0],
            [translation.x, translation.y, 1]
        );
        
        return output;
    }
    
    static Ortho (left, right, bottom, top)
    {
        let output = new Matrix3x3(
            [right - left, 0, 0]
            [0, top - bottom, 0]
            [-(right + left) / (right - left), -(top + bottom) / (top - bottom), 1]
        );
        
        return output;
    }
    
    static Multiply (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        let a = lhs.matrix;
        let b = rhs.matrix;
        let output = new Matrix3x3();
        
        output.matrix = [
            [
                a[0][0] * b[0][0] + a[1][0] * b[0][1] + a[2][0] * b[0][2],
                a[0][1] * b[0][0] + a[1][1] * b[0][1] + a[2][1] * b[0][2],
                a[0][2] * b[0][0] + a[1][2] * b[0][1] + a[2][2] * b[0][2]
            ],
            [
                a[0][0] * b[1][0] + a[1][0] * b[1][1] + a[2][0] * b[1][2],
                a[0][1] * b[1][0] + a[1][1] * b[1][1] + a[2][1] * b[1][2],
                a[0][2] * b[1][0] + a[1][2] * b[1][1] + a[2][2] * b[1][2]
            ],
            [
                a[0][0] * b[2][0] + a[1][0] * b[2][1] + a[2][0] * b[2][2],
                a[0][1] * b[2][0] + a[1][1] * b[2][1] + a[2][1] * b[2][2],
                a[0][2] * b[2][0] + a[1][2] * b[2][1] + a[2][2] * b[2][2]
            ]
        ];
        
        return output;
    }
    
    GetValue (column, row)
    {
        if (column == null || row == null) throw BlankEngine.ThrowError(0);
        
        return this.matrix[column][row];
    }
    
    SetValue (column, row, value)
    {
        if (column == null || row == null || value == null) throw BlankEngine.ThrowError(0);
        
        this.matrix[column][row] = value;
    }
    
    GetColumn (index)
    {
        if (index == null) throw BlankEngine.ThrowError(0);
        
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++)
        {
            output[i] = this.GetValue(index, i);
        }
        
        return output;
    }
    
    SetColumn (index, values)
    {
        if (index == null || values == null || values[0] == null || values[1] == null || values[2] == null) throw BlankEngine.ThrowError(0);
        
        for (let i = 0; i <= 2; i++)
        {
            this.SetValue(index, i, values[i]);
        }
    }
    
    GetRow (index)
    {
        if (index == null) throw BlankEngine.ThrowError(0);
        
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++)
        {
            output[i] = this.GetValue(i, index);
        }
        
        return output;
    }
    
    SetRow (index, values)
    {
        if (index == null || values == null || values[0] == null || values[1] == null || values[2] == null) throw BlankEngine.ThrowError(0);
        
        for (let i = 0; i <= 2; i++)
        {
            this.SetValue(i, index, values[i]);
        }
    }
}