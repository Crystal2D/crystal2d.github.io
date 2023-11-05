#version 300 es

//
// NAME : "Default/Invert Color"
// TYPE : FRAGMENT
//

precision mediump float;

uniform sampler2D uSampler;
uniform vec4 uColor;

in vec2 vTexturePos;

out vec4 fragColor;

void main ()
{
    vec4 texColor = texture(uSampler, vTexturePos) * uColor;
    
    fragColor = vec4(1.0 - texColor.r, 1.0 - texColor.g, 1.0 - texColor.b, texColor.a);
}