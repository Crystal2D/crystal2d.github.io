class Grid extends Behavior
{
    cellGap = Vector2.zero;
    cellSize = new Vector2(0.5, 0.5);

    GetCellCenterWorld (cellPosition)
    {
        return Vector2.Scale(cellPosition, this.cellSize);
    }
}