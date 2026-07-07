class ToPlayerMove extends MovesBase
{
    turnOnly = false;
    away = false;

    Invoke ()
    {
        if (this.turnOnly)
        {
            if (this.away) this._char.LookAwayPlayer();
            else this._char.LookAtPlayer();

            return;
        }

        if (this.away) this._char.MoveAwayChar(Player.instance);
        else this._char.MoveToChar(Player.instance);
    }
}