class Touch
{
    fingerID = 0;
    pressure = 0;
    lastTime = 0;
    deltaTime = 0;
    radius = 0;
    rawPosition = new Vector2();
    position = new Vector2();
    deltaPosition = new Vector2();
    phase = TouchPhase.Began;

    Duplicate ()
    {
        const output = new Touch();

        output.fingerID = this.fingerID;
        output.pressure = this.pressure;
        output.lastTime = this.lastTime;
        output.deltaTime = this.deltaTime;
        output.radius = this.radius;
        output.rawPosition = this.rawPosition.Duplicate();
        output.position = this.position.Duplicate();
        output.deltaPosition = this.deltaPosition.Duplicate();
        output.phase = this.phase;

        return output;
    }
}