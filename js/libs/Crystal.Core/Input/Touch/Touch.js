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
}