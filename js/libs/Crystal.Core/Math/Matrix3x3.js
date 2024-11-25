class Matrix3x3
{
    matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    
    static get zero ()
    {
        const output = new Matrix3x3(
            [0, 0 ,0],
            [0, 0, 0],
            [0, 0, 0]
        );
        
        return output;
    }
    
    static get identity ()
    {
        const output = new Matrix3x3(
            [1, 0 ,0],
            [0, 1, 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    get determinant ()
    {
        const m = this.matrix;
        const a = m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2]);
        const b = m[1][0] * (m[0][1] * m[2][2] - m[2][1] * m[0][2]);
        const c = m[2][0] * (m[0][1] * m[1][2] - m[1][1] * m[0][2]);
        const output = a - b + c;
        
        return output;
    }
    
    get transpose ()
    {
        const m = this.matrix;
        const output = new Matrix3x3(
            [m[0][0], m[1][0], m[2][0]],
            [m[0][1], m[1][1], m[2][1]],
            [m[0][2], m[1][2], m[2][2]]
        );
        
        return output;
    }
    
    get inverse ()
    {
        const d = 1 / this.determinant;
        
        if (d === 0) return Matrix3x3.zero;
        
        const m = this.transpose.matrix;
        let output = new Matrix3x3(
            [
                d * (m[1][1] * m[2][2] - m[2][1] * m[1][2]),
                d * (m[1][2] * m[2][0] - m[2][2] * m[1][0]),
                d * (m[1][0] * m[2][1] - m[2][0] * m[1][1])
            ],
            [
                d * (m[0][2] * m[2][1] - m[2][2] * m[0][1]),
                d * (m[0][0] * m[2][2] - m[2][0] * m[0][2]),
                d * (m[0][1] * m[2][0] - m[2][1] * m[0][0])
            ],
            [
                d * (m[0][1] * m[1][2] - m[1][1] * m[0][2]),
                d * (m[0][2] * m[1][0] - m[1][2] * m[0][0]),
                d * (m[0][0] * m[1][1] - m[1][0] * m[0][1])
            ]
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
        const output = new Matrix3x3(
            [1, 0, 0],
            [0, 1, 0],
            [translation.x, translation.y, 1]
        );
        
        return output;
    }
    
    static Rotate (rotation)
    {
        const output = new Matrix3x3(
            [Math.cos(rotation), Math.sin(rotation), 0],
            [-Math.sin(rotation), Math.cos(rotation), 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    static Scale (scale)
    {
        const output = new Matrix3x3(
            [scale.x, 0, 0],
            [0, scale.y, 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    static TRS (translation, rotation, scale)
    {
        const output = new Matrix3x3(
            [Math.cos(rotation) * scale.x, Math.sin(rotation) * scale.y, 0],
            [-Math.sin(rotation) * scale.x, Math.cos(rotation) * scale.y, 0],
            [translation.x, translation.y, 1]
        );
        
        return output;
    }
    
    static Ortho (left, right, bottom, top)
    {
        const output = new Matrix3x3(
            [2 / (right - left), 0, 0],
            [0, 2 / (top - bottom), 0],
            [-(right + left) / (right - left), -(top + bottom) / (top - bottom), 1]
        );
        
        return output;
    }
    
    static Multiply (lhs, rhs)
    {
        const a = lhs.matrix;
        const b = rhs.matrix;
        const output = new Matrix3x3(
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
        );
        
        return output;
    }
    
    Duplicate ()
    {
        const m = this.matrix;
        const output = new Matrix3x3(
            [m[0][0], m[0][1], m[0][2]],
            [m[1][0], m[1][1], m[1][2]],
            [m[2][0], m[2][1], m[2][2]]
        );
        
        return output;
    }
    
    GetValue (column, row)
    {
        return this.matrix[column][row];
    }
    
    GetColumn (index)
    {
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++) output[i] = this.GetValue(index, i);
        
        return output;
    }
    
    GetRow (index)
    {
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++) output[i] = this.GetValue(i, index);
        
        return output;
    }
    
    SetValue (column, row, value)
    {
        this.matrix[column][row] = value;
    }
    
    SetColumn (index, values)
    {
        for (let i = 0; i <= 2; i++) this.SetValue(index, i, values[i]);
    }
    
    SetRow (index, values)
    {
        for (let i = 0; i <= 2; i++) this.SetValue(i, index, values[i]);
    }
}