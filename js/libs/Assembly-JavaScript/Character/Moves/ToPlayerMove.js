class ToPlayerMove extends MovesBase
{
    away = false;

    Invoke ()
    {
        if (this.away) this._char.MoveAwayChar(Player.instance);
        else this._char.MoveToChar(Player.instance);
    }
}