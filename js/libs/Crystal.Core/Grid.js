class Grid extends Behavior
{
    cellGap = Vector2.zero;
    cellSize = new Vector2(0.5, 0.5);

    CellToWorldUnscaled (position)
    {
        return Vector2.Scale(
            position,
            Vector2.Add(this.cellSize, this.cellGap)
        );
    }

    CellToWorld (position)
    {
        const targetMat = Matrix3x3.Multiply(
            this.transform.localToWorldMatrix,
            Matrix3x3.Translate(Vector2.Scale(this.CellToWorldUnscaled(position), new Vector2(1, -1)))
        );
        
        return new Vector2(targetMat.GetValue(2, 0), -targetMat.GetValue(2, 1));
    }

    WorldToCell (position)
    {
        const posMat = Matrix3x3.Multiply(this.transform.worldToLocalMatrix, Matrix3x3.Translate(new Vector2(position.x, -position.y)));
        const basePos = Vector2.Divide(
            new Vector2(posMat.GetValue(2, 0), -posMat.GetValue(2, 1)),
            Vector2.Add(this.cellSize, this.cellGap)
        );

        return new Vector2(Math.round(basePos.x), Math.round(basePos.y));
    }

    SnapToGrid (position)
    {
        return this.CellToWorld(this.WorldToCell(position));
    }
}