// Default/Unlit

precision mediump float;

#if defined(VERTEX)
    uniform mat3 uMatrix;

    layout(location = 0) in vec2 aVertexPos;
    layout(location = 1) in vec2 aTexturePos;
    layout(location = 2) in vec4 aColor;

    out vec2 vTexturePos;
    out vec4 vColor;

    void main ()
    {
        gl_Position = vec4(uMatrix * vec3(aVertexPos, 1), 1);

        vTexturePos = aTexturePos;
        vColor = aColor;
    }

#elif defined(FRAGMENT)
    uniform sampler2D uSampler;
    uniform vec4 uTint;

    in vec2 vTexturePos;
    in vec4 vColor;

    layout(location = 0) out vec4 fragColor;

    void main ()
    {
        fragColor = texture(uSampler, vTexturePos) * vColor + uTint;
    }

#endif