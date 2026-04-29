class SnekChar extends GameBehavior
{
    static steps = 2;

    #char = null;

    followers = [];

    Follower = class
    {
        #animatedIdle = false;
        moves = [];

        char = null;
        following = null;

        constructor (char, following)
        {
            this.char = char;
            this.#animatedIdle = char.animateIdle;
            char.animateIdle = false;
            char.ResetAnimation();
            char.onStop.Add(this.Move);

            this.following = following;
            following.onMoveStart.Add(this.OnMoveStart);
        }

        Move = () => {
            if (this.moves.length < SnekChar.steps || this.char.isMoving) return;

            this.char.MoveTowards(Vector2.Subtract(this.moves[0], this.char.gridPos));

            this.moves.shift();
        }

        OnMoveStart = () => {
            this.moves.push(this.following.lastNode.gridPos);
            this.char.moveSpeed = this.following.moveSpeed;
            this.Move();
            this.char.LateUpdate();
        };

        OnRemove ()
        {
            this.char.onStop.Remove(this.Move);
            this.following.onMoveStart.Remove(this.OnMoveStart);

            this.char.animateIdle = this.#animatedIdle;
            this.char.ResetAnimation();
        }

        MovesSave ()
        {
            return this.moves.map(item => {
                return {
                    x: item.x,
                    y: item.y
                };
            });
        }

        LoadMoves (data)
        {
            this.moves = data.map(item => new Vector2(item.x, item.y));
        }
    }

    Start ()
    {
        this.#char = this.GetComponent(RPGMovement);
    }

    Add (char)
    {
        this.#char.ignoredCharCollisions.push(char);
        char.ignoredCharCollisions.push(this.#char);

        for (let i = 0; i < this.followers.length; i++)
        {
            this.followers[i].char.ignoredCharCollisions.push(char);
            char.ignoredCharCollisions.push(this.followers[i].char);
        }

        const follower = new this.Follower(
            char,
            this.followers.length === 0 ? this.#char : this.followers[this.followers.length - 1].char
        );
        this.followers.push(follower);
    }

    RemoveAt (index)
    {
        if (index < 0 || index >= this.followers.length) return null;

        const follower = this.followers[index];
        const nextFollower = this.followers[index + 1];
        const following = follower.following;
        const char = follower.char;

        char.OnRemove();

        if (nextFollower != null) char.onMoveStart.Remove(nextFollower.OnMoveStart);

        this.#char.ignoredCharCollisions.splice(this.#char.ignoredCharCollisions.indexOf(char), 1);
        char.ignoredCharCollisions.splice(char.ignoredCharCollisions.indexOf(this.#char), 1);

        for (let i = 0; i < this.followers.length; i++)
        {
            if (i === index) continue;

            this.followers[i].char.ignoredCharCollisions.splice(this.followers[i].char.ignoredCharCollisions.indexOf(char), 1);
            char.ignoredCharCollisions.splice(char.ignoredCharCollisions.indexOf(this.followers[i].char), 1);
        }

        if (index !== 0 && index !== this.followers.length) following.onMoveStart.Add(nextFollower.OnMoveStart);

        return char;
    }

    RemoveLast ()
    {
        return this.RemoveAt(this.followers.length - 1);
    }

    Remove (char)
    {
        for (let i = 0; i < this.followers.length; i++)
        {
            if (this.followers[i].char === char) return RemoveAt(i);
        }

        return null;
    }

    ClearMoves ()
    {
        for (let i = 0; i < this.followers.length; i++) this.followers[i].moves = [];
    }
}