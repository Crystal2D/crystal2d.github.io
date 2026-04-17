class Party extends SnekChar
{
    static instance = null;

    Awake ()
    {
        this.DontDestroyOnLoad(this);
        Party.instance = this;
    }
    
    // static Add ()
}