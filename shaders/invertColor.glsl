#version 300 es

//
// NAME : "Default/Invert Color"
// TYPE : FRAGMENT
//

precision mediump float;

uniform sampler2D uSampler;

in vec2 vTexturePos;
in vec4 vColor;

out vec4 fragColor;

void main ()
{
    vec4 texColor = texture(uSampler, vTexturePos) * vColor;
    
    fragColor = vec4(1.0 - texColor.r, 1.0 - texColor.g, 1.0 - texColor.b, texColor.a);
}